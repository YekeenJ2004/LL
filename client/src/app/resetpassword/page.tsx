"use client"
import React, { useState, FormEvent } from 'react';

const ResetPassword: React.FC = () => {
  const token = sessionStorage.getItem('token');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, otp, newPassword }),
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