import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '1rem',
    border: 'none',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };
  
  const variants = {
    primary: {
      background: 'var(--gradient-primary)',
      color: 'white',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      background: 'white',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
    },
    danger: {
      background: 'var(--color-accent)',
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text)',
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant], ...(props.style || {}) }}
      className={`btn ${className}`}
      {...Object.fromEntries(Object.entries(props).filter(([k]) => k !== 'style'))}
    >
      {children}
    </button>
  );
};
