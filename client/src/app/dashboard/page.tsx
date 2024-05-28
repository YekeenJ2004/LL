"use client"
import React, {useState, useEffect} from 'react'
import Card from '../uicomponents/card/card'
import styles from  '../uicomponents/layout.module.css'
import LinkLoopAreaChart from '../uicomponents/areachart/linkloopareachart'
import ListContainer from '../uicomponents/listcontainer/listcontainer'
import LinkLoopBarChart from '../uicomponents/barchart/linkloopbarchart'
import DropdownMenu from '../uicomponents/dropdownmenu/dropdownmenu'
import CryptoJS from 'crypto-js'
import Loading from '../uicomponents/loadingspinner/loadingspinner'
import { useAuth } from '../authcontext'


const fetchData = async (xcust: string,timeRange: string) =>{
  try{
    const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/data/dashboardpagedata?xcust=${xcust}&timeRange=${timeRange}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
  }catch(err){
    console.log(err)
  }
}

const decryptDataInSessionStorage = () =>{
  try{
    const passphrase = 'getThisDough'
    const encryptedxcust = sessionStorage.getItem('xcust')
    const xcust  = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
    return xcust.toString(CryptoJS.enc.Utf8)
  }catch(error){
    console.log(error)
  }
}

export default function Dashboard() {
  const { isLoggedIn, logout} = useAuth()
  const [timeRange, setTimeRange] = useState<DropdownOptionType>('month');
  const [averageCommissionRate, setAverageCommissionRate] = useState(0)
  const [totalRevenue, setTotalRevenue] =useState(0)
  const [revenueInTimeRange, setRevenueInTimeRange] = useState([])
  const [topLinksInTimeRange, setTopLinksInTimeRange] = useState({})
  const [totalOrderAmount, setTotalOrderAmount] = useState(0)
  const [ordersInTimeRange, setOrdersInTimeRange] = useState([])
  const [totalNumberOfOrders, setTotalNumberOfOrders] = useState(0)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    (async () =>{
      setIsLoading(true)
      const xcust = decryptDataInSessionStorage()
      const data =  await fetchData(xcust, timeRange)
      const rev = JSON.stringify(data.revenue)
      setRevenueInTimeRange(JSON.parse(rev))
      setOrdersInTimeRange(data.orders)
      setTopLinksInTimeRange(data.links)
      setTotalRevenue(data.totalRevenue)
      setTotalOrderAmount(data.totalOrderAmount)
      setAverageCommissionRate(data.averageCommissionRate)
      setTotalNumberOfOrders(data.totalNumberOfOrders)
      setIsLoading(false);
    })()
  },[timeRange, setTimeRange])

  const recieveTimeRange = (data: DropdownOptionType) =>{
    setTimeRange(data)
  }
  if(isLoggedIn){
    return (
      <div>
        <div className = {styles.wrapper}>
          <div className = {styles.main}>
            <DropdownMenu sendTimeRange={recieveTimeRange}></DropdownMenu>
            {isLoading && <Loading></Loading>}
            {!isLoading && <div className = {styles.main}>
                <div className={styles.tophalf}>
                  <Card title = "Revenue" value = {totalRevenue}></Card>
                  <Card title = "Total Order Amount" value = {totalOrderAmount} ></Card>
                  <Card title = "Orders" value = {totalNumberOfOrders} ></Card>
                  <Card title = "Avg Commission rate" value = {averageCommissionRate}></Card>
                </div>
                <div className = {styles.tophalf}>
                  <LinkLoopAreaChart data = {revenueInTimeRange} dataKey ="amount" title = "Revenue"></LinkLoopAreaChart>
                  <LinkLoopBarChart data = {ordersInTimeRange} title= "Orders" dataKey ="amount"></LinkLoopBarChart>
                </div>
                <ListContainer values = {topLinksInTimeRange} title = "Top Links" headers = {[ "Commission", "Orders", "Order Amount"]} ></ListContainer>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
