import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import JobDetailsModal from './JobDetailsModal';

const AdvancedJobSearch = () => {
  const { jobs, savedJobs, saveJob, unsaveJob, getUserApplications } = useData();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '', category: '', workType: '', remoteStatus: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);

  const openJobs = jobs.filter(job => job.status === 'open');
  const userSaved = savedJobs[user.id] || [];
  const userApps = getUserApplications(user.id).map(a => a.jobId);

  // Filter Logic
  const filteredJobs = openJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filters.location || job.location.includes(filters.location);
    const matchesCategory = !filters.category || job.category === filters.category;
    const matchesWorkType = !filters.workType || job.workType === filters.workType;
    const matchesRemote = !filters.remoteStatus || job.remoteStatus === filters.remoteStatus;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesWorkType && matchesRemote;
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleSave = (e, jobId) => {
    e.stopPropagation();
    if (userSaved.includes(jobId)) {
      unsaveJob(user.id, jobId);
    } else {
      saveJob(user.id, jobId);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
      
      {/* Sidebar Filters */}
      <Card style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Filters</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Search</label>
            <input 
              type="text" 
              placeholder="Job title, company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}>
              <option value="">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Location</label>
            <input 
              type="text" 
              name="location"
              placeholder="e.g. New York, Remote" 
              value={filters.location}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', display: 'block' }}>Remote Setup</label>
            <select name="remoteStatus" value={filters.remoteStatus} onChange={handleFilterChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)' }}>
              <option value="">Any</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          
          <Button variant="ghost" onClick={() => setFilters({location: '', category: '', workType: '', remoteStatus: ''})}>Clear Filters</Button>
        </div>
      </Card>

      {/* Job Listings */}
      <div>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Search Results</h2>
          <span style={{ color: 'var(--color-text-muted)' }}>{filteredJobs.length} jobs found</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredJobs.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No jobs match your criteria.</p>
          ) : (
            filteredJobs.map(job => {
              const isSaved = userSaved.includes(job.id);
              const hasApplied = userApps.includes(job.id);

              return (
                <div key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  style={{ 
                    padding: '1.5rem', background: 'var(--color-surface)', 
                    border: '1px solid var(--color-border)', borderRadius: '0.5rem', 
                    cursor: 'pointer', transition: 'border-color 0.2s',
                    display: 'flex', flexDirection: 'column', gap: '1rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>{job.title}</h3>
                      <p style={{ fontWeight: '500' }}>{job.companyName}</p>
                    </div>
                    <button 
                      onClick={(e) => toggleSave(e, job.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', opacity: isSaved ? 1 : 0.2 }}
                      title={isSaved ? "Remove Bookmark" : "Bookmark Job"}
                    >
                      ⭐
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.875rem', background: 'var(--color-surface-hover)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>📍 {job.location}</span>
                    <span style={{ fontSize: '0.875rem', background: 'var(--color-surface-hover)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>💰 {job.salary}</span>
                    <span style={{ fontSize: '0.875rem', background: 'var(--color-surface-hover)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>🏠 {job.remoteStatus}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                    {hasApplied ? (
                      <span style={{ color: 'green', fontWeight: '500', fontSize: '0.875rem' }}>✓ Applied</span>
                    ) : (
                      <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View & Apply</Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default AdvancedJobSearch;
