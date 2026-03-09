import React, { useEffect, useState } from 'react';

const FALLBACK = {
  title: 'QUANTUM COLLECTIVE AI v6 — TAM MİMARİ',
  subtitle: 'Crosstalk · N-Ajan W-State · Hiyerarşik Mentor · QEC',
  innovations: [],
  flow: [],
  scenarios: [],
  roadmap: []
};

export default function QuantumPyramid({ token }){
  const [data,setData] = useState(FALLBACK);
  const [error,setError] = useState('');

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('http://localhost:4000/ai/quantum-collective-skeleton', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if(!res.ok) throw new Error(json.error || 'mimari alınamadı');
        setData(json);
      }catch(e){
        setError(e.message);
      }
    }
    load();
  }, [token]);

  return (
    <section className="quantum-panel">
      <h3>{data.title}</h3>
      <p>{data.subtitle}</p>
      {error ? <small>Canlı veri alınamadı: {error}</small> : null}

      <h4>Tur Akışı</h4>
      <div className="flow-line">{(data.flow || []).join(' → ')}</div>

      <h4>Yenilikler</h4>
      <div className="pyramid">
        {(data.innovations || []).map((item)=>(
          <article key={item.id} className="layer-card">
            <strong>{item.id} · {item.name}</strong>
            <div>Operasyon: {item.operation}</div>
            <div>Denklem: {item.equation}</div>
          </article>
        ))}
      </div>

      <h4>Benchmark Senaryoları</h4>
      <ul>
        {(data.scenarios || []).map((s)=><li key={s.scenario}>{s.scenario}: {s.description}</li>)}
      </ul>

      <h4>v7 Yol Haritası</h4>
      <ul>
        {(data.roadmap || []).map((item)=><li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
