import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongoUrl = process.env.MONGO
console.log(process.env.PORT)
export const connectToDB = async () =>{
    const connection = {}
    try {
        if (connection.isConnected) return 
        const db =  await mongoose.connect(process.env.MONGO);
        connection.isConnected  = db.connections[0].readyState
    } catch (error) {
        console.log('could not connect to db', error)
    }
}

export const closeConnectionToDB = async () => {
    const connection = {}
    try {
        if (!connection.isConnected) return 
        const db =  await mongoose.disconnect();
        connection.isConnected  = db.connections[0].readyState
    } catch (error) {
        console.log('could not close connection', error)
    }
}

export const deleteUser = (username) =>{

}

export function decryptToken(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  }
  
  export function encryptToken(token) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(token));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//       user: 'hello@linkloop.app', // Your email address
//       pass: 'u4DhhKdm72d35nH<1',  // Your email password (Consider using environment variables for security)
//     },
// });

// export const sendEmail = (to, subject, text, htmlContent, username) => {
//     const mailOptions = {
//       from: 'hello@linkloop.app', // Sender address
//       to: to,                       // List of recipients
//       subject: subject,             // Subject line
//       text: text,                   // Plain text body
//       html: htmlContent(username, text),            // HTML body content
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log('Error occurred: ' + error.message);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//     });
// }
