import React from 'react';
import { useData } from '../../context/DataContext';

const ApplicantList = ({ jobId }) => {
  const { getJobApplications, updateApplicationStatus } = useData();
  const applications = getJobApplications(jobId);

  if (applications.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No applications yet.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h5 style={{ fontSize: '1.125rem' }}>Applicants ({applications.length})</h5>
      {applications.map(app => (
        <div key={app.id} style={{ 
          padding: '1.5rem', 
          background: 'rgba(0,0,0,0.02)', 
          borderRadius: '0.5rem',
          border: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{app.userName}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>{app.userEmail}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Cover Letter:</span>
                  <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', background: 'var(--color-surface)', padding: '0.5rem', borderRadius: '0.25rem', marginTop: '0.25rem' }}>
                    {app.coverLetter || 'No cover letter provided.'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>Resume:</span>
                  <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem', color: app.resumeFile !== 'No file attached' ? 'green' : 'var(--color-text-muted)' }}>
                    {app.resumeFile || 'No file attached'}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Update Status:</label>
              <select 
                value={app.status} 
                onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.25rem', 
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)'
                }}
              >
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicantList;
