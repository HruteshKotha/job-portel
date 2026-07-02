import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const CompanyProfile = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    logo: null,
    description: '',
    website: '',
    address: '',
    industry: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(`jobPortalCompanyProfile_${user.id}`);
    if (data) {
      setProfileData(JSON.parse(data));
    }
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, logo: file.name }));
    }
  };

  const handleSave = () => {
    localStorage.setItem(`jobPortalCompanyProfile_${user.id}`, JSON.stringify(profileData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const labelStyle = { fontWeight: '500', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' };
  const textAreaStyle = { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'vertical' };

  return (
    <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Company Profile</h2>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>
      
      {saved && <div style={{ background: 'rgba(0,255,0,0.1)', color: 'green', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>Company profile saved successfully!</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <label style={labelStyle}>Company Logo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '0.5rem', background: 'var(--color-surface-hover)', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              {profileData.logo ? '🏢' : '🖼️'}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              {profileData.logo && <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', marginTop: '0.5rem' }}>{profileData.logo} attached</p>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Input label="Company Name" name="name" value={user.name} disabled />
          <Input label="Industry" name="industry" value={profileData.industry} onChange={handleChange} placeholder="e.g. Technology, Healthcare" />
          <Input label="Website" name="website" value={profileData.website} onChange={handleChange} placeholder="https://example.com" />
          <Input label="Headquarters Address" name="address" value={profileData.address} onChange={handleChange} placeholder="City, State, Country" />
        </div>

        <div>
          <label style={labelStyle}>Company Description</label>
          <textarea 
            name="description" 
            value={profileData.description} 
            onChange={handleChange} 
            rows={6} 
            style={textAreaStyle} 
            placeholder="Tell candidates about your company's mission, culture, and values."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
};

export default CompanyProfile;
