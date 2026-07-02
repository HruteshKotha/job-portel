import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const NotificationsFeed = () => {
  const { getUserNotifications, markNotificationRead } = useData();
  const { user } = useAuth();
  
  const notifications = getUserNotifications(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (notifications.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>No Notifications</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>You're all caught up! Check back later for updates on your applications.</p>
      </Card>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Notifications</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map(notif => (
          <Card 
            key={notif.id} 
            style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderLeft: notif.read ? '4px solid transparent' : '4px solid var(--color-primary)',
              background: notif.read ? 'var(--color-surface)' : 'var(--color-surface-hover)'
            }}
          >
            <div>
              <p style={{ fontWeight: notif.read ? '400' : '500', marginBottom: '0.25rem' }}>{notif.message}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
            {!notif.read && (
              <Button variant="ghost" onClick={() => markNotificationRead(notif.id)} style={{ fontSize: '0.875rem' }}>
                Mark as Read
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationsFeed;
