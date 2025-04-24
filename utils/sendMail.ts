import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import ejs from "ejs";

dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, string>;
}

export const sendMail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const templatePath = path.join(__dirname, "../mails", options.templateName);

  const html: string = await ejs.renderFile(
    templatePath,
    options.templateData ?? {}
  );

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: options.email,
    subject: options.subject,
    html,
  };

  // send the mail
  await transporter.sendMail(mailOptions);
};

export default sendMail;
