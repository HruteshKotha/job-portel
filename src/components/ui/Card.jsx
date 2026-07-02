import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  const cardStyle = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    padding: '1.5rem',
    border: '1px solid var(--color-border)',
  };

  return (
    <div style={cardStyle} className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};
