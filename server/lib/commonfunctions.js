import { connectToDB, closeConnectionToDB } from './utils.js'
import { Commission } from './models.js';

function roundToTwoDecimals(obj) {
    const roundedObj = {};
  
    for (const [key, value] of Object.entries(obj)) {
      const numbers = value[0];
      const url = value[1];
  
      // Round each number to two decimal places
      const roundedNumbers = numbers.map((num, index) => index == 1? num = num : num.toFixed(2));
  
      // Store the rounded numbers and the original URL back into the new object
      roundedObj[key] = [roundedNumbers, url];
    }
  
    return roundedObj;
}
  
const getClickedURLWebsite = (url) =>{
    let currentIndex = 0;
    let count = 0;
    const target = '/';
    while (count < 3) { // Loop until finding the third occurrence
        let index = url.indexOf(target, currentIndex);
        if (index === -1) break; // Exit loop if the character is not found
        count++;
        currentIndex = index + 1; // Move the index forward
        if (count === 3) { 
            return url.slice(0, index)
        }
    }
}
export const getMonthShortForm = (monthNumber) => {
    // Array of month abbreviations
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Check if the month number is valid
    if (monthNumber < 0 || monthNumber > 11) {
        return "Invalid month number";
    }
    
    // Return the month abbreviation
    return months[monthNumber];
}


export const getFirstNItemsInDict = (dict, number) =>{
    // Convert object entries to an array and get the first 10 items
    const firstTenEntries = Object.entries(dict).slice(0, number);

    // Convert the entries back to an object if needed
    const firstTenItemsObject = Object.fromEntries(firstTenEntries);
    return firstTenItemsObject
}

export const convertToMerchantOrLinkFormat = (listOfCommissions, type) =>{
    let links = {}
    if(type == 'links'){
        for (const comm of listOfCommissions){
            if(!(comm.clickedurl in links)){
              links[comm.clickedurl] = [[comm.publisher_amount, 1, comm.order_amount], comm.clickedurl]
            }else{
              links[comm.clickedurl][0][0] += (comm.publisher_amount)
              links[comm.clickedurl][0][1] += 1
              links[comm.clickedurl][0][2] += (comm.order_amount)
            }
          }
    }else{
        for (const comm of listOfCommissions){
            if(!(comm.merchant_name in links)){
              links[comm.merchant_name] = [[comm.publisher_amount, 1, comm.order_amount], getClickedURLWebsite(comm.clickedurl)]
            }else{
              links[comm.merchant_name][0][0] += (comm.publisher_amount )
              links[comm.merchant_name][0][1] += 1
              links[comm.merchant_name][0][2] += (comm.order_amount)
            }
          }
    }
    // Convert object to array, sort based on the third element of the first array in the value, then convert back to an object
    let sortedArray = Object.entries(links).sort((a, b) => b[1][0][0] - a[1][0][0]);

    // Converting the sorted array back into an object
    let sortedLinks = sortedArray.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
    return roundToTwoDecimals(sortedLinks)
}

export const convertToMerchantRevenueData = (listOfCommissions, range) =>{
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
                let total = amount + comm.publisher_amount
                revenueDict.set(JSON.stringify([number,comm.merchant_name]), total)
            }
        }
    }
    let listOfMerchantData = []
    for (const number of range) {
        let merchantdata = {}
        for (const [key, value] of revenueDict){
            if(((new Date(JSON.parse(key)[0]).getDate()) === number.getDate()) && ((new Date(JSON.parse(key)[0]).getMonth()) === number.getMonth())){
                let merchant = JSON.parse(key)[1]
                let dayInEnglish = new Date(JSON.parse(key)[0]).toLocaleDateString('en-UK', { day: '2-digit'})
                let monthInEnglish = new Date(JSON.parse(key)[0]).toLocaleDateString('en-UK', {month: 'short'})
                merchantdata.name = `${dayInEnglish} ${monthInEnglish}`
                if(!value == 0){
                    merchantdata[merchant] = (value*0.8).toFixed(2)
                }
            }
        
        }
        listOfMerchantData.push(merchantdata)
    }
    return listOfMerchantData
}

export const fetchCommissionsByTimeRangeAndCustomID = async (start_date, end_date, xcust) =>{
    try{
        connectToDB()
        const comms = await Commission.find({ 
          transaction_date: {
            $gte: start_date,
            $lte: end_date
          },
          custom_id : xcust,
          status: "active"
        })
        closeConnectionToDB()
        return comms
    }catch(err){
        console.log(err)
        throw new Error('Failed to fetch users')
    }
}

export const getTotalsInTimeRange = (listOfCommissions) =>{
    let totalRevenue = 0
    let totalOrderAmount = 0
    for(const comm of listOfCommissions){
        totalRevenue += comm.publisher_amount
        totalOrderAmount += comm.order_amount
    }
    const averageCommissionRate = ((totalRevenue/totalOrderAmount)* 100)
    const returnList = [(totalRevenue*0.8), totalOrderAmount, averageCommissionRate].map(value => value.toFixed(2))
    return(returnList)
}


export const getDaysBetweenDates = (startDate, endDate) => {
    const dates = [];
    // Create a new Date instance to avoid modifying the original date
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        // Push a new date so that the original date object does not get modified
        dates.push(new Date(currentDate));
        // Increment the date by one day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

export const getStartDate = (timeRange) =>{
    let today = new Date()
    let startdate = new Date()
    const enddate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1)
    //range is an array of the days/months that are in the timeRange
    let range  = []
    switch (timeRange) {
      case '7days':
        startdate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7)
        range = getDaysBetweenDates(startdate, enddate)
        break;
      case '30days':
        startdate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-30)
        range = getDaysBetweenDates(startdate, enddate)
        break;
      case 'year':
        startdate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() + 1)
        range = getDaysBetweenDates(startdate, enddate)
        break;
      default:
        startdate = new Date(today.getFullYear(), today.getMonth(), 1);
        range = getDaysBetweenDates(startdate, enddate)
    }
    return [startdate, range]
} 