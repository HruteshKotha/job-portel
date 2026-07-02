import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const DashboardOverview = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getUserApplications, jobs } = useData();
  
  const applications = getUserApplications(user.id);
  
  // Calculate mock profile completion
  const profileData = JSON.parse(localStorage.getItem('jobPortalProfile') || '{}');
  const profileFields = ['name', 'title', 'email', 'phone', 'summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'languages'];
  const filledFields = profileFields.filter(field => profileData[field] && profileData[field].length > 0).length;
  const completionPercent = Math.round((filledFields / profileFields.length) * 100) || 15; // default 15% for basic auth info

  // AI Recommendation Engine
  const recommendedJobs = useMemo(() => {
    const openJobs = jobs.filter(j => j.status === 'open');
    if (!profileData.skills && applications.length === 0) return openJobs.slice(0, 2).map(j => ({...j, matchScore: 0}));

    const userSkills = (profileData.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    const userExp = (profileData.experience || '').toLowerCase();
    
    // Get categories of past applications
    const appliedJobIds = applications.map(a => a.jobId);
    const pastCategories = applications.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return job ? job.category : null;
    }).filter(c => c);

    const scoredJobs = openJobs.filter(j => !appliedJobIds.includes(j.id)).map(job => {
      let score = 0;
      let maxScore = 0;
      
      // Skill Matching (+10 pts per match)
      const jobSkills = (job.skillsRequired || '').split(',').map(s => s.trim()).filter(s => s);
      jobSkills.forEach(skill => {
        maxScore += 10;
        if (userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))) {
          score += 10;
        }
      });

      // Category Matching (+20 pts)
      if (pastCategories.includes(job.category)) {
        score += 20;
      }
      maxScore += 20;

      // Experience Matching (rough heuristic, +10 pts)
      const jobExp = (job.experience || '').toLowerCase();
      if (userExp.includes('senior') && jobExp.includes('senior')) score += 10;
      else if (!userExp.includes('senior') && !jobExp.includes('senior')) score += 10;
      maxScore += 10;

      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return { ...job, matchScore: percentage };
    });

    return scoredJobs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [jobs, profileData, applications]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '2rem', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', color: 'white' }}>
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Welcome back, {user.name}!</h2>
        <p style={{ opacity: 0.9 }}>Ready to find your next opportunity?</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Profile Completion Widget */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Profile Completion</h3>
          
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-border)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeDasharray={`${(completionPercent / 100) * 314} 314`} style={{ transition: 'stroke-dasharray 1s ease-out' }} />
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-heading)' }}>
              {completionPercent}%
            </span>
          </div>
          
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Complete your profile to stand out to recruiters!
          </p>
          <Button variant="secondary" onClick={() => onNavigate('profile')} style={{ width: '100%' }}>
            Complete Profile
          </Button>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Recent Applications */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem' }}>Recent Applications</h3>
              <Button variant="ghost" onClick={() => onNavigate('tracker')}>View All</Button>
            </div>
            
            {applications.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No recent applications.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.sort((a,b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 3).map(app => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--color-surface-hover)', borderRadius: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>{app.jobTitle}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>{app.companyName}</p>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize', color: app.status === 'rejected' ? 'var(--color-accent)' : app.status === 'selected' ? 'green' : 'var(--color-secondary)' }}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* AI Recommended Jobs */}
          <Card>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🤖 AI Top Matches
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendedJobs.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)' }}>No new jobs available at the moment.</p>
              ) : (
                recommendedJobs.map(job => (
                  <div key={job.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '0.5rem', position: 'relative' }}>
                    
                    {job.matchScore > 0 && (
                      <span style={{ 
                        position: 'absolute', top: '-10px', right: '10px', 
                        background: job.matchScore >= 80 ? 'green' : job.matchScore >= 50 ? '#f59e0b' : 'var(--color-accent)', 
                        color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', boxShadow: 'var(--shadow-sm)'
                      }}>
                        🔥 {job.matchScore}% Match
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.125rem', paddingRight: '6rem' }}>{job.title}</h4>
                      <span style={{ fontSize: '0.875rem', background: 'var(--color-surface-hover)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{job.salary}</span>
                    </div>
                    <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{job.companyName} &bull; {job.location}</p>
                    <Button variant="secondary" onClick={() => onNavigate('search')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Job Search</Button>
                  </div>
                ))
              )}
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
