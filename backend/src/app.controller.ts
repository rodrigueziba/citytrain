import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('booking-data')
  async getBookingData() {
    return await this.appService.getBookingData();
  }

  // NUEVO: Ruta para recibir los datos del formulario
  @Post('reservations')
  async createReservation(@Body() body: any) {
    return await this.appService.createReservation(body);
  }
}
