import dotenv from 'dotenv';
dotenv.config();

export const log  = () =>{
    console.log(process.env.CONSOLE)
}
