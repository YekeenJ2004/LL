"use client"
import React, { createContext, useState } from 'react'
import Link from 'next/link'
import styles from "./sidebar.module.css"
import { MdDashboard, MdOutlineLink, MdOutlineContentPaste, MdOutlineLocalOffer, MdAttachMoney   } from 'react-icons/md'
import { RiSettings4Fill, RiUser6Fill } from 'react-icons/ri'
import { VscTools } from "react-icons/vsc";
import { useAuth } from '@/app/authcontext'

const topsidebarMenuItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard></MdDashboard>,
    },
    {
        title: "Merchants",
        path: "/merchants",
        icon: <MdOutlineContentPaste></MdOutlineContentPaste>
    },
    {
        title: "Links",
        path: "/links",
        icon: <MdOutlineLink ></MdOutlineLink>
    },
    {
        title: "Tools",
        path: "/tools",
        icon: <VscTools></VscTools>
    },
    {
        title: "Offers",
        path: "/offers",
        icon: <MdOutlineLocalOffer></MdOutlineLocalOffer>
    },
    {
        title: "Payments",
        path: "/payments",
        icon: <MdAttachMoney ></MdAttachMoney >
    }
]
const bottomsidebarMenuItems = [
    {
        title: "Profile",
        path: "/profile",
        icon: <RiUser6Fill></RiUser6Fill>
    },
]


export default function Sidebar() {
    const {isLoggedIn} = useAuth()
    if(isLoggedIn){
        return (
            <div className= {styles.container}>
                <ul>
                    {topsidebarMenuItems.map(item =>(
                        <li key = {item.title}>
                            <Link href={item.path} className={styles.menulink}>
                                {item.icon}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul>
                    {bottomsidebarMenuItems.map(item =>(
                        <li key = {item.title}>
                            <Link href={item.path} className={styles.menulink}>
                                {item.icon}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
