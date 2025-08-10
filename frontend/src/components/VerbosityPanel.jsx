import React, { useState } from 'react';
import axios from 'axios';
import FeatureInfo from './FeatureInfo';
import ModelSelect from './ModelSelect';

export default function VerbosityPanel(){
  const [prompt,setPrompt]=useState('Write a poem about a boy and his first pet dog.');
  const [loading,setLoading]=useState(false);
  const [results,setResults]=useState([]);
  const [model,setModel]=useState('gpt-5-mini');
  const run=async()=>{
    setLoading(true);setResults([]);
    try{
      const resp=await axios.post('/api/verbosity',{prompt, model});
      setResults(resp.data);
    }catch(e){
      alert(e.response?.data?.detail||e.message);
    }finally{setLoading(false);}
  };
  return (
    <div>
      <h2>Verbosity Parameter</h2>
      <p>Compare low / medium / high output length from same prompt.</p>
      <FeatureInfo
        label="Verbosity"
        description="We alter only text.verbosity among low|medium|high across three calls to illustrate effect on descriptive richness and token usage."
        payload={{
          model,
          input: prompt,
          text: { verbosity: 'high' }
        }}
      />
  <ModelSelect value={model} onChange={setModel} />
  <label>Prompt<textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={3} /></label>
  <button onClick={run} disabled={loading}>{loading? <><span className='spinner'/> Running</>:'Run'}</button>
      <div className='grid'>
        {results.map(r=> (
          <div key={r.verbosity} className='card'>
            <h3>{r.verbosity}</h3>
            <small>Output tokens: {r.usage?.output_tokens}</small>
            <pre>{r.text}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
