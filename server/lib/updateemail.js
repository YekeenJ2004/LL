import { User } from "./models.js";
import { connectToDB } from "./utils.js";

export const changeEmail = async(username, email)=>{
    connectToDB()
    try{
        const user = await User.updateOne(
            {username : username},
            {email, email}
        )
        return true 
    }catch(err){
        console.log(err)
        return false
    }
}