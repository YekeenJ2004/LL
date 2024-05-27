import {fetchCommissionsByTimeRangeAndCustomID, getTotalsInTimeRange, convertToMerchantRevenueData, convertToMerchantOrLinkFormat, getFirstNItemsInDict, getStartDate, getMonthShortForm} from './commonfunctions.js'

const convertToDashboardPageOrdersDataObject =(listOfCommissions, range) =>{
    let listOfOrders =[]
    let orderDict= {}
    let totalNumberOfOrders = 0
    for(const date of range){
        const monthInEnglish = getMonthShortForm(date.getMonth())
        orderDict[`${date.getDate()} ${monthInEnglish}${(date).getYear()}`] = 0 //initialises key with a combo of day month and year to 0
    }
    for(const comm of listOfCommissions){
        const monthInEnglish = getMonthShortForm((comm.transaction_date).getMonth())
        orderDict[`${(comm.transaction_date).getDate()} ${monthInEnglish}${(comm.transaction_date).getYear()}`] += 1
        totalNumberOfOrders += 1
    }
    for(const order in orderDict){
        listOfOrders.push(
            {
                name: order.slice(0,-3), //ignores the year part of the key
                amount: orderDict[order]
            }
        )
    }

    return [listOfOrders, totalNumberOfOrders]
}


export const convertToDashboardDataObject = async(timeRange, xcust) =>{
    let today = new Date()
    const end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const [start_date, range]  = getStartDate(timeRange)
    const listOfCommissions = await fetchCommissionsByTimeRangeAndCustomID(start_date, end_date, xcust)
    const [totalRevenue, totalOrderAmount, averageCommissionRate] = getTotalsInTimeRange(listOfCommissions)
    let dashboarddataObject = {}
    let links = convertToMerchantOrLinkFormat(listOfCommissions, 'links')
    const toptenlinks = getFirstNItemsInDict(links, 10)
    dashboarddataObject.links = toptenlinks
    const [listOfOrders, totalNumberOfOrders] = convertToDashboardPageOrdersDataObject(listOfCommissions, range)
    dashboarddataObject.orders = listOfOrders
    dashboarddataObject.revenue  = convertToMerchantRevenueData(listOfCommissions, range)
    dashboarddataObject.totalNumberOfOrders  = totalNumberOfOrders
    dashboarddataObject.totalRevenue = totalRevenue
    dashboarddataObject.totalOrderAmount = totalOrderAmount
    dashboarddataObject.averageCommissionRate = averageCommissionRate
    return dashboarddataObject
}