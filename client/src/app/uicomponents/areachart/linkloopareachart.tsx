"use client"
import React,{PureComponent} from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './linkloopareachart.module.css'
import { useState, useEffect} from 'react';
import { useMediaQuery } from 'react-responsive';

export default function LinkLoopAreaChart(props : any) {

  let data = []
  for(const amt of props.data){
    const { name, ...rest } = amt //removes the key value pair with key 'name'
    const sum = Object.values(rest).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0);
    data.push({name : amt.name, amount : sum})
  }
  

  const[isMobile, setIsMobile] = useState(false)
    
  const isamobile = useMediaQuery({ query: `(max-width: 760px)` })
  useEffect(() => {
      if(isamobile){
        return setIsMobile(true)
      }
      setIsMobile(false)
  }, [isMobile, isamobile])
  if (isMobile){
    return(
     <div className= {styles.mobilecontainer}>
         <h1> To view the Chart please use a larger screen</h1>
     </div>
    ) 
  }
  return (
    <div className= {styles.container}>
      <span className={styles.title}>{props.title}</span>
      <ResponsiveContainer>
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="linear" dataKey= {props.dataKey} stroke= "#0058a0" fillOpacity = {0.2}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
