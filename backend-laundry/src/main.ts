import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Gagal keras di awal kalau JWT_SECRET belum diset — jangan pernah
  // jalan dengan secret bawaan (itu yang terjadi sebelumnya).
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET belum diset. Salin backend-laundry/.env.example ke .env dan isi JWT_SECRET dengan string acak yang panjang.',
    );
  }

  const app = await NestFactory.create(AppModule);

  // CORS hanya untuk frontend sendiri (bukan semua origin).
  // Atur lewat env FRONTEND_URL, default http://localhost:3000.
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Port dari env, default 4000
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
}
void bootstrap();
