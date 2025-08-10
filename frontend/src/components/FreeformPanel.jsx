import React,{useState} from 'react';
import axios from 'axios';
import FeatureInfo from './FeatureInfo';
import ModelSelect from './ModelSelect';

export default function FreeformPanel(){
  const [instruction,setInstruction]=useState("Please use the code_exec tool to calculate the area of a circle with radius equal to the number of 'r's in strawberry");
  const [model,setModel]=useState('gpt-5-mini');
  const [code,setCode]=useState('');
  const [raw,setRaw]=useState(null);
  const [loading,setLoading]=useState(false);
  const run=async()=>{
    setLoading(true);setCode('');
    try{
      const resp=await axios.post('/api/freeform',{instruction, model});
      setCode(resp.data.code);
      setRaw(resp.data.raw);
    }catch(e){
      alert(e.response?.data?.detail||e.message);
    }finally{setLoading(false);}
  };
  return (
    <div>
      <h2>Freeform Function Calling</h2>
      <p>Model emits raw code in a custom tool call (no JSON schema).</p>
      <FeatureInfo
        label="Freeform Tool"
        description="Register a custom tool without schema. Model may emit a custom_tool_call block whose input contains raw code."
        payload={{
          model,
          input: instruction,
          text: { format: { type: 'text' } },
          tools: [{ type: 'custom', name: 'code_exec', description: 'Execute arbitrary code' }],
          parallel_tool_calls: false
        }}
      />
  <ModelSelect value={model} onChange={setModel} />
  <label>Instruction<textarea rows={3} value={instruction} onChange={e=>setInstruction(e.target.value)} /></label>
  <button onClick={run} disabled={loading}>{loading? <><span className='spinner'/> Running</>:'Run'}</button>
      {code && <div className='card'><h3>Generated Code</h3><pre>{code}</pre></div>}
    </div>
  );
}
