"use client"
import React from 'react'
import styles from './resetpassword.module.css'
import Link from 'next/link'
import { useState } from 'react'

export default function ResetPassword() {

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setisValid] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const handleSubmit = async() =>{

    }
    if(){
        return (
            <div>
                <form className={styles.form}>
                <div className={styles.title}>
                    Login
                </div>
                <div>
                    <div className={styles.field}>
                        <input className={styles.inputbox}
                            type ='text'
                            value = {otp}
                            placeholder= 'E-mail'
                            onChange={(e) => setOtp(e.target.value)}
                        >
                        </input>
                    </div>
                    <div className={styles.field}>
                        <input className={styles.inputbox}
                            type='password'
                            value = {password}
                            placeholder= 'New password'
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </input>
                    </div>
                    <div className={styles.field}>
                        <input className={styles.inputbox}
                            type='password'
                            value = {password}
                            placeholder= 'Confirm new password'
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </input>
                        {!isValid && <span className={styles.errormessage}>incorrect OTP email combo</span>}
                    </div>
                </div>
                <div className={styles.buttombuttons}>
                    <button type = "submit" className={styles.button} onClick={handleSubmit}>Login</button>
                    <Link href='https://ll-client.vercel.app/apply'>
                    <button className={styles.button}>Apply now</button>
                    </Link>
                </div>
                <div>
                    <Link href = 'https://ll-client.vercel.app/resetpassword'>forgot password?</Link>
                </div>
                </form>
            </div>
        )
    }
}
