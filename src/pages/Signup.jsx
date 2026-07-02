import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  
  const { signup, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signup(name, email, password, role);
    if (result.success) {
      navigate(role === 'employer' || role === 'company' ? '/company' : '/user');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1.5rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        
        {error && <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <Button 
              type="button" 
              variant={role === 'user' ? 'primary' : 'secondary'} 
              onClick={() => setRole('user')}
              style={{ flex: 1 }}
            >
              Job Seeker
            </Button>
            <Button 
              type="button" 
              variant={role === 'employer' ? 'primary' : 'secondary'} 
              onClick={() => setRole('employer')}
              style={{ flex: 1 }}
            >
              Employer
            </Button>
          </div>

          <Input 
            label="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up as {role === 'employer' ? 'Employer' : 'Job Seeker'}
          </Button>
        </form>

        <div style={{ margin: '2rem 0', position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--color-border)', zIndex: 1 }}></div>
          <span style={{ background: 'var(--color-surface)', padding: '0 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', position: 'relative', zIndex: 2 }}>OR CONTINUE WITH</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => { socialLogin('Google'); navigate('/user'); }} style={{ width: '100%', fontSize: '0.875rem' }}>
            Google
          </Button>
          <Button variant="secondary" onClick={() => { socialLogin('LinkedIn'); navigate('/user'); }} style={{ width: '100%', fontSize: '0.875rem' }}>
            LinkedIn
          </Button>
          <Button variant="secondary" onClick={() => { socialLogin('GitHub'); navigate('/user'); }} style={{ width: '100%', fontSize: '0.875rem' }}>
            GitHub
          </Button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
