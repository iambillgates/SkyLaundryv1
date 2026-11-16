import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // 👇 --- PINDAHKAN RUTE STATIS KE SINI (DI ATAS :id) --- 👇

  @UseGuards(JwtAuthGuard)
  @Get('activity/logs')
  getLogs() {
    return this.ordersService.getLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats/financial')
  getFinancialStats() {
    return this.ordersService.getFinancialStats();
  }

  // Publik: pelacakan pesanan oleh pelanggan lewat nomor resi — tanpa login.
  // Satu-satunya rute orders yang tetap terbuka.
  @Get('track/:orderId')
  async trackOrder(@Param('orderId') orderId: string) {
    return this.ordersService.findByPublicId(orderId);
  }

  // 👆 -------------------------------------------------- 👆

  // 👇 --- RUTE DINAMIS (Dengan Parameter) DI BAWAH --- 👇

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
