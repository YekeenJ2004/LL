import React from 'react'
import styles from './card.module.css'

export default function Card(props: any) {
  return (
    <div className= {styles.container}>
    <span className = {styles.containertop}>
      <span className={styles.title}>{props.title}</span>
    </span>
    <span className={styles.number}>{props.value}</span>
    </div>
  )
}

