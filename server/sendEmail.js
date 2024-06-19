// import{google} from 'googleapis'
// import { decryptToken, retrieveToken } from './lib/utils.js';
// import fs from 'fs'
// import { Token } from './lib/models.js';

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.client_id,
//   process.env.client_secret,
//   process.env.redirect_uris
// );

// const getDecryptedTokens = async() => {
//   console.log('starting to decrypt token')
//   const encryptedTokens = await retrieveToken()
//   console.log(encryptedTokens)
//   const decryptedTokens = decryptToken(encryptedTokens);
//   return JSON.parse(decryptedTokens);
// }

// async function makeBody(to, from, subject, htmlMessage) {
//   const str = [
//     `Content-Type: multipart/alternative; boundary="boundary"\n`,
//     `MIME-Version: 1.0\n`,
//     `to: ${to}\n`,
//     `from: ${from}\n`,
//     `subject: ${subject}\n\n`,
//     `--boundary\n`,
//     `Content-Type: text/plain; charset="UTF-8"\n`,
//     `Content-Transfer-Encoding: 7bit\n\n`,
//     `--boundary\n`,
//     `Content-Type: text/html; charset="UTF-8"\n`,
//     `Content-Transfer-Encoding: 7bit\n\n`,
//     `${htmlMessage}\n\n`,
//     `--boundary--`,
//   ].join('');

//   return Buffer.from(str)
//     .toString('base64')
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
// }

// export async function sendEmail( to, subject, htmlMessage) {
//   const tokens = await getDecryptedTokens();
//   oAuth2Client.setCredentials(tokens);

//   const gmail = google.gmail({ version: 'v1', oAuth2Client });
//   const raw = await makeBody(to, 'hello@linkloop.app', subject, htmlMessage);
//   console.log('body made')
//   const response = await gmail.users.messages.send(
//     {
//       userId: 'me',
//       resource: {
//         raw: raw,
//       },
//     },
//     (err, res) => {
//       if (err) return console.error('Error sending email:', err);
//       console.log('Email sent:', res.data);
//     }
//   );
// }
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
    from: `"Your Name" <${process.env.EMAIL}>`, // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line 
    html: html, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error sending email:', error);
  }
}