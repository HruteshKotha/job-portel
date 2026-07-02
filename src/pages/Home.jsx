import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Lightfall from '../components/ui/Lightfall';

const Home = () => {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
      
      {/* Hero Section with Lightfall Background */}
      <div style={{ width: '100%', minHeight: '600px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Absolute positioned Lightfall */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Lightfall
            colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
            backgroundColor="#0A29FF"
            speed={0.5}
            streakCount={2}
            streakWidth={1}
            streakLength={1}
            glow={1}
            density={0.6}
            twinkle={1}
            zoom={3}
            backgroundGlow={0.5}
            opacity={1}
            mouseInteraction
            mouseStrength={0.5}
            mouseRadius={1}
            color1="#A6C8FF"
            color2="#5227FF"
            color3="#FF9FFC"
          />
        </div>

        {/* Hero Content on top */}
        <div style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>
            Find Your Dream Job <br />
            <span style={{ color: '#FF9FFC' }}>with JobPortal</span>
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', lineHeight: '1.8', opacity: 0.9 }}>
            The ultimate platform connecting top talent with industry-leading companies.
            Whether you're looking to hire or be hired, we've got you covered.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/signup">
              <Button variant="primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', background: '#FF9FFC', color: '#0A29FF' }}>
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" style={{ padding: '1rem 2rem', fontSize: '1.125rem', color: 'white', border: '1px solid white' }}>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container" style={{ 
        padding: '5rem 1.5rem',
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Job Seekers</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Build your resume, browse thousands of jobs, and track your applications all in one place.
          </p>
          <ul style={{ color: 'var(--color-text-muted)', paddingLeft: '1.5rem', lineHeight: '2' }}>
            <li>Create a standout profile</li>
            <li>Apply with one click</li>
            <li>Real-time application tracking</li>
          </ul>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Companies</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Post jobs, manage applicants, and find the perfect fit for your team effortlessly.
          </p>
          <ul style={{ color: 'var(--color-text-muted)', paddingLeft: '1.5rem', lineHeight: '2' }}>
            <li>Post and manage job listings</li>
            <li>Review applicant profiles & resumes</li>
            <li>Streamlined hiring process</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
