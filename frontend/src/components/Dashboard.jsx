import React, { useState, useEffect } from 'react';

export default function Dashboard({token,onLogout}){
  const [prompt,setPrompt]=useState('');
  const [jobs,setJobs]=useState([]);

  async function create(){
    const res = await fetch('http://localhost:4000/video/create',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({prompt,params:{}})
    });
    const j = await res.json();
    if(!res.ok){
      alert(j.error || 'İş oluşturulamadı');
      return;
    }
    alert('Job queued: '+j.jobId);
    setPrompt('');
    loadJobs();
  }

  async function loadJobs(){
    const res = await fetch('http://localhost:4000/video/list',{
      headers:{'Authorization':'Bearer '+token}
    });
    const j = await res.json();
    if(!res.ok){
      alert(j.error || 'İşler yüklenemedi');
      return;
    }
    setJobs(Array.isArray(j) ? j : []);
  }

  useEffect(()=>{loadJobs();},[]);

  return (
    <div className="wrap">
      <h2>AliveAI Dashboard</h2>
      <button onClick={onLogout}>Çıkış</button>
      <div style={{marginTop:12}}>
        <textarea placeholder="Video prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} />
        <button onClick={create}>AliveAI ile üret</button>
      </div>
      <h3>Jobs</h3>
      <ul>{jobs.map(j=>(<li key={j._id}>{j.prompt} — {j.status} {j.resultUrl? '✔':'✖'}</li>))}</ul>
    </div>
  );
}
