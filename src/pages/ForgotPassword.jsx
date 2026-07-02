import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { checkEmailExists, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (checkEmailExists(email)) {
      setStep(2);
    } else {
      setError('No account found with that email address.');
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError('');
    
    const result = resetPassword(email, newPassword);
    
    if (result.success) {
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container animate-slide-up" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1.5rem' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Reset Password</h2>
        
        {error && <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{success}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
              Enter your email address and we'll let you reset your password.
            </p>
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
              Enter your new password for {email}
            </p>
            <Input 
              label="New Password" 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              minLength={6}
            />
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
              Reset Password
            </Button>
          </form>
        )}
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>
          Remember your password? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Login here</Link>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
