import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const CompanyOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getCompanyJobs, applications } = useData();
  
  const companyJobs = getCompanyJobs(user.id);
  const activeJobs = companyJobs.filter(j => j.status === 'open');
  
  // Get all applications for this company's jobs
  const jobIds = companyJobs.map(j => j.id);
  const companyApps = applications.filter(app => jobIds.includes(app.jobId));
  
  // Calculate hiring stats
  const totalApps = companyApps.length;
  const selectedApps = companyApps.filter(a => a.status === 'selected').length;
  const rejectedApps = companyApps.filter(a => a.status === 'rejected').length;
  const pendingApps = totalApps - selectedApps - rejectedApps;

  const statCardStyle = {
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
    padding: '1.5rem', background: 'var(--color-surface)',
    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '2rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Welcome to the Employer Hub</h2>
          <p style={{ opacity: 0.9 }}>Manage your job postings and find the perfect candidates.</p>
        </div>
        <Button variant="secondary" onClick={() => onNavigate('jobs')} style={{ background: 'white', color: 'var(--color-primary)' }}>
          Post a New Job
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div style={statCardStyle}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Total Jobs</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--color-heading)' }}>{companyJobs.length}</h3>
        </div>
        <div style={statCardStyle}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Active Jobs</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{activeJobs.length}</h3>
        </div>
        <div style={statCardStyle}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Total Applications</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--color-heading)' }}>{totalApps}</h3>
        </div>
        <div style={statCardStyle}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Pending Review</p>
          <h3 style={{ fontSize: '2rem', color: 'var(--color-secondary)' }}>{pendingApps}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Hiring Statistics</h3>
          {totalApps === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>Not enough data to display statistics.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span>Selected</span>
                  <span style={{ fontWeight: '600' }}>{Math.round((selectedApps/totalApps)*100)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(selectedApps/totalApps)*100}%`, height: '100%', background: 'green' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span>In Pipeline (Pending, Interview, etc.)</span>
                  <span style={{ fontWeight: '600' }}>{Math.round((pendingApps/totalApps)*100)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(pendingApps/totalApps)*100}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span>Rejected</span>
                  <span style={{ fontWeight: '600' }}>{Math.round((rejectedApps/totalApps)*100)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(rejectedApps/totalApps)*100}%`, height: '100%', background: 'var(--color-accent)' }}></div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Recent Candidates</h3>
            <Button variant="ghost" onClick={() => onNavigate('candidates')}>View All</Button>
          </div>
          
          {companyApps.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No candidates have applied yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {companyApps.sort((a,b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 4).map(app => (
                <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--color-surface-hover)', borderRadius: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>{app.userName}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>Applied for: {app.jobTitle}</p>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize', color: 'var(--color-text-muted)' }}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CompanyOverview;
