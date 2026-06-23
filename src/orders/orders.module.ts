import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './Entity/order.entity';
import { OrderItem } from './Entity/order-item.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductsModule],
  exports: [OrdersService]
})
export class OrdersModule {}
