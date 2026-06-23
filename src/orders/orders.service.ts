import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './Entity/order.entity';
import { OrderItem } from './Entity/order-item.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './Dto/create-order.dto';
import { User } from 'src/users/Entity/users.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,

        @InjectRepository(OrderItem)
        private orderItemRepo: Repository<OrderItem>,

        private productsSrevice: ProductsService
    ) { }

    async createOrder(dto: CreateOrderDto, user: User) {
        let total = 0;
        const orderItems: OrderItem[] = [];

        for (const item of dto.items) {
            const product = await this.productsSrevice.findOne(item.productId)

            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`);
            }

            if (product.stock < item.quantity)
                throw new BadRequestException(`${product.name} out of stock`);

            const orderItem = await this.orderItemRepo.create({
                product,
                quantity: item.quantity,
                price: product.price
            })

            orderItems.push(orderItem)
            total += Number(product.price * item.quantity)

            await this.productsSrevice.updateProduct(product.id, {
                stock: product.stock - item.quantity
            })
        }

        const order = this.orderRepo.create({ user, items: orderItems, total })
        return await this.orderRepo.save(order)
    }

    async findMyOrders(userId: number) {
        return await this.orderRepo.findOne({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        })
    }

    //only admins
    async findAllOrders() {
        return await this.orderRepo.find({ order: { createdAt: 'DESC' } })
    }

    async findOrder(id: number) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async updateOrder(id: number, status: OrderStatus) {
        const order = await this.orderRepo.findOne({ where: { id } })
        if (!order) throw new NotFoundException('Order not found');

        order.status = status
        return await this.orderRepo.save(order)
    }
}
