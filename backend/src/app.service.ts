import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Items } from 'mercadopago/dist/clients/commonTypes';
import type { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { PrismaService } from './prisma.service';
import { createMercadoPagoPreference } from './mercadopago/createPreference';

/** Cuerpo esperado al crear una reserva (p. ej. desde el widget de reservas). */
export interface CreateReservationPayload {
  userName: string;
  userEmail: string;
  date: string;
  timeSlotId: number;
  paymentMethod: string;
  /** Claves = id de categoría (stringificado); valores = cantidad de pasajes. */
  cart: Record<string, number>;
}

@Injectable()
export class AppService implements OnModuleInit{
  constructor(private prisma: PrismaService) {}
  async onModuleInit() {
    const admin = await this.prisma.adminUser.findUnique({
      where: { username: 'admin' },
    });

    if (!admin) {
      await this.prisma.adminUser.create({
        data: {
          username: 'admin',
          password: 'ushuaia2026',
        },
      });
      console.log('🦇 Administrador maestro creado automáticamente al iniciar.');
    }
  }
  async getAdminReservations() {
    return this.prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        timeSlot: true,
        tickets: {
          include: {
            ticketCategory: true,
          },
        },
      },
    });
  }

  async getBookingData() {
    const categories = await this.prisma.ticketCategory.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    const timeSlots = await this.prisma.timeSlot.findMany({
      where: { isActive: true },
      orderBy: { time: 'asc' },
    });
    return { categories, timeSlots };
  }

  async createReservation(payload: CreateReservationPayload) {
    const { userName, userEmail, date, timeSlotId, cart, paymentMethod } =
      payload;
    const categories = await this.prisma.ticketCategory.findMany();

    let calculatedTotal = 0;
    const itemsForMP: Items[] = [];
    const ticketsToCreate: Prisma.ReservationTicketUncheckedCreateWithoutReservationInput[] =
      [];

    for (const categoryIdStr of Object.keys(cart)) {
      const qty = cart[categoryIdStr];
      if (typeof qty === 'number' && qty > 0) {
        const catId = parseInt(categoryIdStr, 10);
        const category = categories.find((c) => c.id === catId);
        if (!category)
          throw new BadRequestException(`Categoría ${catId} no encontrada`);

        calculatedTotal += category.price * qty;
        ticketsToCreate.push({
          ticketCategoryId: catId,
          quantity: qty,
          priceAtBooking: category.price,
        });

        itemsForMP.push({
          id: category.id.toString(),
          title: `Ushuaia City Train - ${category.name}`,
          quantity: qty,
          unit_price: category.price,
          currency_id: 'ARS',
        });
      }
    }

    // 1. Guardamos la reserva en la DB (igual para ambos métodos)
    const newReservation = await this.prisma.reservation.create({
      data: {
        userName,
        userEmail,
        date: new Date(date),
        timeSlotId,
        paymentMethod, // Guardamos si fue 'mercadopago' o 'transfer'
        totalPrice: calculatedTotal,
        tickets: { create: ticketsToCreate },
      },
    });

    // 2. Lógica condicionada por el método de pago
    if (paymentMethod === 'mercadopago') {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (accessToken === undefined || accessToken === '') {
        throw new BadRequestException(
          'MERCADOPAGO_ACCESS_TOKEN no está definido en el servidor',
        );
      }
      const preferenceBody: PreferenceRequest = {
        items: itemsForMP,
        back_urls: {
          success: 'http://localhost:3000/success',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending',
        },
        auto_return: 'approved',
        external_reference: newReservation.id.toString(),
      };

      const response = await createMercadoPagoPreference(
        accessToken,
        preferenceBody,
      );

      return {
        method: 'mercadopago' as const,
        init_point: response.init_point ?? '',
        preferenceId: response.id,
      };
    } else {
      // Si es transferencia, devolvemos los datos del banco
      return {
        method: 'transfer',
        reservationId: newReservation.id,
        bankData: {
          alias: 'USHUAIA.CITY.TRAIN',
          cbu: '0000003100012345678901',
          bank: 'Banco Tierra del Fuego',
          titular: 'Ushuaia City Train S.A.',
        },
      };
    }
  }
  async updatePaymentStatus(id: number, status: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { paymentStatus: status },
    });
  }
  async validateAdmin(username: string, passwordString: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    // En un sistema en producción real, acá usaríamos "bcrypt" para comparar contraseñas encriptadas.
    // Por ahora, verificamos coincidencia exacta.
    if (user && user.password === passwordString) {
      return user;
    }
    return null;
  }

  // --- NUEVO: Escuchar a MercadoPago (Webhook) ---
  async handleMercadoPagoWebhook(body: any) {
    // MercadoPago a veces manda 'type' o 'topic', y el ID del pago adentro de 'data' o suelto.
    const type = body?.type || body?.topic;
    const paymentId = body?.data?.id || body?.id;

    if (type === 'payment' && paymentId) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      
      try {
        // Le preguntamos a MercadoPago los detalles de este pago
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const paymentData = await response.json();

        // Si recordás, antes guardamos el ID de la reserva en 'external_reference'
        if (paymentData.external_reference) {
          const reservationId = parseInt(paymentData.external_reference, 10);
          const status = paymentData.status; // Puede ser 'approved', 'pending', 'rejected'

          // Actualizamos la base de datos automáticamente
          await this.prisma.reservation.update({
            where: { id: reservationId },
            data: { paymentStatus: status }
          });
          
          console.log(`🚂 [Webhook] Reserva #${reservationId} actualizada a: ${status}`);
        }
      } catch (error) {
        console.error('Error procesando webhook de MercadoPago:', error);
      }
    }
    
    // Siempre hay que responderle "OK" a MP para que no siga insistiendo
    return { received: true };
  }
}
