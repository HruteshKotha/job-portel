import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '', title: '', email: '', phone: '', summary: '', 
    experience: '', education: '', skills: '', certifications: '', 
    projects: '', languages: '', website: '', profilePhoto: null, resumeFile: null
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('jobPortalProfile');
    if (data) {
      setProfileData(JSON.parse(data));
    } else if (user) {
      // Pre-fill from auth
      setProfileData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, field) => {
    // Mock file upload: just store the file name to simulate success
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSave = () => {
    localStorage.setItem('jobPortalProfile', JSON.stringify(profileData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const { score, suggestions } = React.useMemo(() => {
    let s = 30; // base score
    const suggs = [];
    
    if (profileData.summary && profileData.summary.length > 50) s += 20;
    else suggs.push("Improve Summary");
    
    if (profileData.education && profileData.education.trim().length > 0) s += 10;
    else suggs.push("Add Education");
    
    if (profileData.experience && profileData.experience.trim().length > 0) s += 15;
    else suggs.push("Add Experience");
    
    if (profileData.skills && profileData.skills.trim().length > 0) s += 10;
    else suggs.push("Add Skills");
    
    if (profileData.projects && profileData.projects.trim().length > 0) s += 10;
    else suggs.push("Add Projects");
    
    if (profileData.certifications && profileData.certifications.trim().length > 0) s += 5;
    else suggs.push("Add Certifications");

    if (profileData.website && profileData.website.trim().length > 0) s += 5; // GitHub or portfolio

    return { score: Math.min(s, 100), suggestions: suggs };
  }, [profileData]);

  const sectionStyle = {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--color-border)'
  };

  const sectionTitle = { fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-heading)' };
  const labelStyle = { fontWeight: '500', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' };
  const textAreaStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical' };

  const publicProfileUrl = user ? `${window.location.origin}/p/${user.id}` : '';
  const qrCodeUrl = publicProfileUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicProfileUrl)}` : '';

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Profile</h2>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>
      
      {saved && <div style={{ background: 'rgba(0,255,0,0.1)', color: 'green', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>Profile saved successfully!</div>}

      <div style={{ ...sectionStyle, display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={{ ...sectionTitle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📄 Resume Score</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Your score is automatically calculated based on the details you provide below. A complete profile increases your chances of getting hired!</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: score >= 80 ? 'green' : score >= 50 ? '#f59e0b' : 'var(--color-accent)' }}>
              {score}/100
            </div>
            <div style={{ flex: 1, height: '8px', background: 'var(--color-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: score >= 80 ? 'green' : score >= 50 ? '#f59e0b' : 'var(--color-accent)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div style={{ flex: 1, minWidth: '300px', background: 'var(--color-surface-hover)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Suggestions to Improve:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
              {(!profileData.website || profileData.website.trim().length === 0) && <li>Add GitHub / Portfolio Link</li>}
            </ul>
          </div>
        )}
      </div>

      <div style={{ ...sectionStyle, background: 'var(--color-surface-hover)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
        <h3 style={{ ...sectionTitle, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>🔗 Share Your Profile</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Share this QR code or link with employers to give them a quick overview of your skills and experience.</p>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {qrCodeUrl && (
            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
              <img src={qrCodeUrl} alt="Profile QR Code" style={{ display: 'block', width: '120px', height: '120px' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <Input 
              label="Public Profile Link" 
              value={publicProfileUrl} 
              readOnly 
            />
            <Button 
              variant="secondary" 
              onClick={() => { navigator.clipboard.writeText(publicProfileUrl); alert("Copied to clipboard!"); }}
              style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Personal Details & Photo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Input label="Full Name" name="name" value={profileData.name} onChange={handleChange} />
          <Input label="Professional Title" name="title" value={profileData.title} onChange={handleChange} placeholder="e.g. UX Designer" />
          <Input label="Email Address" name="email" value={profileData.email} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={profileData.phone} onChange={handleChange} />
          <Input label="GitHub / Portfolio Website" name="website" value={profileData.website} onChange={handleChange} placeholder="https://github.com/..." />
        </div>
        <div>
          <label style={labelStyle}>Profile Photo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-surface-hover)', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profileData.profilePhoto ? '📷' : '👤'}
            </div>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePhoto')} />
            {profileData.profilePhoto && <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>{profileData.profilePhoto} attached</span>}
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Resume (PDF)</h3>
        <div>
          <label style={labelStyle}>Upload your latest resume</label>
          <div style={{ padding: '2rem', border: '2px dashed var(--color-border)', borderRadius: '0.5rem', textAlign: 'center' }}>
            <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'resumeFile')} style={{ marginBottom: '1rem' }} />
            {profileData.resumeFile ? (
              <p style={{ color: 'green', fontWeight: '500' }}>✓ {profileData.resumeFile}</p>
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>No file chosen</p>
            )}
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Professional Summary</h3>
        <label style={labelStyle}>Write a brief summary about yourself</label>
        <textarea name="summary" value={profileData.summary} onChange={handleChange} rows={4} style={textAreaStyle} />
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Experience & Education</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Work Experience (Company, Role, Dates)</label>
            <textarea name="experience" value={profileData.experience} onChange={handleChange} rows={4} style={textAreaStyle} />
          </div>
          <div>
            <label style={labelStyle}>Education (Degree, Institution, Year)</label>
            <textarea name="education" value={profileData.education} onChange={handleChange} rows={3} style={textAreaStyle} />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitle}>Skills, Certifications & More</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Skills (Comma separated)</label>
            <textarea name="skills" value={profileData.skills} onChange={handleChange} rows={3} style={textAreaStyle} placeholder="React, Node.js, Design..." />
          </div>
          <div>
            <label style={labelStyle}>Certifications</label>
            <textarea name="certifications" value={profileData.certifications} onChange={handleChange} rows={3} style={textAreaStyle} placeholder="AWS Certified, PMP..." />
          </div>
          <div>
            <label style={labelStyle}>Projects</label>
            <textarea name="projects" value={profileData.projects} onChange={handleChange} rows={3} style={textAreaStyle} placeholder="E-commerce App, Portfolio..." />
          </div>
          <div>
            <label style={labelStyle}>Languages</label>
            <textarea name="languages" value={profileData.languages} onChange={handleChange} rows={3} style={textAreaStyle} placeholder="English, Spanish..." />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>
    </Card>
  );
};

export default UserProfile;
