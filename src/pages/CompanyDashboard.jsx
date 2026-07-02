import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { Navigate } from 'react-router-dom';
import CompanyOverview from '../components/company/CompanyOverview';
import CompanyProfile from '../components/company/CompanyProfile';
import JobManagement from '../components/company/JobManagement';
import CandidateManagement from '../components/company/CandidateManagement';
import Messages from '../components/shared/Messages';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'employer') {
    return <Navigate to="/login" />;
  }

  const menuStyle = (isActive) => ({
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    background: isActive ? 'var(--color-surface-hover)' : 'transparent',
    borderLeft: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
    fontWeight: isActive ? '600' : '400',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s',
    borderBottom: 'none', borderTop: 'none', borderRight: 'none',
    textAlign: 'left',
    width: '100%',
    fontSize: '1rem'
  });

  const handleNav = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Toggle Button */}
      <div className="mobile-menu-btn no-print" style={{ padding: '1rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }} onClick={() => setSidebarOpen(true)}>
        ☰ Menu
      </div>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${sidebarOpen ? 'open' : ''} no-print`} onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>{t('employerHub')}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{user.name}</p>
        </div>
        
        <button style={menuStyle(activeTab === 'overview')} onClick={() => handleNav('overview')}>
          {t('overview')}
        </button>
        <button style={menuStyle(activeTab === 'profile')} onClick={() => handleNav('profile')}>
          {t('companyProfile')}
        </button>
        <button style={menuStyle(activeTab === 'jobs')} onClick={() => handleNav('jobs')}>
          {t('jobPostings')}
        </button>
        <button style={menuStyle(activeTab === 'candidates')} onClick={() => handleNav('candidates')}>
          {t('candidates')}
        </button>
        <button style={menuStyle(activeTab === 'messages')} onClick={() => handleNav('messages')}>
          {t('messages')}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'overview' && <CompanyOverview />}
          {activeTab === 'profile' && <CompanyProfile />}
          {activeTab === 'jobs' && <JobManagement />}
          {activeTab === 'candidates' && <CandidateManagement onNavigate={setActiveTab} />}
          {activeTab === 'messages' && <Messages />}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
