import React from 'react'
import styles from './listcontainerheader.module.css'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react'

export default function ListContainerHeader(props: any) {
  const isamobile = useMediaQuery({ query: `(max-width: 760px)` })
  const[isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if(isamobile){
      return setIsMobile(true)
    }
    setIsMobile(false)
}, [isMobile, isamobile]) 
  return (
    <div>
      <div className= {styles.container}>
      <a className={styles.link}>{props.title}</a>
      <div className={styles.containertop}>
        {props.values.map((header:any, index:number)=>(
          <span className={styles.smallcontainer} key = {index}>{isMobile ? '': header}</span>
        ))}
      </div>
      </div>
    </div>
  )
}
