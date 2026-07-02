import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const ResumeBuilder = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('jobPortalProfile');
    if (data) {
      setProfile(JSON.parse(data));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!profile) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No Profile Data Found</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Please fill out your profile in the "My Profile" tab first to generate a resume.</p>
        </div>
      </Card>
    );
  }

  // Split comma-separated skills
  const skillsArray = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Resume Builder</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Your profile data is automatically formatted into an ATS-friendly design.</p>
        </div>
        <Button variant="primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🖨️ Download / Print PDF
        </Button>
      </div>

      {/* The Printable Resume Area */}
      <div 
        className="print-only"
        style={{ 
          background: 'white', 
          color: 'black',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)',
          fontFamily: "'Inter', sans-serif",
          maxWidth: '850px',
          margin: '0 auto',
          textAlign: 'left'
        }}
      >
        <div style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#111' }}>{profile.name || 'Your Name'}</h1>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#555', fontWeight: '500' }}>{profile.title || ''}</h3>
          <div style={{ fontSize: '14px', color: '#555', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {profile.email && <span>✉️ {profile.email}</span>}
            {profile.phone && <span>📞 {profile.phone}</span>}
            {profile.website && <span>🔗 {profile.website}</span>}
          </div>
        </div>

        {profile.summary && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Summary</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', margin: 0 }}>{profile.summary}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '30px' }}>
          {/* Main Column */}
          <div style={{ flex: '2' }}>
            {profile.experience && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-line' }}>
                  {profile.experience}
                </div>
              </div>
            )}
            
            {profile.projects && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-line' }}>
                  {profile.projects}
                </div>
              </div>
            )}
          </div>

          {/* Side Column */}
          <div style={{ flex: '1' }}>
            {profile.education && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-line' }}>
                  {profile.education}
                </div>
              </div>
            )}

            {skillsArray.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skillsArray.map((skill, idx) => (
                    <span key={idx} style={{ fontSize: '12px', padding: '4px 8px', background: '#f0f0f0', borderRadius: '4px', color: '#333' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Certifications</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-line' }}>
                  {profile.certifications}
                </div>
              </div>
            )}

            {profile.languages && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px', color: '#222', textTransform: 'uppercase', letterSpacing: '1px' }}>Languages</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#444', whiteSpace: 'pre-line' }}>
                  {profile.languages}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
