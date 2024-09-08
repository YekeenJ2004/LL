"use client"
import React, { useState } from 'react';
import { FormEvent } from 'react';

const ResetPassword = () => {

    const getToken = () =>{
        const temp = sessionStorage.getItem('token')
        return temp
    }
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = getToken()
            const response = await fetch('https://ll-server-yekeen-jimohs-projects.vercel.app/api/reset-password', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({token, otp, newPassword }),
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('Failed to reset password');
        }
    };

    return (
        <div>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            />
            <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;