import React, { PureComponent, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './linechart.module.css'
import { useMediaQuery } from 'react-responsive';

export default function LinkLoopLineChart(props: any) {

    let merchantnames = new Set<String>()
    props.data.map((obj: Object)=>{
        for (const objects in obj){
          merchantnames.add(objects)
        }
      }
    )
    merchantnames.delete('name')


    const[isMobile, setIsMobile] = useState(false)
    
    const isamobile = useMediaQuery({ query: `(max-width: 760px)` })
    useEffect(() => {
        if(isamobile){
            return setIsMobile(true)
        }
        setIsMobile(false)
    }, [isMobile, isamobile])
    const data = props.data
    if (isMobile){
       return(
        <div className= {styles.mobilecontainer}>
            <h1> To view the Chart please use a larger screen</h1>
        </div>
       ) 
    }
    const barcolour =['#FFD1DC', '#FFA07A','#FFD700', '#87CEEB', '#89CFF0']

    return(
        <div className= {styles.container}>
            <span className={styles.title}>{props.title}</span>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {[...merchantnames].map((datakey: any, index)=>(
                            <Line dot = {false} type = "monotone" key = {datakey} dataKey = {datakey} stroke= {barcolour[index]}/>
                        ))} 
                </LineChart>
            </ResponsiveContainer>  
        </div>
    )
}
