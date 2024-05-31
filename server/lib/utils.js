import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectToDB = async () =>{
    const connection = {}

    try {
        if (connection.isConnected) return 
        const db =  await mongoose.connect('mongodb+srv://yekeen:dSAN1xqtOHYaQYme@cluster0.gz40hal.mongodb.net/skimlinkscommissions?retryWrites=true&w=majority&appName=Cluster0');
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

