import React, { useState, useEffect } from 'react';
import QuantumPyramid from './QuantumPyramid';

export default function Dashboard({token,onLogout}){
  const [videoPrompt,setVideoPrompt]=useState('');
  const [aiPrompt,setAiPrompt]=useState('5 ajanlı quantum collective için sprint planı çıkar.');
  const [jobs,setJobs]=useState([]);
  const [assistant,setAssistant]=useState({ answer:'', decision:null, error:'' });
  const [benchmark,setBenchmark]=useState(null);

  async function createVideoJob(){
    const res = await fetch('http://localhost:4000/video/create',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({prompt:videoPrompt,params:{}})
    });
    const j = await res.json();
    if(!res.ok){
      alert(j.error || 'İş oluşturulamadı');
      return;
    }
    setVideoPrompt('');
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

  async function runAssistant(){
    const res = await fetch('http://localhost:4000/ai/assist', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer '+token },
      body: JSON.stringify({ prompt: aiPrompt, context: ['PocketFlow ürün köprüsü', 'v6 benchmark'] })
    });
    const j = await res.json();
    if(!res.ok){
      setAssistant({ answer:'', decision:j.decision || null, error:j.error || 'asistan hatası' });
      return;
    }
    setAssistant({ answer:j.answer, decision:j.decision, error:'' });
  }

  async function loadBenchmark(){
    const res = await fetch('http://localhost:4000/ai/v6-benchmark', {
      headers: { Authorization: 'Bearer '+token }
    });
    const j = await res.json();
    if(res.ok) setBenchmark(j);
  }

  useEffect(()=>{ loadJobs(); loadBenchmark(); },[]);

  return (
    <div className="wrap">
      <header className="topbar">
        <h2>AliveAI Control Center</h2>
        <button onClick={onLogout}>Çıkış</button>
      </header>

      <section className="card">
        <h3>Video Üretim İşlemleri</h3>
        <textarea placeholder="Video prompt" value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)} />
        <button onClick={createVideoJob}>AliveAI ile üret</button>
        <ul>{jobs.map(j=>(<li key={j._id}>{j.prompt} — {j.status} {j.resultUrl? '✔':'✖'}</li>))}</ul>
      </section>

      <section className="card">
        <h3>Quantum Assistant (v6)</h3>
        <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} />
        <button onClick={runAssistant}>Karar + Yanıt Üret</button>
        {assistant.error ? <p className="error">Hata: {assistant.error}</p> : null}
        {assistant.answer ? <pre className="answer">{assistant.answer}</pre> : null}
        {assistant.decision ? (
          <div className="decision-box">
            <div>Versiyon: {assistant.decision.version}</div>
            <div>Confidence: {assistant.decision.confidence}</div>
            <div>Mode: {assistant.decision.layers?.quantumDecision?.mode}</div>
            <div>Majority: {assistant.decision.layers?.quantumDecision?.majorityVote}/5</div>
          </div>
        ) : null}
      </section>

      {benchmark ? (
        <section className="card">
          <h3>v6 Benchmark</h3>
          <div>Noise: gate={benchmark.noiseConfig.gateErrorRate}, phase={benchmark.noiseConfig.phaseErrorRate}, amplitude={benchmark.noiseConfig.amplitudeErrorRate}, crosstalk={benchmark.noiseConfig.crosstalkStrength}</div>
          <ul>{benchmark.scenarios.map(s=><li key={s.scenario}>{s.scenario} - {s.description}</li>)}</ul>
        </section>
      ) : null}

      <QuantumPyramid token={token} />
    </div>
  );
}
