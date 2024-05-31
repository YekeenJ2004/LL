"use client"
import React from 'react'
import styles from './navbar.module.css'
import { usePathname } from 'next/navigation'
import { MdLogin, MdLogout} from 'react-icons/md'
import { useAuth } from '@/app/contexts/authcontext'
import Link from 'next/link'
import ThemeToggle from '../themebutton/themebutton'

export default function Navbar() {
    const pathname  = usePathname()
    const {logout, isLoggedIn} = useAuth()
    const onLogout = () =>{
        logout()
        window.location.replace('https://ll-client.vercel.app/login')
    }
    return(
        <div className={styles.container}>
            <div className={styles.title}>{pathname.split("/").pop()}</div>
            <button className= {styles.button}>
            </button>
            <div className={styles.menu}>
                <ThemeToggle></ThemeToggle>
                <div className = {styles.icons}>
                    {isLoggedIn ? <button onClick={onLogout}><MdLogout/></button> : <Link href={'https://ll-client.vercel.app/login'}><button><MdLogin></MdLogin></button></Link>}
                </div> 
            </div>
        </div>
    )
}
