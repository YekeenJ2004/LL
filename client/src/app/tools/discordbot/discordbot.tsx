import React from 'react'
import styles from './discordbot.module.css'
import { FaDiscord } from 'react-icons/fa'
import { BsDiscord } from 'react-icons/bs'

export default function Discordbot() {
  return (
    <div className ={styles.content}>
      <span className={styles.title}>Discord Bot</span>
      <div className={styles.container}>
        <span className= {styles.bulletpoint}> If you run your community on a discord server you can add our custom discord bot by clicking the button below</span>
        <a className = {styles.discordbutton} href='https://discord.com/api/oauth2/authorize?client_id=1206233776041230386&permissions=2048&scope=bot' target="_blank"><FaDiscord size={40}></FaDiscord></a>
        <span> The following commands can be carried out using the discord bot:</span>
        <div className= {styles.bulletpoint}>
            <FaDiscord size={20}></FaDiscord> 
            <span className= {styles.text}>monthrevenue:  returns how much commsision earned from start of the month to current date</span>
        </div>
        <div className= {styles.bulletpoint}>
            <FaDiscord size={20}></FaDiscord> 
            <span className= {styles.text}>monthrevbylink: returns how much commission earned from each link from start of the month to current date</span>
        </div>
        <div className= {styles.bulletpoint}>
            <FaDiscord size={20}></FaDiscord> 
            <span className= {styles.text}>customrevenue: returns how much commission earned between the startdate and enddate specified</span>
        </div>
        <div className= {styles.bulletpoint}>
            <FaDiscord size={20}></FaDiscord> 
            <span className= {styles.text}>affiliate: returns an affiliated link ( your username should be entered in the custom_id field ) </span>
        </div>
      </div>
    </div>
  )
}
