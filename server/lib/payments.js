import { connectToDB } from "./utils.js"
import { Payment } from "./models.js"

export const fetchPaymentsFromDB = async(xcust) =>{
    console.log(xcust)
    try{
        connectToDB()
        const payments = await Payment.find({ 
            username: xcust
        })
        console.log(payments)
        return convertToPaymentsPageData(payments)
    }catch(err){
        console.log(err)
    }
}

const convertToPaymentsPageData = (payments) =>{
    let dict = {}
    for(const payment of payments){
        dict[payment.invoice] = [[(`${(payment.paypal).slice(0,3)}***`), (payment.date).toLocaleDateString(), (payment.amount).toFixed(2)], 'google']
    }
    return dict
}
