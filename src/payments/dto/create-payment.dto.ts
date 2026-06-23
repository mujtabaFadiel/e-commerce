// payments/dto/create-payment.dto.ts
import { IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  orderId!: number;
}