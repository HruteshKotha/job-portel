import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { Navigate } from 'react-router-dom';
import DashboardOverview from '../components/user/DashboardOverview';
import UserProfile from '../components/user/UserProfile';
import AdvancedJobSearch from '../components/user/AdvancedJobSearch';
import ApplicationTracker from '../components/user/ApplicationTracker';
import SavedJobs from '../components/user/SavedJobs';
import NotificationsFeed from '../components/user/NotificationsFeed';
import Messages from '../components/shared/Messages';
import ResumeBuilder from '../components/user/ResumeBuilder';

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'user') {
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
          <h3 style={{ fontSize: '1.125rem' }}>Job Seeker</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{user.name}</p>
        </div>
        
        <button style={menuStyle(activeTab === 'overview')} onClick={() => handleNav('overview')}>
          {t('dashboard')}
        </button>
        <button style={menuStyle(activeTab === 'profile')} onClick={() => handleNav('profile')}>
          {t('myProfile')}
        </button>
        <button style={menuStyle(activeTab === 'resume-builder')} onClick={() => handleNav('resume-builder')}>
          {t('resumeBuilder')}
        </button>
        <button style={menuStyle(activeTab === 'search')} onClick={() => handleNav('search')}>
          {t('jobSearch')}
        </button>
        <button style={menuStyle(activeTab === 'saved')} onClick={() => handleNav('saved')}>
          {t('savedJobs')}
        </button>
        <button style={menuStyle(activeTab === 'tracker')} onClick={() => handleNav('tracker')}>
          {t('applications')}
        </button>
        <button style={menuStyle(activeTab === 'messages')} onClick={() => handleNav('messages')}>
          {t('messages')}
        </button>
        <button style={menuStyle(activeTab === 'notifications')} onClick={() => handleNav('notifications')}>
          {t('notifications')}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeTab === 'overview' && <DashboardOverview onNavigate={setActiveTab} />}
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'resume-builder' && <ResumeBuilder />}
          {activeTab === 'search' && <AdvancedJobSearch />}
          {activeTab === 'saved' && <SavedJobs onNavigate={setActiveTab} />}
          {activeTab === 'tracker' && <ApplicationTracker />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'notifications' && <NotificationsFeed />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
