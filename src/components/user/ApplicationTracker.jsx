import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';

const ApplicationTracker = () => {
  const { getUserApplications } = useData();
  const { user } = useAuth();
  
  const applications = getUserApplications(user.id).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  if (applications.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>No Applications Yet</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>You haven't applied to any jobs yet. Browse the Job Search to get started!</p>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'applied': return 'var(--color-text-muted)';
      case 'under_review': return 'var(--color-secondary)';
      case 'shortlisted': return '#f59e0b'; // amber
      case 'interview': return 'var(--color-primary)';
      case 'selected': return 'green';
      case 'rejected': return 'var(--color-accent)';
      default: return 'var(--color-text)';
    }
  };

  const getStatusLabel = (status) => {
    return status.replace('_', ' ');
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Applications</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {applications.map(app => (
          <Card key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{app.jobTitle}</h3>
              <p style={{ color: 'var(--color-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>{app.companyName}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '999px', 
                background: 'var(--color-surface-hover)',
                border: `1px solid ${getStatusColor(app.status)}`,
                color: getStatusColor(app.status),
                fontWeight: '600',
                textTransform: 'capitalize',
                fontSize: '0.875rem'
              }}>
                {getStatusLabel(app.status)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracker;
