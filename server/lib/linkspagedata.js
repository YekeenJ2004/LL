import { fetchCommissionsByTimeRangeAndCustomID, convertToMerchantOrLinkFormat, getStartDate } from "./commonfunctions.js"

export const convertToLinksDataObject = async(timeRange, xcust) =>{
    let linkspagedataObject = {}
    let today = new Date()
    const [start_date, range]  = getStartDate(timeRange)
    const end_date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const listOfCommissions = await fetchCommissionsByTimeRangeAndCustomID(start_date, end_date, xcust)
    let links = convertToMerchantOrLinkFormat(listOfCommissions, 'links')
    linkspagedataObject.links = links
    return linkspagedataObject
}