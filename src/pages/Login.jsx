import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('jobPortalUser'));
      navigate(user.role === 'company' ? '/company' : '/user');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1.5rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        {error && <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
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
            Login
          </Button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Sign up</Link>
          </p>
          <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: '500' }}>
            Forgot Password?
          </Link>
        </div>

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
      </Card>
    </div>
  );
};

export default Login;
