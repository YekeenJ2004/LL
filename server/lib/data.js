import { Commission } from "./models.mjs"
import { connectToDB } from "../utils.mjs"

export const fetchCommissions = async () =>{
    try{
        connectToDB()
        const comms = await Commission.find()
        return comms
    }catch(err){
        console.log(err)
        throw new Error('Failed to fetch users')
    }
}
 