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


async function login() {
  const email = (document.getElementById("loginEmail") as HTMLInputElement).value;
const password = (document.getElementById("loginPassword") as HTMLInputElement).value;


  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    // Redirect to next page
    window.location.href = "video.html";
  } else {
    alert("Login Failed");
  }
}
