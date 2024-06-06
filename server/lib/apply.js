import { User } from "./models.js";
import bcrypt from 'bcryptjs'
import { connectToDB } from "./utils.js";

export async function saveNewUserTODatabase( email, username, password, paypal, websiteLink){
    for (let i = 0; i < arguments.length; i++) {
        if(!arguments[i]){
            return false
        }
    }
    try{
        await connectToDB()
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User(
            {
                email: email.toLowerCase(),
                username: username, 
                password: hashedPassword,
                paypal : paypal,
                websiteLink: websiteLink,
                active : false
            }
        )
        const saveduser = await user.save()
    }catch(err){
        console.log('could not add user to database', err)
        return false
    }
}

export const checkIfUserExists = async (username) =>{
    try{
        await connectToDB()
        const userExists = await User.findOne({username : username})
        console.log(userExists)
        if(userExists) {
            return true
        }
    return false
    }catch(err){
        console.log('error trying to find user', err)
    }
}

export const checkIfEmailExists = async (email) =>{
    try{
        await connectToDB()
        const emailExists = await User.findOne({email : email})
        if(emailExists) {
            return true
        }
    return false
    }catch(err){
        console.log('error trying to check if email exist', err)
    }
}