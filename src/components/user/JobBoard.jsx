import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const JobBoard = () => {
  const { jobs, applyForJob, getUserApplications } = useData();
  const { user } = useAuth();
  
  const userApplications = getUserApplications(user.id);
  const appliedJobIds = userApplications.map(app => app.jobId);
  
  const openJobs = jobs.filter(job => job.status === 'open');

  const handleApply = (job) => {
    applyForJob({
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    });
  };

  if (openJobs.length === 0) {
    return <Card><p style={{ color: 'var(--color-text-muted)' }}>No open jobs available at the moment.</p></Card>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {openJobs.map(job => {
        const hasApplied = appliedJobIds.includes(job.id);
        
        return (
          <Card key={job.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{job.title}</h4>
              <p style={{ color: 'var(--color-primary)', fontWeight: '500', marginBottom: '1rem' }}>
                {job.companyName}
              </p>
              <p style={{ 
                color: 'var(--color-text-muted)', 
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {job.description}
              </p>
            </div>
            
            <Button 
              variant={hasApplied ? 'secondary' : 'primary'} 
              onClick={() => handleApply(job)}
              disabled={hasApplied}
              style={{ width: '100%' }}
            >
              {hasApplied ? 'Applied' : 'Apply Now'}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};

export default JobBoard;
