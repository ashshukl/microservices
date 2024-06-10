import { Service } from "typedi";
import nodemailer from "nodemailer";

@Service()
export class MailSvc {
  private transporter: nodemailer.Transporter;

  private mailOptions = {
    from: "<your emal>@gmail.com",
    to: "recipient's email",
    subject: "Notification Message",
    text: "<Message Text>",
  };

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "<your emal>",
        pass: "your app password",
      },
    });
  }

  async sendMail(message: string) {
    this.mailOptions.text = message;
    const info = await this.transporter.sendMail(this.mailOptions);
    console.log("Logging from Email Notifier-Email Sent");
  }
}
