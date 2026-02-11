import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/service';
//import { BravoService } from '../bravo/bravo.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    //BravoService,
  ],
})
export class AuthModule {}
