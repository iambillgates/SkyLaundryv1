import { ServiceType } from '@prisma/client';
// HAPUS baris: import { CreateOrderDto } from './create-order.dto';

export class CreateOrderDto {
  customerName: string;
  weight: number;
  serviceType: ServiceType;
}
