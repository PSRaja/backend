import { Injectable } from '@nestjs/common';
import * as brevo from '@getbrevo/brevo';

@Injectable()
export class MailService {

  private apiInstance = new brevo.TransactionalEmailsApi();

  constructor() {
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );
  }

  async sendOtp(email: string, otp: string) {

    await this.apiInstance.sendTransacEmail({
      sender: {
        email: "yourverifiedemail@gmail.com",  // must verify in Brevo
        name: "Auth App"
      },
      to: [{ email }],
      subject: "Your OTP Code",
      textContent: `Your OTP is: ${otp}`,
    });

  }
}
