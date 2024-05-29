import { connectToDB, closeConnectionToDB } from "./utils.js"
import { MerchantOffers } from "./models.js"

export const getMerchantOffersFromDB = async(searchTerm) =>{
    let safeSearchTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    if(!searchTerm){
        safeSearchTerm = 'nike'
    }
    try{
        await connectToDB()
        const offers = await MerchantOffers.find({ 
          merchant_name: {$regex : safeSearchTerm, $options: 'i'},
          average_commission_rate : {$ne : null}
        })
        closeConnectionToDB()
        return offers
    }catch(err){
        console.log(err)
        throw new Error('Failed to fetch users')
    }
}

export const convertToOffersPageData = async(listOfMerchantOffers)=>{
    const returnObject = {}
    for(const offer of listOfMerchantOffers){
        returnObject[offer.merchant_name] = [[((offer.average_commission_rate*75).toFixed(2)), ((offer.average_conversion_rate*8).toFixed(2)), (offer.average_cpc)],`https://www.${offer.domains[0]}` ]
    }

    return returnObject
}
