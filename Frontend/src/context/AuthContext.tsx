import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth'); 
    console.log('Stored user data:', storedUser); 
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem('user'); 
      }
    }
  }, []);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(user)); 
    console.log('User logged in:', userData); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth'); 
    console.log('User logged out'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
