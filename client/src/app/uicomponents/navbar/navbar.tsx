"use client"
import React from 'react'
import styles from './navbar.module.css'
import { usePathname } from 'next/navigation'
import { MdLogin, MdLogout} from 'react-icons/md'
import { useAuth } from '@/app/authcontext'
import Link from 'next/link'

export default function Navbar() {
    const pathname  = usePathname()
    const {logout, isLoggedIn} = useAuth()
    const onLogout = () =>{
        logout()
        window.location.replace('http://192.168.1.184:3000/login')
    }
    return(
        <div className={styles.container}>
            <div className={styles.title}>{pathname.split("/").pop()}</div>
            <button className= {styles.button}>
            </button>
            <div className={styles.menu}>
                <div className = {styles.icons}>
                    {isLoggedIn ? <button onClick={onLogout}><MdLogout/></button> : <Link href={'http://192.168.1.184:3000/login'}><button><MdLogin></MdLogin></button></Link>}
                </div> 
            </div>
        </div>
    )
}
