import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './Entity/product.entity';
import { ILike, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './Dto/create-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { QueryProductDto } from './Dto/query-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        private categoriesSerivce: CategoriesService
    ) {}

    async create(dto: CreateProductDto) {
        const category = await this.categoriesSerivce.getCategoryById(dto.categoryId)
        const product = await this.productRepo.create({...dto, category})

        return await this.productRepo.save(product)
    }

    async findAll(query: QueryProductDto) {
        const { search, categoryId, limit = 10, page = 1 } = query

        const [ data, total ] = await this.productRepo.findAndCount({
            where: {
                ...(search && { name: Like(`%${search}%`) }),
                ...(categoryId && { category: {id: categoryId} })
            },
            relations: { category: true },
            skip: (page - 1) * limit,
            take: limit
        })
    
        return { data, total, page, lastPage: Math.ceil(total / limit)}
    }

    async findOne(id: number) {
        const product = await this.productRepo.findOne({
            where: {id: id},
            relations: { category: true}
        })
        
        if(!product) throw new NotFoundException('Product not found');
        return product
    }

    async findOneByname(name: string){
        const prodcut = await this.productRepo.find({
            where: { name: ILike(`%${name}%`) },
            relations: { category: true }
        })
        if(!prodcut) throw new NotFoundException('Product not found');
        return prodcut;
    }

    async updateProduct(id: number, dto: Partial<CreateProductDto>) {
        const product = await this.productRepo.findOne({where:{id}})
        
        if(!product) throw new NotFoundException('Product not found');
        
        Object.assign(product, dto)
        return await this.productRepo.save(product)
    }

    async remove(id: number) {
        const product = await this.productRepo.findOne({where: {id}})
        if(!product) throw new NotFoundException('Product not found');
        return await this.productRepo.remove(product)
    }
}
