import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const JobPostForm = () => {
  const { user } = useAuth();
  const { addJob } = useData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addJob({
      title,
      description,
      companyId: user.id,
      companyName: user.name
    });
    setSuccess(true);
    setTitle('');
    setDescription('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Card className="animate-fade-in" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Post a New Job</h3>
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>Job posted successfully!</div>}
      <form onSubmit={handleSubmit}>
        <Input 
          label="Job Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          placeholder="e.g. Senior React Developer"
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <label style={{ fontWeight: '500', fontSize: '0.875rem' }}>Job Description</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={5}
            style={{
              padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)',
              background: 'var(--color-surface)', color: 'var(--color-text)', fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Describe the role, responsibilities, and requirements..."
          />
        </div>
        
        <Button type="submit" variant="primary">Post Job</Button>
      </form>
    </Card>
  );
};

export default JobPostForm;
