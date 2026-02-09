/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // --- LOGIKA GENERATOR ID ---
  private async generateOrderId(serviceType: string): Promise<string> {
    const now = new Date();
    // 1. Ambil YYMMDD (Format: 240209)
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');

    // 2. Ambil Jam & Menit
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // 3. Kode Layanan (K, S, E)
    let serviceCode = 'X';
    if (serviceType === 'KILOAN') serviceCode = 'K';
    if (serviceType === 'SATUAN') serviceCode = 'S';
    if (serviceType === 'EXPRESS') serviceCode = 'E';

    // 4. Gabungkan: 240209-1430-K
    const baseId = `${dateStr}-${hours}${minutes}-${serviceCode}`;

    // 5. Cek Duplikasi
    let finalId = baseId;
    let counter = 1;

    while (true) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { orderId: finalId },
      });

      if (!existingOrder) break;

      finalId = `${baseId}-${counter}`;
      counter++;
    }

    return finalId;
  }

  // --- PRIVATE HELPER: LOG ACTIVITY ---
  private async logActivity(action: string, details: string) {
    await this.prisma.activityLog.create({
      data: { action, details },
    });
  }

  // --- CREATE ORDER ---
  async create(createOrderDto: CreateOrderDto) {
    // 1. Tentukan Harga
    const priceList = {
      KILOAN: 7000,
      SATUAN: 10000,
      EXPRESS: 15000,
    };

    const pricePerUnit = priceList[createOrderDto.serviceType] || 7000;
    const total = createOrderDto.weight * pricePerUnit;

    // 2. Generate ID Unik
    const newOrderId = await this.generateOrderId(createOrderDto.serviceType);

    // 3. Simpan ke Database
    const order = await this.prisma.order.create({
      data: {
        orderId: newOrderId,
        customerName: createOrderDto.customerName,
        weight: createOrderDto.weight,
        serviceType: createOrderDto.serviceType,
        totalPrice: total,
        status: 'PENDING',
        isPaid: createOrderDto.isPaid || false, // Default false jika tidak ada
      },
    });

    // 4. [LOGGING] Catat Aktivitas
    await this.logActivity(
      'CREATE_ORDER',
      `Pesanan baru dibuat: ${order.customerName} (${order.orderId})`,
    );

    return order;
  }

  // --- READ ALL ---
  async findAll() {
    return await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- READ ONE (By UUID) ---
  async findOne(id: string) {
    return await this.prisma.order.findUnique({ where: { id } });
  }

  // --- READ ONE (By Public ID / Resi) ---
  async findByPublicId(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Resi ${orderId} tidak ditemukan`);
    }

    return order;
  }

  // --- UPDATE ORDER ---
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    // Ambil data lama untuk perbandingan log
    const oldOrder = await this.prisma.order.findUnique({ where: { id } });

    if (!oldOrder) throw new NotFoundException('Order tidak ditemukan');

    // Lakukan Update
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });

    // [LOGGING] Cek Perubahan Status
    if (updateOrderDto.status && oldOrder.status !== updateOrderDto.status) {
      await this.logActivity(
        'UPDATE_STATUS',
        `Resi ${oldOrder.orderId}: Status berubah dari ${oldOrder.status} ke ${updateOrderDto.status}`,
      );
    }

    // [LOGGING] Cek Perubahan Pembayaran
    if (
      updateOrderDto.isPaid !== undefined &&
      oldOrder.isPaid !== updateOrderDto.isPaid
    ) {
      const statusBayar = updateOrderDto.isPaid ? 'LUNAS' : 'BELUM LUNAS';
      await this.logActivity(
        'UPDATE_PAYMENT',
        `Resi ${oldOrder.orderId}: Pembayaran diubah menjadi ${statusBayar}`,
      );
    }

    return updatedOrder;
  }

  // --- DELETE ORDER ---
  async remove(id: string) {
    // Ambil data dulu sebelum dihapus (untuk info log)
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    // Hapus Data
    await this.prisma.order.delete({ where: { id } });

    // [LOGGING] Catat penghapusan
    await this.logActivity(
      'DELETE_ORDER',
      `Pesanan ${order.customerName} (${order.orderId}) telah DIHAPUS PERMANEN`,
    );

    return { message: 'Order deleted successfully' };
  }

  // --- GET LOGS (Fitur Baru) ---
  async getLogs() {
    // Tambahkan 'await' di sini agar ESLint senang
    return await this.prisma.activityLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }
}
