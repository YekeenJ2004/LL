"use client"
import React, { useContext, useEffect, useState} from 'react'
import styles from  '../uicomponents/layout.module.css'
import ListContainer from '../uicomponents/listcontainer/listcontainer'
import LinkLoopStackedBarChart from '../uicomponents/stackedbarchart/stackedbar'
import DropdownMenu from '../uicomponents/dropdownmenu/dropdownmenu'
import LinkLoopStackedAreaChart from '../uicomponents/stackedareachart/stackedareachart'
import CryptoJS from 'crypto-js'
import Loading from '../uicomponents/loadingspinner/loadingspinner'


const fetchData = async (xcust: string,timeRange: string) =>{
  try{
    const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/data/merchantpagedata?xcust=${xcust}&timeRange=${timeRange}`)
    if (!response.ok) {
      console.log('failed')
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
  }catch(err){
    console.log(err)
  }
}

const decryptDataInSessionStorage = () =>{
  const passphrase = 'getThisDough'
  const encryptedxcust = sessionStorage.getItem('xcust')
  const xcust  = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
  return xcust.toString(CryptoJS.enc.Utf8)
}

export default function Merchant() {

  const [timeRange, setTimeRange] = useState<DropdownOptionType>('month');
  const [merchantRevenue, setMerchantRevenue] = useState([])
  const [merchantOrders, setMerchantOrders] = useState([])
  const [merchantLinks, setMerchantLinks] = useState({})
  const [isLoading, setIsLoading] = useState(true);

  const recieveTimeRange = (data: DropdownOptionType) =>{
    setTimeRange(data)
  }
  
  useEffect(() =>{
    (async () =>{
      setIsLoading(true)
      const xcust = decryptDataInSessionStorage()
      const data =  await fetchData(xcust, timeRange)
      const rev = JSON.stringify(data.revenue)
      const orders = JSON.stringify(data.orders)
      setMerchantOrders(JSON.parse(orders))
      setMerchantRevenue(JSON.parse(rev))
      setMerchantLinks(data.links)
      setIsLoading(false)
    })()
  },[timeRange, setTimeRange])

  return (
    <div>
      <div className= {styles.wrapper}>
        <div className= {styles.main}>
        <DropdownMenu sendTimeRange={recieveTimeRange}></DropdownMenu>
        {isLoading && <Loading></Loading>}
        {!isLoading &&
          <div className= {styles.main}>
            <div className = {styles.tophalf}>
              <LinkLoopStackedBarChart data = {merchantRevenue} title= "Revenue">
              </LinkLoopStackedBarChart>
              <LinkLoopStackedAreaChart data = {merchantOrders} title = "Orders"></LinkLoopStackedAreaChart>
            </div>
            <ListContainer values = {merchantLinks} title = "Top Merchants" headers = {["Commission", "Orders"," Order Total"]}></ListContainer> 
          </div>
        }
        </div>
      </div>
    </div>
  )
}
