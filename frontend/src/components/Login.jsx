import React, { useState } from 'react';

export default function Login({onLogin}){
  const [email,setEmail]=useState('demo@example.com');
  const [pwd,setPwd]=useState('demo123');

  async function submit(){
    const r = await fetch('http://localhost:4000/auth/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password:pwd})
    });
    const j = await r.json();
    if(j.token) onLogin(j.token);
    else alert('Login failed');
  }

  return (
    <div className="wrap">
      <h2>AliveAI - Giriş (demo)</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/>
      <input value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="password"/>
      <button onClick={submit}>Giriş</button>
    </div>
  );
}
