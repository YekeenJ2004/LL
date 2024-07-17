import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { TEMPORARY_REDIRECT_STATUS } from 'next/dist/shared/lib/constants';

dotenv.config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"Link Loop" <${process.env.EMAIL}>`, // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line 
    html: html, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true
  } catch (error) {
    console.error('Error sending email:', error);
    return false
  }

}