import React, { useState, useEffect } from 'react';

/**
 * FeatureInfo (modal variant)
 * Large info button (beside panel title) opens a full-screen overlay modal containing
 * description + live JSON payload.
 */
export default function FeatureInfo({ label='Feature', description, payload }) {
  const [open, setOpen] = useState(false);
  const pretty = JSON.stringify(payload, null, 2);

  useEffect(()=>{
    function onKey(e){ if(e.key==='Escape') setOpen(false); }
    if(open){
      window.addEventListener('keydown', onKey);
      document.body.classList.add('fi-open');
    } else {
      document.body.classList.remove('fi-open');
    }
    return ()=> {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('fi-open');
    };
  },[open]);

  return (
    <div className='feature-info-inline'>
      <button type='button' className='feature-info-btn large' onClick={()=>setOpen(true)} aria-haspopup='dialog' aria-expanded={open} aria-label={`${label} information`}>
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><circle cx='12' cy='12' r='10'/><line x1='12' y1='16' x2='12' y2='12'/><line x1='12' y1='8' x2='12' y2='8'/></svg>
        <span className='fi-label'>Info</span>
      </button>
      {open && (
        <div className='feature-info-overlay' role='dialog' aria-modal='true'>
          <div className='feature-info-modal'>
            <div className='fim-head'>
              <h3>{label} Payload & API Usage</h3>
              <button className='close-btn' onClick={()=>setOpen(false)} aria-label='Close information panel'>×</button>
            </div>
            <div className='fim-body'>
              <p className='fi-desc'>{description}</p>
              <div className='code-shell'>
                <pre><code>{pretty}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
