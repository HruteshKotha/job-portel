import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useData } from '../context/DataContext';

const PublicProfile = () => {
  const { userId } = useParams();
  const { getProfile } = useData();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load profile from our data store
    const userProfile = getProfile(userId);
    
    // Check if it's the current user's locally stored profile (fallback for demo purposes)
    const localProfile = JSON.parse(localStorage.getItem('jobPortalProfile'));
    
    if (userProfile && Object.keys(userProfile).length > 0) {
      setProfile(userProfile);
    } else if (localProfile) {
      // If we don't have a specific user id match, just show the local mock profile 
      // if it exists, otherwise leave it null.
      setProfile(localProfile);
    }
    
    setLoading(false);
  }, [userId, getProfile]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Profile Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>The profile you are looking for does not exist or has been made private.</p>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {profile.name || 'Anonymous User'}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>{profile.title || 'Professional'}</p>
        </div>
        <Link to="/">
          <Button variant="secondary">Create Your Own Profile</Button>
        </Link>
      </div>

      <Card style={{ marginBottom: '2rem', borderTop: '4px solid var(--color-primary)' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>👤</span> About Me
        </h3>
        <p style={{ color: 'var(--color-text)', lineHeight: '1.7' }}>
          {profile.summary || 'No summary provided.'}
        </p>
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💼</span> Work Experience
        </h3>
        {profile.experience && profile.experience.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {profile.experience.map((exp, idx) => (
              <div key={idx} style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--color-border)' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{exp.title}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {exp.company} • {exp.duration}
                </p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No experience details provided.</p>
        )}
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🛠️</span> Skills
        </h3>
        {profile.skills && profile.skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.skills.map((skill, idx) => (
              <span key={idx} style={{ 
                background: 'var(--color-surface-hover)', 
                color: 'var(--color-primary)', 
                padding: '0.5rem 1rem', 
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '1px solid var(--color-border)'
              }}>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No skills listed.</p>
        )}
      </Card>
      
      <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        This is a public profile generated by JobPortal.
      </div>
    </div>
  );
};

export default PublicProfile;
