import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  // 1️⃣ SEND OTP BEFORE REGISTER
  async sendOtp(email: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already exists');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP
    await this.prisma.otp.create({
      data: { email, otp },
    });

    // send mail using Gmail
    await this.mailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent to email' };
  }

  // 2️⃣ REGISTER ONLY AFTER OTP VERIFY
  async register(email: string, password: string, otp: string) {
    const otpRecord = await this.prisma.otp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already exists');

    const username = email.split('@')[0];
    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hash,
      },
    });

    return { message: 'User registered successfully', userId: user.id };
  }

  // 3️⃣ LOGIN
  async login(loginId: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: loginId },
          { username: loginId },
        ],
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid password');

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      'MY_SECRET_KEY',
      { expiresIn: '1h' },
    );

    return { message: 'Login success', token };
  }
}
