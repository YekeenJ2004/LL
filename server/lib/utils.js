import mongoose from "mongoose";
import dotenv from 'dotenv';
import crypto from 'crypto'
import { Token } from "./models.js";
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

export function decryptToken(encryptedToken) {
    const [ivHex, encryptedDataHex] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedDataHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString());
}
  
export function encryptToken(token) {
    const iv = crypto.randomBytes(Number(process.env.IV_LENGTH));
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(JSON.stringify(token));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export const saveTokenToDB = async (encryptedToken) =>{
    try{
        await connectToDB()
        const token = new Token(
            {
                token: encryptedToken,
                name: 'token'
            }
        )
        const savedToken = await token.save()
    }catch(err){
        console.log('could not store token to db', err)
    }
}

export const retrieveToken = async () => {
    try {
        console.log('retreiving token')
        await connectToDB();
        const tokenDoc = await Token.findOne({ name: 'token' });
        if(tokenDoc){
            console.log('tokenfound')
            return tokenDoc.token;
        } else {
            console.log('token not found')
            throw new Error('Token not found');
        }
    } catch (err) {
        console.error('Could not retrieve token from the database:', err);
        throw err; // Rethrow the error to allow the calling function to handle it
    }
};
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
