import{google} from 'googleapis'
import { authorize } from './OAuth2.js';

function makeBody(to, from, subject, htmlMessage) {
  const str = [
    `Content-Type: multipart/alternative; boundary="boundary"\n`,
    `MIME-Version: 1.0\n`,
    `to: ${to}\n`,
    `from: ${from}\n`,
    `subject: ${subject}\n\n`,
    `--boundary\n`,
    `Content-Type: text/plain; charset="UTF-8"\n`,
    `Content-Transfer-Encoding: 7bit\n\n`,
    `--boundary\n`,
    `Content-Type: text/html; charset="UTF-8"\n`,
    `Content-Transfer-Encoding: 7bit\n\n`,
    `${htmlMessage}\n\n`,
    `--boundary--`,
  ].join('');

  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function sendEmail(auth, to, subject, htmlMessage) {
  const gmail = google.gmail({ version: 'v1', auth });
  const raw = makeBody(to, 'hello@linkloop.app', subject, htmlMessage);
  gmail.users.messages.send(
    {
      userId: 'me',
      resource: {
        raw: raw,
      },
    },
    (err, res) => {
      if (err) return console.error('Error sending email:', err);
      console.log('Email sent:', res.data);
    }
  );
}
