import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './Dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { QueryProductDto } from './Dto/query-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private productService: ProductsService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() dto: CreateProductDto) {
        return await this.productService.create(dto)
    }

    @Get()
    async findAll(@Query() query: QueryProductDto) {
        return await this.productService.findAll(query)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.findOne(id)
    }

    @Get('by-name/:name')
    async findOneByname(@Param('name') name: string) {
        return await this.productService.findOneByname(name)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: Partial<CreateProductDto>) {
        return await this.productService.updateProduct(+id, dto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.remove(id)
    }
}
