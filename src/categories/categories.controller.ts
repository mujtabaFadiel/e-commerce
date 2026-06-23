import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './Dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesSerivce: CategoriesService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() dto: CreateCategoryDto) {
        return await this.categoriesSerivce.create(dto)
    }

    @Get()
    async getAll(){
        return await this.categoriesSerivce.getAll()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async remove(@Param('id') id: number){
        return await this.categoriesSerivce.remove(id)
    }
}
