import { Injectable, BadRequestException } from '@nestjs/common';
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
export class AppService {
  constructor(private prisma: PrismaService) {}

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
}
