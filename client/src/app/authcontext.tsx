"use client"
import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}
// Create a context for the authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

  
// Provider component that wraps your app and makes auth state available to any child component that calls useAuth().
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
            const passphrase = 'getThisDough';
            const encryptedloggedin = sessionStorage.getItem('loggedin');
            if (encryptedloggedin) {
                const loggedin = CryptoJS.AES.decrypt(encryptedloggedin, passphrase);
                const loggedinString = loggedin.toString(CryptoJS.enc.Utf8);
                if (loggedinString === 'true') {
                    login();
                    return
                }
            }
        }catch(error){
            console.error(error)
        }
        logout()
    },[login, logout])
    

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout}}>
        {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};