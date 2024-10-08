"use client"
import React, { useEffect, useState } from 'react';
import styles from './login.module.css'
import Link from 'next/link';
import CryptoJS from 'crypto-js'
import Loading from '../uicomponents/loadingspinner/loadingspinner';
import { useAuth } from '../contexts/authcontext';

const setSessionStorageValues  = (username: string, email: string, paypal: string, websitelink: string) =>{
  const passphrase = 'getThisDough'
  const encryptedisLoggedIn = CryptoJS.AES.encrypt('true', passphrase).toString()
  sessionStorage.setItem('loggedin', encryptedisLoggedIn)
  const encryptedxcust  = CryptoJS.AES.encrypt(username, passphrase).toString()
  sessionStorage.setItem('xcust', encryptedxcust)
  sessionStorage.setItem('email', email)
  sessionStorage.setItem('paypal', paypal)
  sessionStorage.setItem('websitelink', websitelink)
}
export default function Login() {
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setisValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Assuming 'onLogin' is a function passed via props that handles the actual authentication logic
    setIsLoading(true)
    onLogin(email, password);
    setIsLoading(false)
  }
  const valuesDontMatch = (state: boolean) =>{
    if(state){
      setEmail('')
      setPassword('')
      setisValid(false)
      return 
    }
    window.location.replace('https://ll-client.vercel.app/dashboard')
    login()
  }
  const onLogin = async (email : string , password : string) =>{
    
    try{
      const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/login`,{
        method : 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email: email.toLowerCase(), password})
      })
      const data = await response.json()
      if(data.isValid){
        console.log(data)
        setSessionStorageValues(data.username, data.email, data.paypal, data.websiteLink)
        return valuesDontMatch(false)
      }
      valuesDontMatch(true)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    setIsLoading(false)
  },[])
  return (
    <div className= {styles.main}>
      {isLoading && <Loading></Loading>}
      {!isLoading &&
        <form className={styles.form}>
          <div className={styles.title}>
            Login
          </div>
          <div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type ='E-mail'
                value = {email}
                placeholder= 'E-mail'
                onChange={(e) => setEmail(e.target.value)}
              >
              </input>
            </div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type='password'
                value = {password}
                placeholder= 'Password'
                onChange={(e) => setPassword(e.target.value)}
              >
              </input>
              {!isValid && <span className={styles.errormessage}>Credentials do not match</span>}
            </div>
          </div>
          <div className={styles.buttombuttons}>
            <button type = "submit" className={styles.button} onClick={handleSubmit}>Login</button>
            <Link href='https://linkloop.app/apply'>
              <button className={styles.button}>Apply now</button>
            </Link>
          </div>
          {/* <div>
            <Link href = 'https://linkloop.app/resetpassword'>forgot password?</Link>
          </div> */}
        </form>
      }
    </div>

  )
}
