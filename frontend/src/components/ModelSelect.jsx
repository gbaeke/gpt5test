import React from 'react';

// Central list of available models. Adjust as needed.
export const MODEL_OPTIONS = [
  { label: 'gpt-5-mini', value: 'gpt-5-mini' },
  { label: 'gpt-5-nano', value: 'gpt-5-nano' },
  { label: 'gpt-5', value: 'gpt-5' }
];

export default function ModelSelect({ value, onChange, label = 'Model' }) {
  return (
    <label>{label}
      <select value={value} onChange={e=>onChange(e.target.value)}>
        {MODEL_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
    </label>
  );
}
