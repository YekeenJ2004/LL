"use client"
import React, { useEffect, useState } from 'react';
import styles from './apply.module.css'
import Link from 'next/link';
import {isStrongPassword}from '../utils'
import { convertToBool } from '../utils';
import Loading from '../uicomponents/loadingspinner/loadingspinner';


const  checkIfValidEmail  = (email: string)  =>{
  const regexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexPattern.test(email);
}


export default function Apply() {
  const [email, setEmail] = useState('');
  const [paypal, setPaypal] = useState('');
  const [emailExists, setEmailExists] = useState(false)
  const [isValidemail, setisValidEmail] = useState(true);
  const [isValidPassword, setisValidPassword] = useState(true);
  const [isValidPaypal, setisValidPaypal] = useState(true);
  const [username, setUsername] =  useState('')
  const [response, setResponse] = useState('');
  const [password, setPassword] = useState('');
  const [websiteLink, setWebsiteLink] = useState('')
  const [applied, setApplied] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [savedUser, setSavedUser] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    setIsLoading(false)
  },[])

  let validForm = isValidPassword && isValidemail && convertToBool(websiteLink) && convertToBool(username) && isValidPaypal && convertToBool(response)
  const handleSubmit = (event : React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Assuming 'onLogin' is a function passed via props that handles the actual authentication logic
    onApply(email, password);
  }

  const onApply = async (email : String , password : String) =>{
    
    try{
      const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/apply`,{
        method : 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email,username,password, paypal, websiteLink})
      })
      const data = await response.json()
      setSavedUser(data.saved)
    }catch(err){
      console.log(err)
      setSavedUser(false)
    }
    setApplied(true)
  }
  useEffect(()=>{
    (async (username : String) =>{
      try{
        const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/checkusername`,{
          method : 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({username : username})
        })
        const data = await response.json()
        console.log(data.userExists)
        setUserExists(JSON.parse(data.userExists))
      }catch(err){
        console.log(err)
      }
    })(username)
  },[setUsername, username])

  useEffect(()=>{
    (async (email : String) =>{
      try{
        const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/checkemail`,{
          method : 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({email : email.toLowerCase()})
        })
        const data = await response.json()
        console.log(data.emailExists)
        setEmailExists(JSON.parse(data.emailExists))
      }catch(err){
        console.log(err)
      }
    })(email)
  },[setEmail, email])

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const pass = e.target.value
    setPassword(pass)
    setisValidPassword(isStrongPassword(pass))
  }

  const onChangePaypal = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const pay =e.target.value
    setPaypal(pay)
    setisValidPaypal(checkIfValidEmail(pay))
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const mail = e.target.value
    setEmail(mail)
    setisValidEmail(checkIfValidEmail(mail))
  }
   
  const onChangeUsername = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    setUsername(e.target.value)
  }

  if(applied && !savedUser){
    return(
      <div className= {styles.main}>
        Could not apply
      </div>
    )
  }
  if(applied && savedUser){
    return(
      <div className= {styles.main}>
        Thank you for applying 
      </div>
    )
  }

  return (
    <div className= {styles.main}>
      {isLoading && <Loading></Loading>}
      {!isLoading&&
        <form className={styles.form}>
          <div className={styles.title}>
            Application Form
          </div>
          <div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type ='text'
                value = {email}
                placeholder= 'E-mail'
                onChange={onChangeEmail}
              >
              </input>
              {emailExists && <span className={styles.errormessage}> E-mail already exists</span>}
              {!isValidemail && <span className={styles.errormessage}> E-mail is not valid </span>}
            </div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type ='text'
                value = {username}
                placeholder= 'Username'
                onChange={onChangeUsername}
              >
              </input>
              {userExists && <span className={styles.errormessage}> username already exists</span>}
            </div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type ='text'
                value = {password}
                placeholder = 'Password'
                onChange={onChangePassword}
              >
              </input>
              {!isValidPassword && <span className={styles.errormessage}> Password not strong enough</span>}
            </div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type ='text'
                value = {paypal}
                placeholder= 'Paypal email'
                onChange={onChangePaypal}
              >
              </input>
              {!isValidPaypal && <span className={styles.errormessage}> enter a valid email please</span>}
            </div>
            <div className={styles.field}>
              <input className={styles.inputbox}
                type ='text'
                value = {websiteLink}
                placeholder= 'Website link'
                onChange={(e) => setWebsiteLink(e.target.value)}
              >
              </input>
            </div>
            <div className={styles.field}>
            <textarea className = {styles.textarea} value={response} placeholder= "Why would you be a good fit for us?" onChange={(e) => setResponse(e.target.value)}></textarea>
            </div>
          </div>
          <div className={styles.buttombuttons}>
            <button type = "submit" className={styles.button} onClick={handleSubmit} disabled = {!validForm}>Apply now</button>
            <Link href='https://linkloop.app/login' >
              <button className={styles.button}>Login</button>
            </Link>
          </div>
        </form>
      }
    </div>

  )
}
