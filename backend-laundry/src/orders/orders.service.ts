import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // --- LOGIKA GENERATOR ID (Baru) ---
  private async generateOrderId(serviceType: string): Promise<string> {
    const now = new Date();

    // 1. Ambil YYMMDD (Tahun 2 digit, Bulan, Tanggal)
    // slice(2, 10) akan mengambil dari index 2 (melewati '20' di tahun)
    // Hasil: 240209
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');

    // 2. Ambil Jam & Menit (HHmm)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // 3. Kode Layanan Singkat (1 Huruf)
    let serviceCode = 'X'; // Default
    if (serviceType === 'KILOAN') serviceCode = 'K';
    if (serviceType === 'SATUAN') serviceCode = 'S';
    if (serviceType === 'EXPRESS') serviceCode = 'E';

    // 4. Gabungkan: YYMMDD-HHmm-S
    // Contoh: 240209-1430-K
    const baseId = `${dateStr}-${hours}${minutes}-${serviceCode}`;

    // 5. Cek Duplikasi (Looping)
    let finalId = baseId;
    let counter = 1;

    while (true) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { orderId: finalId },
      });

      if (!existingOrder) {
        break;
      }

      // Jika ada duplikat di menit yang sama, tambah angka belakang
      // Contoh: 240209-1430-K1
      finalId = `${baseId}${counter}`;
      counter++;
    }

    return finalId;
  }

  // --- CREATE (Dimodifikasi) ---
  // Pastikan import ServiceType ada (biasanya dari @prisma/client)
  // import { ServiceType, OrderStatus } from '@prisma/client';

  async create(createOrderDto: CreateOrderDto) {
    // 1. DAFTAR HARGA (Configurable)
    // Anda bisa mengubah angka ini sesuai harga laundry Anda
    const priceList = {
      KILOAN: 7000, // Rp 7.000 per Kg
      SATUAN: 10000, // Rp 10.000 per Pcs
      EXPRESS: 15000, // Rp 15.000 per Kg (Layanan Kilat)
    };

    // 2. Ambil harga satuan berdasarkan tipe layanan
    // Jika tipe tidak dikenali, default ke 7000 (safety fallback)
    const pricePerUnit = priceList[createOrderDto.serviceType] || 7000;

    // 3. Hitung Total Harga
    const total = createOrderDto.weight * pricePerUnit;

    // 4. Generate Order ID (Logic Kustom Anda)
    const newOrderId = await this.generateOrderId(createOrderDto.serviceType);

    // 5. Simpan ke Database
    return await this.prisma.order.create({
      data: {
        orderId: newOrderId,
        customerName: createOrderDto.customerName,
        weight: createOrderDto.weight,
        serviceType: createOrderDto.serviceType, // Harus sesuai Enum Prisma (KILOAN/SATUAN/EXPRESS)
        totalPrice: total,
        status: 'PENDING', // Default status sesuai Enum Prisma
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

  async findByPublicId(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: orderId }, // Cari di kolom orderId
    });

    if (!order) {
      throw new NotFoundException(`Resi ${orderId} tidak ditemukan`);
    }

    return order;
  }
}
