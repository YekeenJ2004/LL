"use client"
import React, { useState, useEffect } from 'react'
import Searchbar from '../uicomponents/searchbar/searchbar'
import styles from  '../uicomponents/layout.module.css'
import ListContainer from '../uicomponents/listcontainer/listcontainer'
import Loading from '../uicomponents/loadingspinner/loadingspinner'

const fetchData = async (searchterm: string) =>{
  try{
    const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/data/merchantofferspagedata?searchterm=${searchterm}`)
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

export default function Offers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [offers, setOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() =>{
    (async () =>{
      setIsLoading(true)
      const data =  await fetchData(searchTerm)
      const offers = JSON.stringify(data)
      setOffers(JSON.parse(offers))
    })()
    setIsLoading(false)
  },[setSearchTerm, searchTerm])

  return (
    <div>
      {isLoading && <Loading></Loading>}
      <div className= {styles.wrapper}>
        <div className= {styles.main}>
          <Searchbar setSearchTerm= {setSearchTerm} ></Searchbar>
          <ListContainer values = {offers} title = "Name" headers = {['Avg Comm %', 'Avg conversion %', 'Avg CPC']}></ListContainer> 
        </div>
      </div>
    </div>
  )
}
