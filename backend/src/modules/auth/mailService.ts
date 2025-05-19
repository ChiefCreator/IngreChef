import nodemailer, { Transporter  } from "nodemailer";
import "./../../../env/env";

import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import AppError from "../../../errors/AppError";
import { throwError } from "../../lib/error";

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }

    } as SMTPTransport.Options);
  };

  async sendActivationMail(to: string, link: string) {
    try {
      this.transporter.sendMail({
        from : process.env.SMTP_USER,
        to,
        subject: `Активация аккаунта на ${process.env.API_URL}`,
        text: `Для активации перейдите по ссылке ${link}`,
        html: `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
      });
    } catch(error) {
      throwError(error, new AppError({ message: "Неправильный адрес электронной почты. Ошибка отправки электронного письма", cause: error }));
    }
  }
}

export default new MailService();