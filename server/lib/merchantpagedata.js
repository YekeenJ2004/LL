import { convertToMerchantOrLinkFormat, convertToMerchantRevenueData, fetchCommissionsByTimeRangeAndCustomID, getStartDate, } from "./commonfunctions.js"

const convertTomerchantPageOrdersDataObject = (listOfCommissions, range) =>{
    let revenueDict = new Map()
    for(const number of range){
        for(const comm of listOfCommissions){
            //i it doesnt exist, add it to the dict 
            if(!revenueDict.has(JSON.stringify([number,comm.merchant_name]))){ // use json.stringify because maps use referencing so it will not be unique otherwise 
                revenueDict.set(JSON.stringify([number,comm.merchant_name]), 0)
            }
            //if the day and month field of the commission and range match each other
            if(((comm.transaction_date).getDate() === number.getDate()) && ((comm.transaction_date).getMonth() === number.getMonth()) && ((comm.transaction_date).getYear() === number.getYear())){
                let amount = revenueDict.get(JSON.stringify([number,comm.merchant_name]))
                let total = amount + 1
                revenueDict.set(JSON.stringify([number,comm.merchant_name]), (total*0.75).toFixed(2))
            }
        }
    }
    let listOfMerchantOrders = []
    for (const number of range) {
        let merchantdata = {}
        for (const [key, value] of revenueDict){
            if(((new Date(JSON.parse(key)[0]).getDate()) === number.getDate()) && ((new Date(JSON.parse(key)[0]).getMonth()) === number.getMonth())){
                let merchant = JSON.parse(key)[1]
                let dayInEnglish = new Date(JSON.parse(key)[0]).toLocaleDateString('en-UK', { day: '2-digit'})
                let monthInEnglish = new Date(JSON.parse(key)[0]).toLocaleDateString('en-UK', {month: 'short'})
                merchantdata.name = `${dayInEnglish} ${monthInEnglish}`
                merchantdata[merchant] = (value*0.8).toFixed(2)

            }
        
        }
        listOfMerchantOrders.push(merchantdata)
    }
    return listOfMerchantOrders
}

export const convertToMerchantPageDataObject = async(timeRange, xcust) =>{
    let today = new Date()
    const end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const [start_date, range]  = getStartDate(timeRange)
    const listOfCommissions = await fetchCommissionsByTimeRangeAndCustomID(start_date, end_date, xcust)
    let merchantdataObject = {}
    merchantdataObject.links = convertToMerchantOrLinkFormat(listOfCommissions, 'merchants')
    merchantdataObject.revenue  = convertToMerchantRevenueData(listOfCommissions, range)
    merchantdataObject.orders =convertTomerchantPageOrdersDataObject(listOfCommissions, range)
    return merchantdataObject
}