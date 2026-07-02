import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CompanyDashboard from './pages/CompanyDashboard';
import UserDashboard from './pages/UserDashboard';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/p/:userId" element={<PublicProfile />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/company" element={<CompanyDashboard />} />
                    <Route path="/user" element={<UserDashboard />} />
                  </Routes>
                </main>
                <footer className="no-print" style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  borderTop: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem'
                }}>
                  &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
                </footer>
              </div>
            </Router>
          </DataProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
