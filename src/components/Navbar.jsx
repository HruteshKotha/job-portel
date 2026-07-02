import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { Button } from './ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useI18n();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'var(--color-surface)',
    opacity: 0.95,
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const desktopLinksStyle = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  };

  const Controls = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <select 
        value={lang} 
        onChange={(e) => changeLanguage(e.target.value)}
        style={{ padding: '0.25rem', borderRadius: '0.25rem', background: 'var(--color-surface-hover)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="fr">FR</option>
      </select>
      <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--color-text)' }}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>
        <div style={{
          width: '32px', height: '32px', 
          background: 'var(--gradient-primary)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '1rem'
        }}>JP</div>
        JobPortal
      </Link>
      
      {/* Desktop Menu */}
      <div style={desktopLinksStyle} className="desktop-only">
        <Controls />
        {user ? (
          <>
            <Link to={user.role === 'employer' ? '/company' : '/user'} style={{ fontWeight: '500', color: 'var(--color-text)' }}>
              {t('dashboard')}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Hi, {user.name}
              </span>
              <Button variant="ghost" onClick={handleLogout} style={{ padding: '0.5rem' }}>
                {t('logout')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontWeight: '500', color: 'var(--color-text)' }}>{t('login')}</Link>
            <Link to="/signup">
              <Button variant="primary">{t('signup')}</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        ☰
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', padding: '1rem 2rem', gap: '1rem',
          boxShadow: 'var(--shadow-md)', zIndex: 999
        }} className="animate-slide-up">
          <Controls />
          {user ? (
            <>
              <Link to={user.role === 'employer' ? '/company' : '/user'} onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '500', color: 'var(--color-text)' }}>
                {t('dashboard')}
              </Link>
              <Button variant="ghost" onClick={handleLogout} style={{ padding: '0.5rem', textAlign: 'left' }}>
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '500', color: 'var(--color-text)' }}>{t('login')}</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" style={{ width: '100%' }}>{t('signup')}</Button>
              </Link>
            </>
          )}
        </div>
      )}
      
      {/* Quick style for hiding desktop items on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
