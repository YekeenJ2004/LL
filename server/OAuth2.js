// import fs from 'fs'
// import { google } from 'googleapis';
// import  open  from 'open';
// import readline from 'readline'

// const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
// const TOKEN_PATH = 'token.json';

// const credentials = JSON.parse(fs.readFileSync('./credentials.json'));

// const { client_secret, client_id, redirect_uris } = credentials.web;
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// // Get and store new token if needed
// function getNewToken(callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   open(authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//       console.log('Token stored to', TOKEN_PATH);
//       callback(oAuth2Client);
//     });
//   });
// }

// // Load token if it exists
// export function authorize(callback) {
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }
