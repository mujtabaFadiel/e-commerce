// payments/payments.controller.ts
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // User يدفع
  @Post()
  pay(@Body() dto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.pay(dto, req.user);
  }

  // User يشوف مدفوعاته
  @Get('my-payments')
  getMyPayments(@Request() req) {
    return this.paymentsService.findMyPayments(req.user.id);
  }

  // Admin يشوف كل المدفوعات
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }
}