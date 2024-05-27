import bcrypt from 'bcryptjs'
import { connectToDB } from './utils.js'
import { User } from './models.js'


export const authenticateUser = async(email, password) =>{
    try { 
        connectToDB()
        const userExists = await User.findOne({email : email, active : true})
        if(!userExists || !await bcrypt.compare(password, userExists.password)) {
            return false
        }
    return true
    }catch(err){
        console.log('error trying to authneticate user', err)
    }
}