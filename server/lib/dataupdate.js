import fetch from 'node-fetch';
import {Commission, MerchantOffers} from '../lib/models.js'
import {connectToDB, closeConnectionToDB}  from '../lib/utils.js';
import { Console, error } from 'console';


async function getCommissionsFromSkimlinks(start_date, end_date, status) {
  const publisher_id = '225413';
  start_date = `${start_date}T00:00:00.000Z`;
  end_date = `${end_date}T23:59:59.999Z`;
  const limit = 600; // Min=1, Default=30, Max =600
  //const status = 'active'; // active or cancelled
  const access_token = '189513:1708279263:e13fab2bc7d84960aee4049d971422cb';

  let has_next = true;
  let offset = 0;

  while (has_next) {
    const url = `https://reporting.skimapis.com/publisher/${publisher_id}/commission-report?`
        + `start_date=${start_date}&`
        + `end_date=${end_date}&`
        + `limit=${limit}&`
        + `status=${status}&`
        + `access_token=${access_token}&`
        + `offset=${offset}&`;

    const list = []
    const response = await fetch(url);
    const responseCommissions = await response.json();
    for(const commission of responseCommissions.commissions) {
      list.push(commission)
    }
    offset += limit;
    has_next = responseCommissions.pagination.has_next;
    if(status == 'active'){
      await saveCommissionsToDB(list)
    }else if(status =='cancelled'){
      await updateCancelledCommisssions(list)
    }
    console.log(has_next)
    console.log(offset)
  }
}

const updateCancelledCommisssions =async(comms) =>{
  for (const comm of comms) {
    try{
      await connectToDB()
      await Commission.findOneAndUpdate(
        {commission_id : comm.commission_id },
        {status: 'cancelled'}
      )
      console.log(`${comm.commission_id} has been updated`)
    }catch(err){
      console.log(`could not update commission ${comm.commission_id}`)
    }
  
  }
}


const saveCommissionsToDB = async(comms) =>{
  //const comms  =  await getCommissionsFromSkimlinks('2024-01-01', '2024-04-15')
  await connectToDB()
  for (const comm of comms) {
    try{
      const newCommisison = new Commission(
        {commission_id : comm.commission_id, 
          merchant_id : comm.merchant_details.merchant_id,
          status: comm.transaction_details.status,
          payment_status :comm.transaction_details.payment_status,
          transaction_date : comm.transaction_details.transaction_date,
          last_updated: comm.transaction_details.last_updated,
          invoice_id : comm.transaction_details.invoice_id,
          merchant_name: comm.merchant_details.merchant_name,
          order_amount: comm.transaction_details.basket.order_amount,
          publisher_amount: comm.transaction_details.basket.publisher_amount,
          currency : comm.transaction_details.basket.currency,
          custom_id : comm.click_details.custom_id,
          date_clciked: comm.click_details.date,
          clickedurl : comm.click_details.clicked_url
        })
      const savedCommission = await newCommisison.save()
    }catch{
      console.log(`${comm.commission_id} already exists`)
    }
  }
  await closeConnectionToDB()
}

async function getMerchantOffers() {
  const publisher_id = '225413'
  const limit = 200 // Min=1, Default=30, Max =600
  const access_token = '189513:1708279263:e13fab2bc7d84960aee4049d971422cb'
  let has_next = true
  let offset = 0
  while(has_next){
    const url = `https://merchants.skimapis.com/v4/publisher/${publisher_id}/merchants?`
      + `access_token=${access_token}&`
      + `offset=${offset}&`;

    const list = []
    const response = await fetch(url);
    const responseMerchantOffers= await response.json();
    for(const commission of responseMerchantOffers.merchants) {
      list.push(commission)
    }
    await saveMerchantOffersToDB(list)
    offset += limit;
    has_next = responseMerchantOffers.has_more
    console.log(has_next)
    console.log(offset)
  }
}

const saveMerchantOffersToDB  = async(offers) =>{
  await connectToDB()
  for (const offer of offers) {
    try{
      const newMerchantOffer = new MerchantOffers(
        {merchant_id: offer.id,
          merchant_name: offer.name,
          domains : offer.domains,
          average_commission_rate : offer.calculated_commission_rate,
          average_conversion_rate : offer.calculated_conversion_rate,
          average_cpc : offer.calculated_ecpc
        }
      )
      const savedMerchantOffers = await newMerchantOffer.save()
    }catch(err){
      console.log(`${offer_id} already exists`, err)
    }
  }
}

//getMerchantOffers()
await getCommissionsFromSkimlinks('2024-01-01', '2024-05-28', 'cancelled')
await getCommissionsFromSkimlinks('2024-05-27', '2024-05-30', 'active')

console.log('go')