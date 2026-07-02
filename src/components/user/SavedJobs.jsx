import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import JobDetailsModal from './JobDetailsModal';

const SavedJobs = () => {
  const { jobs, savedJobs, unsaveJob, getUserApplications } = useData();
  const { user } = useAuth();
  
  const [selectedJob, setSelectedJob] = useState(null);

  const userSavedIds = savedJobs[user.id] || [];
  const savedJobList = jobs.filter(job => userSavedIds.includes(job.id));
  const userApps = getUserApplications(user.id).map(a => a.jobId);

  if (savedJobList.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>No Saved Jobs</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>You haven't bookmarked any jobs yet. Browse the Job Search to find opportunities!</p>
      </Card>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Saved Jobs</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {savedJobList.map(job => {
          const hasApplied = userApps.includes(job.id);
          const isOpen = job.status === 'open';

          return (
            <Card key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: !isOpen ? 'var(--color-text-muted)' : 'var(--color-heading)' }}>
                  {job.title} {!isOpen && '(Closed)'}
                </h3>
                <p style={{ color: 'var(--color-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>{job.companyName}</p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <span>{job.location}</span>
                  <span>{job.salary}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Button variant="ghost" onClick={() => unsaveJob(user.id, job.id)} style={{ color: 'var(--color-accent)' }}>
                  Remove
                </Button>
                {isOpen ? (
                  <Button 
                    variant={hasApplied ? 'secondary' : 'primary'} 
                    disabled={hasApplied}
                    onClick={() => setSelectedJob(job)}
                  >
                    {hasApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>Closed</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default SavedJobs;
