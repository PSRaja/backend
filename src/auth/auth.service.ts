import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
constructor(
private prisma: PrismaService,
private mail: MailService,
) {}

async sendOtp(email: string) {
const existing = await this.prisma.user.findUnique({ where: { email } });
if (existing) throw new BadRequestException('Email already registered');


const otp = Math.floor(100000 + Math.random() * 900000).toString();

await this.prisma.otp.create({
  data: { email, code: otp },
});

await this.mail.sendOtp(email, otp);

return { message: 'OTP sent successfully' }

}

async register(email: string, password: string, otp: string) {
const otpRecord = await this.prisma.otp.findFirst({
where: { email, code: otp },
orderBy: { createdAt: 'desc' },
});


if (!otpRecord)
  throw new BadRequestException('Invalid OTP');

// OTP expiry (5 minutes)
const expired =
  Date.now() - otpRecord.createdAt.getTime() > 5 * 60 * 1000;

if (expired)
  throw new BadRequestException('OTP expired');

const hashed = await bcrypt.hash(password, 10);

const user = await this.prisma.user.create({
  data: { email, password: hashed },
});

// delete OTP after use
await this.prisma.otp.delete({ where: { id: otpRecord.id } });

return { message: 'User registered successfully', user };


}

async login(email: string, password: string) {
const user = await this.prisma.user.findUnique({ where: { email } });


if (!user)
  throw new BadRequestException('User not found');

const valid = await bcrypt.compare(password, user.password);

if (!valid)
  throw new BadRequestException('Invalid password');

const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '1h' },
);

return { token };


}
}
