import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('jobPortalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic checking DataContext stored users
    // For simplicity, we just look up the users list in local storage directly here
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('jobPortalUser', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password, role) => {
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    const exists = users.find(u => u.email === email);
    
    if (exists) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role // 'company' or 'user'
    };

    users.push(newUser);
    localStorage.setItem('jobPortalUsers', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('jobPortalUser', JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobPortalUser');
  };

  const checkEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    return users.some(u => u.email === email);
  };

  const resetPassword = (email, newPassword) => {
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('jobPortalUsers', JSON.stringify(users));
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const socialLogin = (provider) => {
    const mockUser = {
      id: Date.now().toString(),
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      password: 'mockpassword',
      role: 'user' // Default to job seeker for social login
    };
    
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    if (!users.find(u => u.email === mockUser.email)) {
      users.push(mockUser);
      localStorage.setItem('jobPortalUsers', JSON.stringify(users));
    }

    setUser(mockUser);
    localStorage.setItem('jobPortalUser', JSON.stringify(mockUser));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, checkEmailExists, resetPassword, socialLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
