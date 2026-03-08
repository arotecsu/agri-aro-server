import nodemailer from "nodemailer";
import { envService } from "../config/env";

const transporter = nodemailer.createTransport({
  host: envService.get("SMTP_HOST"),
  port: Number(envService.get("SMTP_PORT")),
  secure: envService.get("SMTP_PORT") == "465",
  auth: {
    user: envService.get("SMTP_USER"),
    pass: envService.get("SMTP_PASSWORD"),
  },
});

async function sendMail(toEmail: string, subject: string, bodyEmail: string) {
  await transporter.sendMail({
    from: `Agri Aro <${envService.get("EMAIL_FROM")}>`,
    to: toEmail,
    subject: subject,
    html: bodyEmail,
  });
}

export { sendMail };
