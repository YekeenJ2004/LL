import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './linkloopstackedbarchart.module.css'
import { useMediaQuery } from 'react-responsive';
export default function LinkLoopStackedBarChart(props : any) {

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
    const barcolour =[  "#FF6666", "#FF9966", "#FFFF66", "#66FF66", "#6699FF", "#FF667A", "#FF8040",
    "#FF8099", "#66CDAA", "#A4D279", "#6666FF", "#5A7D9A", "#808080", "#FF6680",
    "#FF6E6E", "#FF9933", "#FF3366", "#FF8C66", "#FF3333", "#FF4C4C", "#FFAA00",
    "#7A7A9E", "#6D7B8D", "#9933CC", "#FF559A", "#59C2C2", "#66C7CE", "#42B766",
    "#FF9933", "#FF9955", "#FF8C55", "#FFB31A", "#FFD700", "#FF9933", "#FF7A33",
    "#FF7E55", "#FF9955", "#FFCC66", "#FF9966", "#FF8C66", "#FF6666", "#FF6666",
    "#FF9955", "#FF9966", "#FF661A", "#FF9933", "#FF8C66", "#FF6673", "#FFB0C4",
    "#FF6666", "#FF2D52", "#FF6666", "#FF3300", "#FF1100", "#FF661A", "#FF3333",
    "#FF4C4C", "#FFAA00", "#FF9977", "#FF8C66", "#FF661A", "#FF3366", "#FF8C66",
    "#FF661A", "#FF661A", "#FF9955", "#FF9966", "#FF661A", "#FF6666", "#FF661A",
    "#FF9977", "#FF6666", "#FF6666", "#FF661A", "#FF8C66", "#FF3300", "#FF1100",
    "#FF661A", "#FF4C4C", "#FF661A", "#FF661A", "#FF3366", "#FF6666", "#FF3300",
    "#FF1100", "#FF661A", "#FF4C4C", "#FF661A", "#FF8C66", "#FF661A", "#FF661A",
    "#FF6666", "#FF661A", "#FF3366", "#FF661A", "#FF6666", "#FF661A"]
    return(
        <div className= {styles.container}>
            <span className={styles.title}>{props.title}</span>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {[...merchantnames].map((datakey : any, index)=>(
                        <Bar key = {datakey} dataKey = {datakey} stackId="a" fill= {barcolour[index]} label = {false}/>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}