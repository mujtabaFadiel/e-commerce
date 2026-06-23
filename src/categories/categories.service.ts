import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './Entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './Dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private cateoryRepo: Repository<Category>
    ) { }

    async create(dto: CreateCategoryDto) {
        const category = await this.cateoryRepo.create({ name: dto.name })
        return this.cateoryRepo.save(category)
    }

    async getAll() {
        return await this.cateoryRepo.find()
    }

    async getCategoryById(id: number) {
        const category = await this.cateoryRepo.findOne({ where: { id } })
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async remove(id: number) {
        const category = await this.cateoryRepo.findOne({ where: { id } })
        return await this.cateoryRepo.remove(category!)
    }
}
