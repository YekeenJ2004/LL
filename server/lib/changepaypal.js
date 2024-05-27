import { User } from "./models.js"
import { connectToDB } from "./utils.js"

export const checkifValidPaypal = async(username, paypal) =>{
    try{
        connectToDB()
        const user = User.find({
            username: username
        })
        if(user.paypal === paypal){
            return true
        }
        return false

    }catch(error){
        console.log("could not validate paypal", error)
    }
}

export const changePaypal = async(username, paypal) =>{
    try{
        connectToDB()
        await User.updateOne({ username: username}, {paypal:paypal})
    }catch(err){
        console.log('could not update user paypal', err)
    }
}