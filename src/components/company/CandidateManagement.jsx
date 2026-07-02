import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const CandidateManagement = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getCompanyJobs, applications, updateApplicationStatus, sendMessage } = useData();
  
  const companyJobs = getCompanyJobs(user.id);
  const jobIds = companyJobs.map(j => j.id);
  const companyApps = applications.filter(app => jobIds.includes(app.jobId));

  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Interview Scheduler State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewApp, setInterviewApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', mode: 'Online', link: '' });

  const handleOpenInterviewModal = (app) => {
    setInterviewApp(app);
    setInterviewForm({ date: '', time: '', mode: 'Online', link: '' });
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    const msg = `🎉 Interview Scheduled for ${interviewApp.jobTitle}! Date: ${interviewForm.date} at ${interviewForm.time}. Mode: ${interviewForm.mode}. ${interviewForm.link ? `Details: ${interviewForm.link}` : ''}`;
    
    updateApplicationStatus(interviewApp.id, 'interview', msg);
    setShowInterviewModal(false);
    setInterviewApp(null);
  };

  const handleMessageCandidate = (app) => {
    // Send an initial greeting if this is the first time chatting (optional, but good for UX)
    // Here we just navigate to messages tab
    // The user will select the candidate from the inbox
    // To make it seamless, we'll send a "Hi!" system message so the thread exists
    sendMessage(user.id, user.name, app.userId, app.userName, `Hi ${app.userName}, thanks for applying to the ${app.jobTitle} position! Let's chat.`);
    if (onNavigate) {
      onNavigate('messages');
    }
  };

  const filteredApps = companyApps.filter(app => {
    const matchesSearch = app.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = !filterJob || app.jobId === filterJob;
    const matchesStatus = !filterStatus || app.status === filterStatus;
    
    return matchesSearch && matchesJob && matchesStatus;
  });

  const handleDownloadResume = (fileName) => {
    if (fileName && fileName !== 'No file attached') {
      alert(`Mock Download Started: ${fileName}`);
    } else {
      alert('No resume attached.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'applied': return 'var(--color-text-muted)';
      case 'under_review': return 'var(--color-secondary)';
      case 'shortlisted': return '#f59e0b';
      case 'interview': return 'var(--color-primary)';
      case 'selected': return 'green';
      case 'rejected': return 'var(--color-accent)';
      default: return 'var(--color-text)';
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Candidate Management</h2>

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Search Candidates</label>
            <input 
              type="text" 
              placeholder="Name or Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Filter by Job</label>
            <select 
              value={filterJob} 
              onChange={(e) => setFilterJob(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}
            >
              <option value="">All Jobs</option>
              {companyJobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Filter by Status</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredApps.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No candidates match your filters.</p>
        ) : (
          filteredApps.map(app => (
            <Card key={app.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{app.userName}</h3>
                  <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{app.userEmail}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Applied for <strong>{app.jobTitle}</strong> on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    background: 'var(--color-surface-hover)',
                    border: `1px solid ${getStatusColor(app.status)}`,
                    color: getStatusColor(app.status),
                    fontWeight: '600', textTransform: 'capitalize', fontSize: '0.875rem'
                  }}>
                    {app.status.replace('_', ' ')}
                  </div>

                  {(app.resumeScore || app.aiMatchScore) && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {app.aiMatchScore && (
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--color-surface-hover)', borderRadius: '0.25rem', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                          🤖 AI Match: {app.aiMatchScore}%
                        </span>
                      )}
                      {app.resumeScore && (
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--color-surface-hover)', borderRadius: '0.25rem', border: '1px solid green', color: 'green' }}>
                          📄 Resume Score: {app.resumeScore}/100
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {app.coverLetter && (
                <div style={{ background: 'var(--color-surface-hover)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Cover Letter:</p>
                  <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{app.coverLetter}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleDownloadResume(app.resumeFile)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                  >
                    📄 Download Resume
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleMessageCandidate(app)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                  >
                    💬 Message
                  </Button>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {app.status !== 'shortlisted' && app.status !== 'selected' && app.status !== 'rejected' && (
                    <Button variant="secondary" onClick={() => updateApplicationStatus(app.id, 'shortlisted')} style={{ fontSize: '0.875rem' }}>Shortlist</Button>
                  )}
                  {app.status !== 'interview' && app.status !== 'selected' && app.status !== 'rejected' && (
                    <Button variant="primary" onClick={() => handleOpenInterviewModal(app)} style={{ fontSize: '0.875rem' }}>
                      Schedule Interview
                    </Button>
                  )}
                  {app.status !== 'rejected' && app.status !== 'selected' && (
                    <>
                      <Button variant="danger" onClick={() => updateApplicationStatus(app.id, 'rejected')} style={{ fontSize: '0.875rem' }}>Reject</Button>
                      <Button variant="primary" onClick={() => updateApplicationStatus(app.id, 'selected')} style={{ fontSize: '0.875rem', background: 'green' }}>Select</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {showInterviewModal && interviewApp && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={(e) => { if (e.target === e.currentTarget) setShowInterviewModal(false); }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: 'var(--shadow-lg)' }} className="animate-slide-up">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Schedule Interview</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Candidate: <strong style={{ color: 'var(--color-heading)' }}>{interviewApp.userName}</strong>
            </p>
            
            <form onSubmit={handleScheduleInterview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Date</label>
                  <input type="date" required value={interviewForm.date} onChange={e => setInterviewForm({...interviewForm, date: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Time</label>
                  <input type="time" required value={interviewForm.time} onChange={e => setInterviewForm({...interviewForm, time: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Mode</label>
                <select value={interviewForm.mode} onChange={e => setInterviewForm({...interviewForm, mode: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                  <option value="Online">Online (Video Call)</option>
                  <option value="Offline">Offline (In-person)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {interviewForm.mode === 'Online' ? 'Meeting Link' : 'Office Location'}
                </label>
                <input type="text" placeholder={interviewForm.mode === 'Online' ? 'e.g. Zoom/Meet link' : 'e.g. 123 Tech St, Floor 4'} value={interviewForm.link} onChange={e => setInterviewForm({...interviewForm, link: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="button" variant="ghost" onClick={() => setShowInterviewModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Send Invitation</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;
