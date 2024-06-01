import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongoUrl = `${process.env.MONGO}`
console.log(process.env.PORT)
export const connectToDB = async () =>{
    const connection = {}

    try {
        if (connection.isConnected) return 
        const db =  await mongoose.connect(`${process.env.MONGO}`);
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

