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
import jwt from 'jsonwebtoken'
dotenv.config();

const MONGO = process.env.MONGO
const app = express()
const port = 5000



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

app.post('/api/request-reset', async (req, res) => {
    const { email } = req.body;
    const user = await checkIfEmailExists(email)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' });
  
    // Send OTP email
    const sentemail =  await sendEmail(email, 'Link Loop Reset', applyHtmlContent(username, 'passwordotp', {otp: otp}))
    if(sentemail){
        res.status(400).json({ message: 'Could not send otp' })
    }
    res.json({ message: 'OTP sent to email', token })
});

app.post('/api/reset-password', async (req, res) => {
    const { token, otp, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }

        const user = await checkIfEmailExists(email)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
  
        user.password = bcrypt.hashSync(newPassword, 10)
        res.json({ message: 'Password reset successfully' })
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' })
    }
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
        saved = await sendEmail(email, 'Application', applyHtmlContent(username, 'application'))
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