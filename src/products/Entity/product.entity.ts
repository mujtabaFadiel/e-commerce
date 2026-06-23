// products/product.entity.ts
import { Category } from 'src/categories/Entity/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 0 })
  stock!: number;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;
}