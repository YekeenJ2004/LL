"use client"
import React from 'react'
import styles from  './tools.module.css'
import LinkWrapper from './linkwrapper/linkwrapper'
import DropdownMenu from '../uicomponents/dropdownmenu/dropdownmenu'
import { fetchCommissions } from '../lib/data'
import Discordbot from './discordbot/discordbot'



export default function Tools() {
  return (
    <div className = {styles.wrapper}>
      <div className = {styles.main}>
        <div className = {styles.tophalf}>
          <div className={styles.container}>
            <LinkWrapper></LinkWrapper>
          </div>
          <div className={styles.container}>
            <Discordbot></Discordbot>
          </div>
        </div>
      </div>
    </div>
  )
}
