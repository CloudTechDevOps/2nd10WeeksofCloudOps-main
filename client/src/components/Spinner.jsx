import React from 'react';

export default function Spinner({ fullscreen, size = 32 }) {
  const s = (
    <span style={{
      display: 'inline-block',
      width: size, height: size,
      border: `3px solid rgba(139,92,246,0.2)`,
      borderTopColor: '#8b5cf6',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
  if (!fullscreen) return s;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--ink)',
    }}>
      {s}
    </div>
  );
}
