import React from 'react'
import styles from './listitemcontainer.module.css'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

export default function ListItemContainer(props: any) {
  const isamobile = useMediaQuery({ query: `(max-width: 760px)` })
  const[isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if(isamobile){
      setIsMobile(true)
    }else{
      setIsMobile(false)
    }
}, [isMobile, isamobile]) 
  return (
    <div>
      <div className= {styles.container}>
        <a  color = '#0058a0' className={styles.link} href={props.values[1]}>{isMobile ? props.title.slice(0,20) : props.title}</a>
        <div className={styles.containertop}>
          {props.values[0].map((number:any, index: number)=>(
            <span className={styles.smallcontainer} key = {index}>
              {isMobile ? '': number}
            </span>
          ))}
        </div>
      </div>
    </div> 
  )
}
