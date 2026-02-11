import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
constructor(private auth: AuthService) {}

@Post('send-otp')
sendOtp(@Body('email') email: string) {
return this.auth.sendOtp(email);
}

@Post('register')
register(@Body() body: any) {
const { email, password, otp } = body;
return this.auth.register(email, password, otp);
}

@Post('login')
login(@Body() body: any) {
const { email, password } = body;
return this.auth.login(email, password);
}
}
