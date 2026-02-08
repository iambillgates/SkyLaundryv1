import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto'; // Import dari file sebelah

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
