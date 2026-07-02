import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    companyId: 'comp-1',
    companyName: 'TechCorp',
    status: 'open',
    createdAt: new Date().toISOString(),
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    experience: 'Senior (5+ years)',
    workType: 'Full-time',
    category: 'Engineering',
    remoteStatus: 'Hybrid',
    responsibilities: 'Lead the frontend team, architect complex React applications, mentor junior developers.',
    skillsRequired: 'React, TypeScript, CSS, Performance Optimization',
    benefits: 'Health insurance, 401k matching, unlimited PTO',
    companyRating: 4.5
  },
  {
    id: 'job-2',
    title: 'Backend Node.js Engineer',
    companyId: 'comp-2',
    companyName: 'DataSys',
    status: 'open',
    createdAt: new Date().toISOString(),
    location: 'Austin, TX',
    salary: '$100k - $130k',
    experience: 'Mid-level (3-5 years)',
    workType: 'Full-time',
    category: 'Engineering',
    remoteStatus: 'Remote',
    responsibilities: 'Build scalable APIs, manage database migrations, integrate third-party services.',
    skillsRequired: 'Node.js, Express, PostgreSQL, Redis',
    benefits: 'Remote stipend, health/dental, gym membership',
    companyRating: 4.2
  },
  {
    id: 'job-3',
    title: 'Product Designer',
    companyId: 'comp-1',
    companyName: 'TechCorp',
    status: 'open',
    createdAt: new Date().toISOString(),
    location: 'New York, NY',
    salary: '$90k - $120k',
    experience: 'Mid-level (3-5 years)',
    workType: 'Full-time',
    category: 'Design',
    remoteStatus: 'On-site',
    responsibilities: 'Create user-centric designs, wireframes, and high-fidelity prototypes.',
    skillsRequired: 'Figma, UX Research, Prototyping',
    benefits: 'Health insurance, free lunches, 401k',
    companyRating: 4.5
  }
];

export const DataProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState({}); // userId: [jobId, jobId]
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobPortalJobs') || 'null');
    // If no jobs exist in local storage, initialize with mock jobs
    if (!storedJobs || storedJobs.length === 0) {
      setJobs(mockJobs);
      localStorage.setItem('jobPortalJobs', JSON.stringify(mockJobs));
    } else {
      setJobs(storedJobs);
    }

    setApplications(JSON.parse(localStorage.getItem('jobPortalApps') || '[]'));
    setSavedJobs(JSON.parse(localStorage.getItem('jobPortalSavedJobs') || '{}'));
    setNotifications(JSON.parse(localStorage.getItem('jobPortalNotifs') || '[]'));
    setMessages(JSON.parse(localStorage.getItem('jobPortalMessages') || '[]'));
  }, []);

  // Job Functions
  const addJob = (job) => {
    const newJob = { ...job, id: Date.now().toString(), status: 'open', createdAt: new Date().toISOString() };
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('jobPortalJobs', JSON.stringify(updatedJobs));
  };

  const toggleJobStatus = (jobId) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'open' ? 'closed' : 'open' } 
        : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobPortalJobs', JSON.stringify(updatedJobs));
  };

  const updateJob = (jobId, updatedData) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, ...updatedData } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobPortalJobs', JSON.stringify(updatedJobs));
  };

  const deleteJob = (jobId) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    localStorage.setItem('jobPortalJobs', JSON.stringify(updatedJobs));
  };

  // Application Functions
  const applyForJob = (application) => {
    const newApp = { ...application, id: Date.now().toString(), status: 'applied', appliedAt: new Date().toISOString() };
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    localStorage.setItem('jobPortalApps', JSON.stringify(updatedApps));
    
    // Notify company
    createNotification(application.companyId, `New application received for ${application.jobTitle}`);
  };

  const updateApplicationStatus = (appId, newStatus, messageOverride = null) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    
    const updatedApps = applications.map(a => 
      a.id === appId ? { ...a, status: newStatus } : a
    );
    setApplications(updatedApps);
    localStorage.setItem('jobPortalApps', JSON.stringify(updatedApps));
    
    // Notify user
    const msg = messageOverride || `Your application for ${app.jobTitle} was updated to: ${newStatus.replace('_', ' ')}`;
    createNotification(app.userId, msg);
  };

  const getUserApplications = (userId) => applications.filter(app => app.userId === userId);
  const getJobApplications = (jobId) => applications.filter(app => app.jobId === jobId);
  const getCompanyJobs = (companyId) => jobs.filter(job => job.companyId === companyId);

  // Saved Jobs
  const saveJob = (userId, jobId) => {
    const userSaved = savedJobs[userId] || [];
    if (!userSaved.includes(jobId)) {
      const updated = { ...savedJobs, [userId]: [...userSaved, jobId] };
      setSavedJobs(updated);
      localStorage.setItem('jobPortalSavedJobs', JSON.stringify(updated));
    }
  };

  const unsaveJob = (userId, jobId) => {
    const userSaved = savedJobs[userId] || [];
    const updated = { ...savedJobs, [userId]: userSaved.filter(id => id !== jobId) };
    setSavedJobs(updated);
    localStorage.setItem('jobPortalSavedJobs', JSON.stringify(updated));
  };

  const getSavedJobs = (userId) => savedJobs[userId] || [];

  // Notifications
  const createNotification = (userId, message) => {
    const newNotif = {
      id: Date.now().toString(),
      userId,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('jobPortalNotifs', JSON.stringify(updatedNotifs));
  };

  const markNotificationRead = (notifId) => {
    const updatedNotifs = notifications.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem('jobPortalNotifs', JSON.stringify(updatedNotifs));
  };

  const getUserNotifications = (userId) => notifications.filter(n => n.userId === userId);

  // Messaging System
  const sendMessage = (senderId, senderName, receiverId, receiverName, text, attachment = null) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId,
      senderName,
      receiverId,
      receiverName,
      text,
      attachment, // { name: 'file.pdf', url: 'mock_url' }
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('jobPortalMessages', JSON.stringify(updatedMessages));
    
    // Also trigger a notification for the receiver
    createNotification(receiverId, `New message from ${senderName}`);
  };

  const markMessagesAsRead = (senderId, receiverId) => {
    let updated = false;
    const updatedMessages = messages.map(m => {
      // If I am the receiver and the other person is the sender, mark it read
      if (m.receiverId === receiverId && m.senderId === senderId && !m.read) {
        updated = true;
        return { ...m, read: true };
      }
      return m;
    });
    
    if (updated) {
      setMessages(updatedMessages);
      localStorage.setItem('jobPortalMessages', JSON.stringify(updatedMessages));
    }
  };

  const getConversations = (userId) => {
    return messages.filter(m => m.senderId === userId || m.receiverId === userId);
  };

  return (
    <DataContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      toggleJobStatus,
      applyForJob,
      updateApplicationStatus,
      getUserApplications,
      getJobApplications,
      getCompanyJobs,
      savedJobs,
      saveJob,
      unsaveJob,
      getSavedJobs,
      notifications,
      createNotification,
      markNotificationRead,
      getUserNotifications,
      messages,
      sendMessage,
      markMessagesAsRead,
      getConversations
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
