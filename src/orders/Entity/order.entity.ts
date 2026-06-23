import { User } from "src/users/Entity/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

export const OrderStatus = {
    PENDING: 'pending',
    PAID: 'paid',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// orders/Entity/order.entity.ts

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.order)
    user!: User;

    // 👇 التعديل الجوهري: تفعيل الـ cascade لحفظ العناصر تلقائياً 👇
    @OneToMany(() => OrderItem, item => item.order, { cascade: true })
    items!: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    total!: number;

    @Column({ default: OrderStatus.PENDING })
    status!: OrderStatus;

    @CreateDateColumn()
    createdAt!: Date;
}