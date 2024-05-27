import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
    commission_id: {type: Number, unique: true, required : true},
    status: { type: String},
    payment_status : {type: String},
    transaction_date : {type: Date},
    last_updated: {type: Date},
    invoice_id : {type: String},
    merchant_name: {type: String},
    merchant_id: {type: Number},
    order_amount:{type: Number},
    publisher_amount: {type: Number},
    currency : {type: String},
    custom_id : {type: String,},
    date: {type: Date},
    clickedurl : {type:String}
})

const merchantOffersSchema = new mongoose.Schema({
    merchant_id: {type: Number, unique: true, required : true},
    merchant_name: { type: String},
    domains : [{type: String }],
    average_commission_rate : {type: Number},
    average_conversion_rate : {type: Number},
    average_cpc : {type: Number}

})

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required : true},
    username: {type: String, unique: true, required : true},
    paypal: {type: String, required : true},
    password: {type: String, unique: true, required : true},
    active : {type: Boolean, required:true},
    websiteLink :{type: String, required : true}
})

const paymentSchema = new mongoose.Schema({
    invoice :{type: String, unique: true, required : true},
    date: {type: Date, unique: false, required : true},
    amount: {type: Number, unique: false, required : true},
    paypal: {type: String, required : true}, 
    username: {type: String, required: true}
})

//if commission exists, use the commission table, else create a new one named commision
export const Commission  = mongoose.models.Commission || mongoose.model("Commission", commissionSchema)
export const MerchantOffers =  mongoose.models.MerchantOffers || mongoose.model("MerchantOffers", merchantOffersSchema)
export const User  = mongoose.models.User || mongoose.model("User", userSchema)
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema)