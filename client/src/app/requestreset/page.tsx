"use client"
import React, { useState, FormEvent, ChangeEvent } from 'react';

const RequestReset: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://ll-server-yekeen-jimohs-projects.vercel.app/api/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
      sessionStorage.setItem('token', data.token);
      window.location.href = 'https://www.linkloop.app/resetpassword';
    } catch (error) {
      setMessage('Failed to send OTP');
    }
  };

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <button type="submit">Request OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestReset;