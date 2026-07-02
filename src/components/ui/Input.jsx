import React from 'react';

export const Input = ({ label, id, error, ...props }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
    width: '100%'
  };

  const labelStyle = {
    fontWeight: '500',
    color: 'var(--color-heading)',
    fontSize: '0.875rem'
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: `1px solid ${error ? 'var(--color-accent)' : 'var(--color-border)'}`,
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <input 
        id={id}
        style={inputStyle}
        {...props}
      />
      {error && <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem' }}>{error}</span>}
    </div>
  );
};
