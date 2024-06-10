import fs from 'fs'
import { google } from 'googleapis';
import  open  from 'open';
import readline from 'readline'
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

console.log(process.env.ENCRYPTION_KEY)
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.enc'
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const IV_LENGTH = 16;



const client_secret = `${process.env.client_secret}`
const client_id = `${process.env.client_id}`
const redirect_uris = `${process.env.redirect_uris}`
console.log(client_id, client_secret, redirect_uris)
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

function decryptToken(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}

function encryptToken(token) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(JSON.stringify(token));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Get and store new token if needed
function getNewToken(callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  open(authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      const encryptedToken = encryptToken(token)
      fs.writeFileSync(TOKEN_PATH, encryptedToken);
      console.log('Token stored to', TOKEN_PATH);
      callback(oAuth2Client);
    });
  });
}

// Load token if it exists
export function authorize(callback) {
  if (fs.existsSync(TOKEN_PATH)) {
    const encryptedToken = fs.readFileSync(TOKEN_PATH, 'utf8');
    const token = decryptToken(encryptedToken);
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
  } else {
    getNewToken(callback);
  }
}