import React,{useState} from 'react';
import axios from 'axios';
import FeatureInfo from './FeatureInfo';
import ModelSelect from './ModelSelect';

export default function MinimalReasoningPanel(){
  const [systemPrompt,setSystemPrompt]=useState('Classify sentiment as positive|neutral|negative. Return one word only.');
  const [userInput,setUserInput]=useState('The food at the restaurant was great!');
  const [output,setOutput]=useState('');
  const [model,setModel]=useState('gpt-5');
  const [loading,setLoading]=useState(false);
  const run=async()=>{
    setLoading(true);setOutput('');
    try{
      const resp=await axios.post('/api/minimal',{model, system_prompt: systemPrompt, user_input: userInput});
      setOutput(resp.data.output);
    }catch(e){
      alert(e.response?.data?.detail||e.message);
    }finally{setLoading(false);}
  };
  return (
    <div>
      <h2>Minimal Reasoning</h2>
      <p>Fast low-effort reasoning mode.</p>
      <FeatureInfo
        label="Reasoning"
        description="reasoning.effort=minimal requests a fast lightweight response vs deeper deliberation (medium/high)."
        payload={{
          model,
          input: [
            { role: 'developer', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          reasoning: { effort: 'minimal' }
        }}
      />
  <ModelSelect value={model} onChange={setModel} />
  <label>System Prompt<textarea rows={2} value={systemPrompt} onChange={e=>setSystemPrompt(e.target.value)} /></label>
  <label>User Input<textarea rows={2} value={userInput} onChange={e=>setUserInput(e.target.value)} /></label>
  <button onClick={run} disabled={loading}>{loading? <><span className='spinner'/> Running</>:'Run'}</button>
      {output && <div className='card'><h3>Output</h3><pre>{output}</pre></div>}
    </div>
  );
}
