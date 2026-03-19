import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // 👇 --- PINDAHKAN RUTE STATIS KE SINI (DI ATAS :id) --- 👇

  @Get('activity/logs')
  getLogs() {
    return this.ordersService.getLogs();
  }

  @Get('stats/financial')
  getFinancialStats() {
    return this.ordersService.getFinancialStats();
  }

  @Get('track/:orderId')
  async trackOrder(@Param('orderId') orderId: string) {
    return this.ordersService.findByPublicId(orderId);
  }

  // 👆 -------------------------------------------------- 👆

  // 👇 --- RUTE DINAMIS (Dengan Parameter) DI BAWAH --- 👇

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
