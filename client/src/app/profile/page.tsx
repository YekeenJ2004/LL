"use client"
import React, { useState, useEffect } from 'react'
import styles from  './profile.module.css'
import CryptoJS from 'crypto-js'
import Modal from '../uicomponents/modal/modal'
import Bankdetails from './bankdetails/bankdetails'
import Email from './email/email'



export default function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [websitelink, setWebsitelink] = useState('');

  useEffect(() => {
    const decryptDataInSessionStorage = () => {
      try {
        const passphrase = 'getThisDough';
        const encryptedxcust = sessionStorage.getItem('xcust');
        if (!encryptedxcust) {
          throw new Error('xcust is not available in sessionStorage');
        }
        const xcust = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
        return xcust.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.log(error);
        return '';
      }
    };
    
    if (typeof window !== 'undefined') {
      const decryptedUsername = decryptDataInSessionStorage();
      setUsername(decryptedUsername);
      const storedEmail = sessionStorage.getItem('email') || '';
      setEmail(storedEmail);
      const storedWebsiteLink = sessionStorage.getItem('websitelink') || ''
      setWebsitelink(storedWebsiteLink)
    }
  }, []);
  


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
