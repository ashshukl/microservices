import { Service } from "typedi";
import nodemailer from "nodemailer";

@Service()
export class MailSvc {
  private transporter: nodemailer.Transporter;

  private mailOptions = {
    from: "<YOUR_ID>@hcltech.com",
    to: "<Recipient's Emial Id>",
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
        user: "<YOUR_ID>@gmail.com",
        pass: "<Your App Password>",
      },
    });
  }

  async sendMail(message: string) {
    const info = await this.transporter.sendMail(this.mailOptions);
    console.log("Logging from Email Notifier-Email Sent");
  }
}
