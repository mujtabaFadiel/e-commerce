import { IsEnum, IsIn } from 'class-validator';
import { OrderStatus } from '../Entity/order.entity';

export class UpdateOrderStatusDto {
  @IsIn(Object.values(OrderStatus))
  status!: OrderStatus;
}