import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const JobManagement = () => {
  const { user } = useAuth();
  const { getCompanyJobs, addJob, updateJob, deleteJob, toggleJobStatus } = useData();
  
  const jobs = getCompanyJobs(user.id);
  
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', location: '', salary: '', experience: '', 
    workType: 'Full-time', category: 'Engineering', remoteStatus: 'On-site',
    description: '', responsibilities: '', skillsRequired: '', benefits: ''
  });

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJobId(job.id);
      setFormData({
        title: job.title || '', location: job.location || '', salary: job.salary || '', 
        experience: job.experience || '', workType: job.workType || 'Full-time', 
        category: job.category || 'Engineering', remoteStatus: job.remoteStatus || 'On-site',
        description: job.description || '', responsibilities: job.responsibilities || '', 
        skillsRequired: job.skillsRequired || '', benefits: job.benefits || ''
      });
    } else {
      setEditingJobId(null);
      setFormData({
        title: '', location: '', salary: '', experience: '', 
        workType: 'Full-time', category: 'Engineering', remoteStatus: 'On-site',
        description: '', responsibilities: '', skillsRequired: '', benefits: ''
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingJobId) {
      updateJob(editingJobId, formData);
    } else {
      addJob({
        ...formData,
        companyId: user.id,
        companyName: user.name,
      });
    }
    setShowModal(false);
  };

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This will also remove associated applications.')) {
      deleteJob(jobId);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Job Management</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>+ Post New Job</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {jobs.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>No Jobs Posted</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>You haven't posted any jobs yet. Click "Post New Job" to get started.</p>
          </Card>
        ) : (
          jobs.map(job => (
            <Card key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: job.status === 'closed' ? 'var(--color-text-muted)' : 'var(--color-heading)' }}>
                    {job.title}
                  </h3>
                  <span style={{ 
                    fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '999px', fontWeight: '600', textTransform: 'uppercase',
                    background: job.status === 'open' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                    color: job.status === 'open' ? 'green' : 'var(--color-accent)'
                  }}>
                    {job.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>👥 {job.category}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" onClick={() => toggleJobStatus(job.id)} style={{ color: job.status === 'open' ? 'var(--color-accent)' : 'green' }}>
                  {job.status === 'open' ? 'Close' : 'Reopen'}
                </Button>
                <Button variant="secondary" onClick={() => handleOpenModal(job)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(job.id)}>Delete</Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingJobId ? 'Edit Job' : 'Post New Job'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} required />
                <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, NY" required />
                <Input label="Salary Range" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $100k - $120k" required />
                <Input label="Experience Required" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. Mid-level (3-5 years)" required />
                
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Work Type</label>
                  <select name="workType" value={formData.workType} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Remote Status</label>
                  <select name="remoteStatus" value={formData.remoteStatus} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Job Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} required />
              </div>
              
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Responsibilities</label>
                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Skills Required</label>
                <textarea name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Benefits</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">{editingJobId ? 'Save Changes' : 'Post Job'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
