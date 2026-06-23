import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from 'src/orders/orders.module';
import { Payment } from './Entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [OrdersModule, TypeOrmModule.forFeature([Payment])]
})
export class PaymentsModule {}
