// orders/dto/create-order.dto.ts
import { IsArray, IsEnum, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../Entity/order.entity';

export class OrderItemDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}