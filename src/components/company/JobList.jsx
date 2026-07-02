import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import ApplicantList from './ApplicantList';

const JobList = () => {
  const { user } = useAuth();
  const { getCompanyJobs, toggleJobStatus } = useData();
  const jobs = getCompanyJobs(user.id);
  
  const [selectedJobId, setSelectedJobId] = useState(null);

  if (jobs.length === 0) {
    return <Card><p style={{ color: 'var(--color-text-muted)' }}>You haven't posted any jobs yet.</p></Card>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Your Posted Jobs</h3>
      {jobs.map(job => (
        <Card key={job.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{job.title}</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Status: <span style={{ 
                  fontWeight: '600', 
                  color: job.status === 'open' ? 'green' : 'var(--color-accent)' 
                }}>{job.status.toUpperCase()}</span>
              </p>
            </div>
            <Button 
              variant={job.status === 'open' ? 'danger' : 'secondary'} 
              onClick={() => toggleJobStatus(job.id)}
            >
              {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
            </Button>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}>
              {selectedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
            </Button>
          </div>
          
          {selectedJobId === job.id && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <ApplicantList jobId={job.id} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default JobList;
