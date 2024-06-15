import {User} from "./lib/models.js"
import {convertToDashboardDataObject} from './lib/dashboardpagedata.js'
import {convertToMerchantPageDataObject} from './lib/merchantpagedata.js'
import { convertToOffersPageData, getMerchantOffersFromDB } from "./lib/offerspagedata.js"
import { convertToLinksDataObject } from "./lib/linkspagedata.js"
import { saveNewUserTODatabase, checkIfUserExists, checkIfEmailExists} from "./lib/apply.js"
import { authenticateUser } from "./lib/login.js"
import { changeEmail } from "./lib/updateemail.js"
import express from 'express';
import cors from 'cors'
import { fetchPaymentsFromDB } from "./lib/payments.js"
import { changePaypal, checkifValidPaypal } from "./lib/changepaypal.js"
import dotenv from 'dotenv';
import { sendEmail } from "./sendEmail.js"
import { applyHtmlContent } from "./lib/emailtemplates.js"
import { google } from "googleapis"
import fetch from "node-fetch"
import { encryptToken, saveTokenToDB } from "./lib/utils.js"
import fs from 'fs'
dotenv.config();

const MONGO = process.env.MONGO
const app = express()
const port = 5000


const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const oAuth2Client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    process.env.redirect_uris
);

app.get('/oauth2login', (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.client_id,
        redirect_uri: process.env.redirect_uris,
        response_type: 'code',
        scope: SCOPES.join(' '),
        access_type: 'offline',
        prompt: 'consent',
    })
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
  
    const params = new URLSearchParams({
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      code,
      redirect_uri: process.env.redirect_uris,
      grant_type: 'authorization_code',
    });
  
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });
  
        const tokens = await response.json();
    
        if (tokens.error) {
            console.error('Error exchanging code for tokens:', tokens.error);
            res.send('Error during authorization. Check the console for details.');
        } else {
            oAuth2Client.setCredentials(tokens);
            const encryptedTokens = encryptToken(JSON.stringify(tokens));
            await saveTokenToDB(encryptedTokens)
            // fs.writeFileSync('token.enc', encryptedTokens);
            console.log('Tokens encrypted and stored to db');
            res.send('Authorization successful! You can close this window.');      
        }
    }catch(error){
        console.error('Error retrieving access token:', error);
        res.send('Error during authorization. Check the console for details.');
    }
});

const findUserFromEmail = async (email) =>{
    const user = await User.findOne({email : email}) 
    const paypal = user.paypal.slice(0,3)
    return([user.username, paypal, user.websiteLink])
}



const corsOptions = {
    origin: '*', // Allow all origins
    methods: 'GET', // Allowable methods
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions))
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
});

app.post('/api/changepaypal', async (req, res) => {
    const {username, paypal} = req.body
    const validPaypal = await checkifValidPaypal(username, paypal)
    if(validPaypal){
        await changePaypal(username, paypal)
        return res.json({success: true})
    }
    res.json({success: false, paypal: paypal.slice(0,3)})
});


app.get('/api/data/payments', async (req, res) => {
    const xcust = req.query.xcust
    const responseData = await fetchPaymentsFromDB(xcust)
    res.json(responseData);
});

app.post('/api/changeemail', async (req, res) => {
    const {username, email} = req.body
    const userExists = await checkIfUserExists(username)
    if(userExists){
        const changeSuccess = changeEmail(username,email)
        return res.json({success: changeSuccess})
    }
    res.json({userExists: userExists})
});

app.post('/api/verifybankdetails', async (req, res) => {
    const {} = req.body
    const userExists = await checkIfUserExists(username)
    console.log(userExists)
    res.json({userExists: userExists})
});

app.post('/api/checkusername', async (req, res) => {
    const {username} = req.body
    const userExists = await checkIfUserExists(username)
    console.log(userExists)
    res.json({userExists: userExists})
});

app.post('/api/checkemail', async (req, res) => {
    const {email} = req.body
    const emailExists = await checkIfEmailExists(email)
    console.log(emailExists)
    res.json({emailExists: emailExists})
});

app.post('/api/apply', async (req, res) => {
    const { email, username, password, paypal, websiteLink} = req.body
    let saved = false 
    try{
        saved = await saveNewUserTODatabase(email, username, password, paypal, websiteLink)
        await sendEmail(email, 'Application', applyHtmlContent(username, 'welcome'))
        saved = true
    }catch(err){
        saved = false
        console.log(err)
    }
      
    res.send({saved: saved});
});


app.post('/api/login', async (req, res) => {
    const { email, password} = req.body
    const matchingCredentials  = await authenticateUser(email, password)
    if(matchingCredentials){
        const [username, paypal, websitelink] = await findUserFromEmail(email)
        return res.json({isValid: true, username: username, email: email, paypal : paypal, websiteLink : websitelink})
    }
    return res.json({isValid: false});
});

app.get('/api/data/merchantpagedata', async (req, res) => {
    const timeRange = req.query.timeRange
    const xcust = req.query.xcust
    const responseData = await convertToMerchantPageDataObject(timeRange, xcust)
    res.json(responseData);
});

app.get('/api/data/linkspagedata', async (req, res) => {
    const timeRange = req.query.timeRange
    const xcust = req.query.xcust
    const responseData = await convertToLinksDataObject(timeRange, xcust) 
    res.json(responseData);
});

app.get('/api/data/dashboardpagedata', async (req, res) => {
    const timeRange = req.query.timeRange
    const xcust = req.query.xcust
    const responseData = await convertToDashboardDataObject(timeRange, xcust) 
    console.log(responseData)
    res.json(responseData);
});

app.get(`/api/data/merchantofferspagedata`, async (req, res) =>{
    const searchTerm = req.query.searchterm
    const responseData = await getMerchantOffersFromDB(searchTerm)
    const formattedOffersPageData = await convertToOffersPageData(responseData)
    res.json(formattedOffersPageData);
})
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});