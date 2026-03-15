import nodemailer from "nodemailer";
import { envService } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: Number(envService.get("SMTP_PORT")),
  auth: {
    user: envService.get("SMTP_USER"),
    pass: envService.get("SMTP_PASSWORD"),
  },
});

async function sendMail(toEmail: string, subject: string, bodyEmail: string) {
  const info = await transporter.sendMail({
    from: `Agri Aro <${envService.get("EMAIL_FROM")}>`,
    to: toEmail,
    subject: subject,
    html: bodyEmail,
  });

  console.log(info);
}

export { sendMail };
