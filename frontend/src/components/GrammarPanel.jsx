import React,{useState} from 'react';
import axios from 'axios';
import FeatureInfo from './FeatureInfo';
import ModelSelect from './ModelSelect';

const defaultLark=`SP: " "\nstart: "SELECT" SP "TOP" SP NUMBER SP "col" SP "FROM" SP "t" SP "WHERE" SP "amount" SP ">" SP NUMBER SEMI\nSEMI: ";"\nNUMBER: /[0-9]+/`;
const defaultRegex = '^\\d{4}-\\d{2}-\\d{2}$';

const defaultPromptLark = 'Generate a TOP 5 query';
const defaultPromptRegex = 'Generate a date in format YYYY-MM-DD';

export default function GrammarPanel(){
  const [syntax,setSyntax]=useState('lark');
  const [definition,setDefinition]=useState(defaultLark);
  const [prompt,setPrompt]=useState('Generate a TOP 5 query');
  const [output,setOutput]=useState('');
  const [model,setModel]=useState('gpt-5');
  const [loading,setLoading]=useState(false);

  const run=async()=>{
    setLoading(true);setOutput('');
    try{
      const resp=await axios.post('/api/grammar',{model, grammar_name:'demo_grammar', grammar_definition: definition, grammar_syntax: syntax, prompt});
      setOutput(resp.data.output);
    }catch(e){
      alert(e.response?.data?.detail||e.message);
    }finally{setLoading(false);}
  };

  return (
    <div>
      <h2>Context-Free Grammar (CFG)</h2>
      <p>Constrain model output to a grammar (Lark or Regex).</p>
      <FeatureInfo
        label="Grammar"
        description="Custom tool with format.grammar (lark or regex) constrains model output to supplied grammar definition."
        payload={{
          model,
          input: prompt,
          tools: [{
            type: 'custom',
            name: 'demo_grammar',
            description: 'Grammar constrained output',
            format: { type: 'grammar', syntax, definition }
          }],
          parallel_tool_calls: false
        }}
      />
      <div className='form-row'>
  <ModelSelect value={model} onChange={setModel} />
        <label>Syntax<select value={syntax} onChange={e=>{ const val=e.target.value; setSyntax(val); setDefinition(val==='lark'?defaultLark:defaultRegex); // update prompt only if currently one of the defaults or blank
          setPrompt(p=>{ const isDefault = [defaultPromptLark, defaultPromptRegex, ''].includes(p); return isDefault ? (val==='lark'? defaultPromptLark: defaultPromptRegex) : p; });
        }}> <option value='lark'>lark</option><option value='regex'>regex</option></select></label>
      </div>
      <label>Grammar Definition<textarea rows={4} value={definition} onChange={e=>setDefinition(e.target.value)} /></label>
      <label>Prompt<textarea rows={2} value={prompt} onChange={e=>setPrompt(e.target.value)} /></label>
      <button onClick={run} disabled={loading}>{loading? <><span className='spinner'/> Running</>:'Run'}</button>
      {output && <div className='card'><h3>Grammar Output</h3><pre>{output}</pre></div>}
    </div>
  );
}
