import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1️⃣ SEND OTP BEFORE REGISTER
  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@gmail.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent to email' })
  sendOtp(@Body() body: { email: string }) {
    return this.authService.sendOtp(body.email);
  }

  // 2️⃣ REGISTER ONLY AFTER OTP
  @Post('register')
  @ApiOperation({ summary: 'Register new user after OTP verification' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@gmail.com' },
        password: { type: 'string', example: '123456' },
        otp: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() body: { email: string; password: string; otp: string }) {
    return this.authService.register(body.email, body.password, body.otp);
  }

  // 3️⃣ LOGIN (same as before)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@gmail.com' },
        password: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get()
  @ApiOperation({ summary: 'Check API status' })
  hello() {
    return 'API is running';
  }
}
