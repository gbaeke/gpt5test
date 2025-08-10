import React, { useState } from 'react';

export default function InfoBox({ title='About', children, defaultOpen=false }) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen(o => !o);
  const id = `infobox-${title.replace(/\s+/g,'-').toLowerCase()}`;
  return (
    <div className={`infobox ${open? 'open':''}`}>
      <button
        type='button'
        className='infobox-toggle'
        onClick={toggle}
        aria-expanded={open}
        aria-controls={id}
      >
        <span className='infobox-title'>{title}</span>
        <span className='chevron' aria-hidden='true' />
      </button>
      <div id={id} hidden={!open} className='infobox-body'>
        {children}
      </div>
    </div>
  );
}
