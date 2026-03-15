import nodemailer from "nodemailer";
import {env} from "../../../../config/env.service.js"

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.email,
      pass: env.emailPassword,
    },
  });

  const mailOptions = {
    from:"Saraha App",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
