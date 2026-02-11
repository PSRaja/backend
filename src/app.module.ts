import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/service';
import { MailService } from './mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    MailService,
  ],
})
export class AppModule {}
