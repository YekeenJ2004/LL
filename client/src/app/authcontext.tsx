"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

// Create a context for the authentication state
const AuthContext = createContext(null);

// Provider component that wraps your app and makes auth state available to any child component that calls useAuth().
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true);
    const logout = () => {
        setIsLoggedIn(false)
        sessionStorage.setItem('xcust', '0')
        sessionStorage.setItem('loggedin', '0')
        sessionStorage.setItem('email', '0')
        sessionStorage.setItem('paypal', '0')

    }

    useEffect(() =>{
        try{
            const passphrase = 'getThisDough'
            const encryptedloggedin = sessionStorage.getItem('loggedin')
            const loggedin  = CryptoJS.AES.decrypt(encryptedloggedin, passphrase);
            console.log(loggedin.toString(CryptoJS.enc.Utf8))
            if(loggedin.toString(CryptoJS.enc.Utf8) == 'true'){
                return login()
            }
        }catch{
            return logout()
        }
        return logout()
    },)
    

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout}}>
        {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};