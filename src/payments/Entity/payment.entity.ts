import { Order } from "src/orders/Entity/order.entity";
import { User } from "src/users/Entity/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, { eager: true })
    order!: Order;

    @ManyToOne(() => User, { eager: true })
    user!: User;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({ default: PaymentStatus.PENDING })
    status!: PaymentStatus;

    @Column({ nullable: true })
    transactionId!: string; // Stripe mock id

    @CreateDateColumn()
    createdAt!: Date;
}