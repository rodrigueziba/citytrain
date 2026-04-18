import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AppService } from './app.service';

type AdminLoginBody = {
  username?: string;
  password?: string;
};

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('booking-data')
  async getBookingData() {
    return await this.appService.getBookingData();
  }

  @Post('reservations')
  async createReservation(@Body() body: any) {
    return await this.appService.createReservation(body);
  }

  // --- NUEVO: La puerta para el panel de Admin ---
  @Get('admin/reservations')
  async getAdminReservations() {
    return await this.appService.getAdminReservations();
  }

  @Patch('admin/reservations/:id/status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return await this.appService.updatePaymentStatus(
      parseInt(id, 10),
      body.status,
    );
  }

  @Post('admin/login')
  adminLogin(@Body() body: AdminLoginBody) {
    // Verificamos el usuario y contraseña maestro
    if (body.username === 'admin' && body.password === 'ushuaia2026') {
      return { success: true, token: 'baticueva-token-secreto-123' };
    }
    return { success: false, message: 'Credenciales inválidas' };
  }
}
