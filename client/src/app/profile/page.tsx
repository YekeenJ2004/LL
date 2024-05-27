"use client"
import React, { useState } from 'react'
import styles from  './profile.module.css'
import CryptoJS from 'crypto-js'
import Modal from '../uicomponents/modal/modal'
import Bankdetails from './bankdetails/bankdetails'
import Email from './email/email'

const passphrase = 'getThisDough'
const encryptedxcust = sessionStorage.getItem('xcust')
const xcust  = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
const username = xcust.toString(CryptoJS.enc.Utf8)
const email  = sessionStorage.getItem('email')
const websitelink = 'www.ace.com' //sessionStorage.getItem('websitelink')

export default function Profile() {

  return (
    <div className={ styles.main}>
      <div  className={ styles.wrapper}>
        <div className={styles.cards}>
          <span className={styles.title}>Username</span>
          <span className={styles.value}>{username}</span>
        </div>
        <div className={styles.cards} >
          <span className={styles.title}>Website Link</span>
          <span className={styles.value}>{websitelink}</span>
        </div>
      </div>
      <div className={ styles.wrapper}>
        <Email email = {email}></Email>
        <Bankdetails></Bankdetails>
      </div>
    </div>
  )
}
