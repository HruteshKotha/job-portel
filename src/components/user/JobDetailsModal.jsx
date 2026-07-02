import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';

const JobDetailsModal = ({ job, onClose }) => {
  const { user } = useAuth();
  const { applyForJob, getUserApplications } = useData();
  
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  const userApps = getUserApplications(user.id);
  const hasApplied = userApps.some(app => app.jobId === job.id);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  const simulateAIAnalysis = (file) => {
    if (!file) {
      setMatchResults(null);
      return;
    }

    setIsAnalyzing(true);
    setMatchResults(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      const profileData = JSON.parse(localStorage.getItem('jobPortalProfile') || '{}');
      const userSkillsStr = profileData.skills || '';
      const userSkills = userSkillsStr.toLowerCase().split(',').map(s => s.trim());
      
      const requiredSkillsStr = job.skillsRequired || '';
      const requiredSkills = requiredSkillsStr.split(',').map(s => s.trim()).filter(s => s);
      
      if (requiredSkills.length === 0) {
        setIsAnalyzing(false);
        return; // No skills to match against
      }

      const matchedList = requiredSkills.map(skill => {
        // Simple case-insensitive inclusion check
        const isMatch = userSkills.some(userSkill => userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill));
        return { name: skill, isMatch };
      });

      const matchCount = matchedList.filter(s => s.isMatch).length;
      const matchPercentage = Math.round((matchCount / requiredSkills.length) * 100);

      setMatchResults({
        percentage: matchPercentage,
        skills: matchedList
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) {
      simulateAIAnalysis(file);
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    
    // Calculate Resume Score to send to employer
    const profileData = JSON.parse(localStorage.getItem('jobPortalProfile') || '{}');
    let s = 30; // base score
    if (profileData.summary && profileData.summary.length > 50) s += 20;
    if (profileData.education && profileData.education.trim().length > 0) s += 10;
    if (profileData.experience && profileData.experience.trim().length > 0) s += 15;
    if (profileData.skills && profileData.skills.trim().length > 0) s += 10;
    if (profileData.projects && profileData.projects.trim().length > 0) s += 10;
    if (profileData.certifications && profileData.certifications.trim().length > 0) s += 5;
    if (profileData.website && profileData.website.trim().length > 0) s += 5;
    const resumeScore = Math.min(s, 100);

    applyForJob({
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      coverLetter,
      resumeFile: resumeFile ? resumeFile.name : 'No file attached',
      aiMatchScore: matchResults ? matchResults.percentage : null,
      resumeScore: resumeScore
    });
    onClose();
    alert('Application submitted successfully!');
  };

  // Pre-calculate Skill Gap Analysis
  const skillGapAnalysis = useMemo(() => {
    const profileData = JSON.parse(localStorage.getItem('jobPortalProfile') || '{}');
    const userSkills = (profileData.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    const requiredSkills = (job.skillsRequired || '').split(',').map(s => s.trim()).filter(s => s);
    
    if (requiredSkills.length === 0) return null;

    const matched = [];
    const missing = [];

    requiredSkills.forEach(skill => {
      const isMatch = userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us));
      if (isMatch) matched.push(skill);
      else missing.push(skill);
    });

    return { matched, missing };
  }, [job.skillsRequired]);

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem'
  };

  const modalStyle = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    width: '100%', maxWidth: '800px',
    maxHeight: '90vh', overflowY: 'auto',
    padding: '2rem', position: 'relative',
    boxShadow: 'var(--shadow-lg)'
  };

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalStyle} className="animate-slide-up">
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>&times;</button>
        
        {!showApplyForm ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{job.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{job.companyName} (⭐ {job.companyRating})</span>
                  <span>{job.location}</span>
                  <span>{job.workType}</span>
                </div>
              </div>
              <Button 
                variant={hasApplied ? 'secondary' : 'primary'} 
                disabled={hasApplied}
                onClick={() => setShowApplyForm(true)}
              >
                {hasApplied ? 'Applied' : 'Apply Now'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Job Description</h3>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)' }}>{job.description}</p>
                </section>
                <section>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Responsibilities</h3>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)' }}>{job.responsibilities}</p>
                </section>
                
                {skillGapAnalysis && (
                  <section style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--color-surface-hover)', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🤖 AI Skill Gap Analysis
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', color: 'green', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>✔</span> Your Matching Skills
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {skillGapAnalysis.matched.length === 0 ? (
                            <li style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>None matched</li>
                          ) : (
                            skillGapAnalysis.matched.map((skill, i) => (
                              <li key={i} style={{ fontSize: '0.875rem' }}>{skill}</li>
                            ))
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 style={{ fontSize: '0.875rem', color: 'var(--color-accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>❌</span> Missing Skills
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {skillGapAnalysis.missing.length === 0 ? (
                            <li style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>You have all required skills!</li>
                          ) : (
                            skillGapAnalysis.missing.map((skill, i) => (
                              <li key={i} style={{ fontSize: '0.875rem' }}>{skill}</li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}
              </div>
              
              <div style={{ background: 'var(--color-surface-hover)', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Salary</h4>
                  <p style={{ fontWeight: '500' }}>{job.salary}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Experience Required</h4>
                  <p style={{ fontWeight: '500' }}>{job.experience}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Category & Setup</h4>
                  <p style={{ fontWeight: '500' }}>{job.category} &bull; {job.remoteStatus}</p>
                </div>
                {!skillGapAnalysis && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Skills Required</h4>
                    <p style={{ fontWeight: '500' }}>{job.skillsRequired}</p>
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Benefits</h4>
                  <p style={{ fontWeight: '500' }}>{job.benefits}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleApply}>
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Apply for {job.title}</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>at {job.companyName}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Cover Letter (Optional)</label>
                <textarea 
                  value={coverLetter} 
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                  placeholder="Why are you a great fit for this role?"
                />
              </div>
              
              <div>
                <label style={{ fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Resume (PDF)</label>
                <div style={{ padding: '1.5rem', border: '1px dashed var(--color-border)', borderRadius: '0.5rem', background: 'var(--color-surface-hover)' }}>
                  <input type="file" accept=".pdf" onChange={handleFileChange} />
                  {resumeFile && <p style={{ color: 'green', marginTop: '0.5rem', fontSize: '0.875rem' }}>Attached: {resumeFile.name}</p>}
                </div>
              </div>

              {/* AI Match Results Section */}
              {isAnalyzing && (
                <div style={{ padding: '1.5rem', background: 'var(--gradient-glass)', borderRadius: '0.5rem', border: '1px solid var(--color-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', animation: 'spin 2s linear infinite' }}>🤖</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>AI is analyzing your resume...</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Extracting skills and comparing with job requirements.</p>
                  </div>
                </div>
              )}

              {!isAnalyzing && matchResults && (
                <div className="animate-slide-up" style={{ padding: '1.5rem', background: 'var(--color-surface-hover)', borderRadius: '0.5rem', border: `1px solid ${matchResults.percentage > 70 ? 'green' : matchResults.percentage > 40 ? '#f59e0b' : 'var(--color-accent)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🤖 AI Resume Match
                    </h4>
                    <span style={{ 
                      fontSize: '1.25rem', fontWeight: '700',
                      color: matchResults.percentage > 70 ? 'green' : matchResults.percentage > 40 ? '#f59e0b' : 'var(--color-accent)'
                    }}>
                      Overall Match: {matchResults.percentage}%
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                    {matchResults.skills.map((skill, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <span>{skill.name}</span>
                        <span style={{ color: skill.isMatch ? 'green' : 'var(--color-accent)' }}>
                          {skill.isMatch ? '✔' : '❌'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" variant="ghost" onClick={() => setShowApplyForm(false)}>Back</Button>
              <Button type="submit" variant="primary" disabled={isAnalyzing}>Submit Application</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
