import React, { useState } from 'react';
import VerbosityPanel from './components/VerbosityPanel';
import FreeformPanel from './components/FreeformPanel';
import GrammarPanel from './components/GrammarPanel';
import MinimalReasoningPanel from './components/MinimalReasoningPanel';
import './styles.css';

export default function App(){
  const [tab, setTab] = useState('verbosity');
  return (
    <div className='app-container'>
      <h1>GPT-5 Feature Explorer</h1>
      <p className='subtitle'>Explore verbosity control, freeform function calling, grammar-constrained generation, and minimal reasoning effort with the OpenAI Responses API.</p>
      <div className='tabs-wrapper'>
        <nav className='tabs'>
          {['verbosity','freeform','grammar','minimal'].map(t => (
            <button key={t} className={`tab-btn ${tab===t? 'active': ''}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </nav>
      </div>
      <div className='panel fade-in'>
        {tab==='verbosity' && <VerbosityPanel />}
        {tab==='freeform' && <FreeformPanel />}
        {tab==='grammar' && <GrammarPanel />}
        {tab==='minimal' && <MinimalReasoningPanel />}
      </div>
      <footer>All model calls use OpenAI Responses API (direct). UI theme enhanced for clarity & contrast.</footer>
    </div>
  );
}
