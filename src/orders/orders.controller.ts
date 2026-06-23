import { Body, Controller, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './Dto/create-order.dto';
import { OrderStatus } from './Entity/order.entity';
import { UpdateOrderStatusDto } from './Dto/update-order-status.dto';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateOrderDto, @Request() req) {
        return await this.ordersService.createOrder(dto, req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-orders')
    async findMyOrders(@Request() req) {
        return await this.ordersService.findMyOrders(req.user)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    async getAllOrders() {
        return await this.ordersService.findAllOrders()
    }

    @Get()
    async findOrder(orderId){
        return await this.ordersService.findOrder(orderId)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/status')
    async updateOrder(
        @Param('id') id: number,
        @Body() dto: UpdateOrderStatusDto) {
        return await this.ordersService.updateOrder(id, dto.status)
    }
}
