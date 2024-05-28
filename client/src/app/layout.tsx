"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./uicomponents/sidebar/sidebar";
import Navbar from "./uicomponents/navbar/navbar";
import styles from "./uicomponents/layout.module.css"
import React from "react";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { AuthProvider } from "./authcontext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(()=>{
    const passphrase = 'getThisDough';
    const encryptedloggedin = sessionStorage.getItem('loggedin');

    if (encryptedloggedin) {
      try {
        const loggedin = CryptoJS.AES.decrypt(encryptedloggedin, passphrase);
        const loggedinString = loggedin.toString(CryptoJS.enc.Utf8);
        if (loggedinString === 'true') {
          setIsLoggedIn(true);
          return;
        }
      } catch (error) {
        console.error('Failed to decrypt session storage value:', error);
      }
    }
    setIsLoggedIn(false);
  }, [])
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <div className={styles.container}>
            <div className = {styles.menu}><Sidebar/></div>
            {isLoggedIn? <div className= {styles.loggedincontent}><Navbar/>{children}</div> : <div className= {styles.content}><Navbar/>{children}</div> }
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
