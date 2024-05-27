import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './linkloopbarchart.module.css'
import { useMediaQuery } from 'react-responsive';
export default function LinkLoopBarChart(props : any) {
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
    return(
        <div className= {styles.container}>
            <span className={styles.title}>{props.title}</span>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                <Bar dataKey= {props.dataKey} fill="#8884d8"  activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}