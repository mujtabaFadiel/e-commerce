import { Order } from 'src/orders/Entity/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
@Entity('usesrs')
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @Column({ default: UserRole.USER})
    role!: UserRole;

    @OneToMany(() => Order, order => order.user)
    order!: Order[]

    @CreateDateColumn()
    createdAt!: Date;
}