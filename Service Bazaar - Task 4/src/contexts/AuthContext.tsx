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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers = [
  { id: '1', email: 'user@demo.com', password: 'password', role: 'user' as const },
  { id: '2', email: 'admin@demo.com', password: 'password', role: 'admin' as const },
];

// Mock services data
const mockServices = [
  {
    id: '1',
    name: 'Home Plumbing',
    description: 'Professional plumbing services for your home including repairs, installations, and maintenance.',
    rate: 500,
    currency: 'INR',
    iconUrl: '🔧'
  },
  {
    id: '2',
    name: 'Electrical Services',
    description: 'Complete electrical solutions including wiring, repairs, and installations by certified electricians.',
    rate: 750,
    currency: 'INR',
    iconUrl: '⚡'
  },
  {
    id: '3',
    name: 'House Cleaning',
    description: 'Deep cleaning services for your home with eco-friendly products and professional staff.',
    rate: 800,
    currency: 'INR',
    iconUrl: '🧹'
  },
  {
    id: '4',
    name: 'AC Repair & Service',
    description: 'Air conditioning repair, maintenance, and installation services for all brands.',
    rate: 650,
    currency: 'INR',
    iconUrl: '❄️'
  },
  {
    id: '5',
    name: 'Pest Control',
    description: 'Safe and effective pest control services for homes and offices using eco-friendly methods.',
    rate: 1200,
    currency: 'INR',
    iconUrl: '🐛'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Initialize mock services in localStorage
    if (!localStorage.getItem('services')) {
      localStorage.setItem('services', JSON.stringify(mockServices));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      throw new Error('Invalid credentials');
    }

    const mockToken = `mock-token-${mockUser.id}`;
    const userData = { id: mockUser.id, email: mockUser.email, role: mockUser.role };
    
    setToken(mockToken);
    setUser(userData);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, role = 'user') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      role: role as 'user' | 'admin'
    };

    mockUsers.push(newUser);

    const mockToken = `mock-token-${newUser.id}`;
    const userData = { id: newUser.id, email: newUser.email, role: newUser.role };
    
    setToken(mockToken);
    setUser(userData);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};