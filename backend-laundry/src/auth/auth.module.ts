import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        // Secret JWT WAJIB dari env — tidak ada lagi secret hardcode.
        // Aplikasi gagal start dengan pesan yang jelas kalau belum diset,
        // supaya tidak pernah jalan diam-diam dengan secret bawaan.
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error(
            'JWT_SECRET belum diset. Salin backend-laundry/.env.example ke .env dan isi JWT_SECRET dengan string acak yang panjang.',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: '1d' }, // Token berlaku 1 hari
        };
      },
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
