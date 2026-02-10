import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from './prisma/service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, password: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already exists');

    const username = email.split('@')[0]; // auto-generate username
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
      { expiresIn: '1h' }
    );

    return { message: 'Login success', token };
  }
}
