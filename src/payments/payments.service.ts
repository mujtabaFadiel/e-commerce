import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './Entity/payment.entity';
import { Repository } from 'typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from 'src/users/Entity/users.entity';
import { OrderStatus } from 'src/orders/Entity/order.entity';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentsRepo: Repository<Payment>,
        private ordersService: OrdersService,
    ) { }

    async pay(dto: CreatePaymentDto, user: User) {
        const order = await this.ordersService.findOrder(dto.orderId)

        if (!order) throw new NotFoundException('Order not found');

        if (order.status === OrderStatus.PAID) {
            throw new BadRequestException('Order already paid');
        }

        const mockResult = await this.mockStripePayment(Number(order.total))

        const payment = await this.paymentsRepo.create({
            order,
            amount: order.total,
            user,
            status: mockResult.success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
            transactionId: mockResult.transactionId
        })

        await this.paymentsRepo.save(payment)

        if (mockResult.success)
            await this.ordersService.updateOrder(order.id, OrderStatus.PAID);

        return {
            success: mockResult.success,
            transactionId: mockResult.transactionId,
            amount: order.total,
            status: payment.status,
        };
    }

    private async mockStripePayment(amount: number) {
        // نحاكي تأخير الشبكة
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            success: true, // دائماً ينجح في البيئة التطويرية
            transactionId: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount,
        };
    }

    findMyPayments(userId: number) {
        return this.paymentsRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    
    // Admin
    findAll() {
        return this.paymentsRepo.find({ order: { createdAt: 'DESC' } });
    }
}
