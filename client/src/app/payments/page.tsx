"use client"
import React from 'react'
import styles from  '../uicomponents/layout.module.css'
import { useState, useEffect } from 'react';
import Loading from '../uicomponents/loadingspinner/loadingspinner';
import ListContainer from '../uicomponents/listcontainer/listcontainer';
import CryptoJS from 'crypto-js';
import { config } from 'dotenv';

config()

const decryptDataInSessionStorage = () =>{
    try{
        const passphrase = 'getThisDough'
        console.log(passphrase)
        const encryptedxcust = sessionStorage.getItem('xcust')
        const xcust  = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
        return xcust.toString(CryptoJS.enc.Utf8)
    }catch(error){
        console.log(error)
    }
}

const fetchData = async() =>{
    try{
        const xcust = decryptDataInSessionStorage()
        console.log(xcust)
        const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/data/payments?xcust=${xcust}`)
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

export default function Payments() {
    const [isLoading, setIsLoading] = useState(true);
    const [payments, setPayments] = useState([])

    useEffect(() =>{
        (async () =>{
          setIsLoading(true)
          const data =  await fetchData()
          const offers = JSON.stringify(data)
          setPayments(JSON.parse(offers))
        })()
        setIsLoading(false)
    },[])

    return (
        <div>
          {isLoading && <Loading></Loading>}
          <div className= {styles.wrapper}>
            <div className= {styles.main}>
              <ListContainer values = {payments} title = "Invoice" headers = {['Paypal', 'Date', 'Amount']}></ListContainer> 
            </div>
          </div>
        </div>
    )
}
