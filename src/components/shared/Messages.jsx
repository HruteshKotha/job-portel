import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const Messages = () => {
  const { user } = useAuth();
  const { getConversations, sendMessage, markMessagesAsRead } = useData();
  
  const allMessages = getConversations(user.id);
  
  // Group messages by contact
  const contactsMap = {};
  allMessages.forEach(msg => {
    const contactId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
    const contactName = msg.senderId === user.id ? msg.receiverName : msg.senderName;
    
    if (!contactsMap[contactId]) {
      contactsMap[contactId] = {
        id: contactId,
        name: contactName,
        messages: [],
        unreadCount: 0
      };
    }
    contactsMap[contactId].messages.push(msg);
    if (msg.receiverId === user.id && !msg.read) {
      contactsMap[contactId].unreadCount++;
    }
  });

  const contacts = Object.values(contactsMap).sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1];
    const lastMsgB = b.messages[b.messages.length - 1];
    return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
  });

  const [activeContactId, setActiveContactId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);

  // Set initial active contact if none selected and contacts exist
  useEffect(() => {
    if (!activeContactId && contacts.length > 0) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  // Mark messages as read when contact is selected
  useEffect(() => {
    if (activeContactId) {
      markMessagesAsRead(activeContactId, user.id);
    }
  }, [activeContactId, allMessages.length]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContactId, allMessages]);

  const activeContact = contacts.find(c => c.id === activeContactId);
  
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;
    
    sendMessage(
      user.id, 
      user.name, 
      activeContact.id, 
      activeContact.name, 
      inputText, 
      attachment ? { name: attachment.name, url: '#' } : null
    );
    
    setInputText('');
    setAttachment(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  return (
    <Card style={{ display: 'flex', height: 'calc(100vh - 120px)', padding: 0, overflow: 'hidden' }}>
      
      {/* Left Sidebar: Inbox List */}
      <div style={{ width: '300px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Messages</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contacts.length === 0 ? (
            <p style={{ padding: '1.5rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>No conversations yet.</p>
          ) : (
            contacts.map(contact => {
              const lastMsg = contact.messages[contact.messages.length - 1];
              const isActive = contact.id === activeContactId;
              
              return (
                <div 
                  key={contact.id} 
                  onClick={() => setActiveContactId(contact.id)}
                  style={{ 
                    padding: '1.25rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                    background: isActive ? 'var(--color-surface-hover)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
                    display: 'flex', flexDirection: 'column', gap: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: isActive || contact.unreadCount > 0 ? '600' : '400' }}>{contact.name}</h4>
                    {contact.unreadCount > 0 && (
                      <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '999px', fontWeight: 'bold' }}>
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lastMsg.senderId === user.id ? 'You: ' : ''}
                    {lastMsg.attachment ? '📎 Attachment' : lastMsg.text}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {activeContact.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: '1.125rem' }}>{activeContact.name}</h3>
            </div>
            
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeContact.messages.map((msg, idx) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%', display: 'flex', flexDirection: 'column' }}>
                    
                    <div style={{ 
                      padding: '1rem', borderRadius: '1rem', 
                      background: isMe ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: isMe ? 'white' : 'var(--color-text)',
                      borderBottomRightRadius: isMe ? '0.25rem' : '1rem',
                      borderBottomLeftRadius: isMe ? '1rem' : '0.25rem',
                      border: isMe ? 'none' : '1px solid var(--color-border)'
                    }}>
                      {msg.attachment && (
                        <div style={{ marginBottom: msg.text ? '0.5rem' : '0', padding: '0.75rem', background: isMe ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-hover)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => alert('Mock Download: ' + msg.attachment.name)}>
                          📄 <span style={{ textDecoration: 'underline', fontSize: '0.875rem' }}>{msg.attachment.name}</span>
                        </div>
                      )}
                      {msg.text && <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{msg.text}</p>}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && (
                        <span style={{ color: msg.read ? '#3b82f6' : 'inherit', fontWeight: msg.read ? 'bold' : 'normal' }}>
                          {msg.read ? '✓✓ Read' : '✓ Sent'}
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              {attachment && (
                <div style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface-hover)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                  📎 {attachment.name}
                  <button onClick={() => setAttachment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)' }}>&times;</button>
                </div>
              )}
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                
                <label style={{ cursor: 'pointer', padding: '0.75rem', borderRadius: '50%', background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Attach File">
                  📎
                  <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                </label>
                
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  rows={1}
                  style={{ flex: 1, padding: '1rem', borderRadius: '1.5rem', border: '1px solid var(--color-border)', fontFamily: 'inherit', resize: 'none', background: 'var(--color-surface-hover)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                
                <Button type="submit" variant="primary" style={{ borderRadius: '1.5rem', padding: '1rem 1.5rem' }} disabled={!inputText.trim() && !attachment}>
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Messages;
