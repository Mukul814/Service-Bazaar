import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth only works inside AuthContext');
  }
  return context;
};

// demo data
const demoUsers = [
  { id: '1', email: 'user@demo.com', password: 'password', role: 'user' },
  { id: '2', email: 'admin@demo.com', password: 'password', role: 'admin' }
];

const demoServices = [
  { id: '1', name: 'Home Plumbing', rate: 500, currency: 'INR', iconUrl: '🔧' },
  { id: '2', name: 'Electrical Services', rate: 750, currency: 'INR', iconUrl: '⚡' }
];

export const MyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // maybe use later

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    if (!localStorage.getItem('services')) {
      localStorage.setItem('services', JSON.stringify(demoServices));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(res => setTimeout(res, 400));
    console.log("Logging in as:", email);

    const matchedUser = demoUsers.find(u => u.email === email && u.password === password);
    if (!matchedUser) throw new Error('Wrong email or pass');

    const token = `fake-token-${matchedUser.id}`;
    const userData = { id: matchedUser.id, email, role: matchedUser.role };

    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, role = 'user') => {
    await new Promise(res => setTimeout(res, 400));
    if (demoUsers.find(u => u.email === email)) throw new Error('Already exists');

    const newUser = { id: Date.now().toString(), email, password, role };
    demoUsers.push(newUser);

    const token = `fake-token-${newUser.id}`;
    const userData = { id: newUser.id, email, role: newUser.role };

    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log("Logging out");
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
