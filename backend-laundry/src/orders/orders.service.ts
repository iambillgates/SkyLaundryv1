import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // --- LOGIKA GENERATOR ID (Baru) ---
  private async generateOrderId(serviceType: string): Promise<string> {
    const now = new Date();

    // 1. Format Tanggal & Waktu: YYYYMMDDHHmm
    // Menggunakan padStart(2, '0') agar jam 9 menjadi '09'
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // 20240207
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // 2. Mapping Service Type ke Kode Angka
    // REGULAR -> 01, EXPRESS -> 02 (Bisa disesuaikan)
    let serviceCode = '00';
    if (serviceType === 'REGULAR') serviceCode = '01';
    if (serviceType === 'EXPRESS') serviceCode = '02';

    // Gabungkan menjadi Base ID: 202402071930-01
    const baseId = `${dateStr}${hours}${minutes}-${serviceCode}`;

    // 3. Cek Unik (Looping untuk menangani order bersamaan)
    let finalId = baseId;
    let counter = 1;

    while (true) {
      // Cek apakah ID ini sudah ada di database?
      const existingOrder = await this.prisma.order.findUnique({
        where: { orderId: finalId },
      });

      if (!existingOrder) {
        break; // Jika tidak ada, ID aman digunakan
      }

      // Jika ada (duplikat), tambahkan counter: 202402071930-01-1
      finalId = `${baseId}-${counter}`;
      counter++;
    }

    return finalId;
  }

  // --- CREATE (Dimodifikasi) ---
  async create(createOrderDto: CreateOrderDto) {
    // 1. Hitung Harga (Logic Lama Anda)
    const pricePerKg = createOrderDto.serviceType === 'EXPRESS' ? 15000 : 8000;
    const total = createOrderDto.weight * pricePerKg;

    // 2. Generate Order ID (Logic Baru)
    const newOrderId = await this.generateOrderId(createOrderDto.serviceType);

    // 3. Simpan ke Database
    return await this.prisma.order.create({
      data: {
        orderId: newOrderId, // Field baru dimasukkan di sini
        customerName: createOrderDto.customerName,
        weight: createOrderDto.weight,
        serviceType: createOrderDto.serviceType,
        totalPrice: total,
        status: 'PENDING',
      },
    });
  }

  // READ ALL
  async findAll() {
    return await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // READ ONE
  // Bisa cari by ID internal atau orderId custom
  async findOne(id: string) {
    return await this.prisma.order.findUnique({
      where: { id },
    });
  }

  // UPDATE
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  // DELETE
  async remove(id: string) {
    return await this.prisma.order.delete({
      where: { id },
    });
  }
}
