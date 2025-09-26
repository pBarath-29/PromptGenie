import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  updateUserProfile: (data: { bio?: string; avatar?: string }) => void;
  purchaseCollection: (collectionId: string) => void;
  addSubmittedPrompt: (promptId: string) => void;
  toggleSavePrompt: (promptId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'promptgenie-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = () => {
    // In a real app, this would involve an API call
    setUser(MOCK_USERS[0]);
  };

  const logout = () => {
    setUser(null);
  };
  
  const updateUserProfile = (data: { bio?: string; avatar?: string }) => {
    if (user) {
      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
    }
  };

  const purchaseCollection = (collectionId: string) => {
    if (user && !user.purchasedCollections?.includes(collectionId)) {
      setUser(prevUser => prevUser ? {
        ...prevUser,
        purchasedCollections: [...(prevUser.purchasedCollections || []), collectionId],
      } : null);
    }
  };
  
  const addSubmittedPrompt = (promptId: string) => {
      if (user) {
          setUser(prevUser => prevUser ? {
              ...prevUser,
              submittedPrompts: [...(prevUser.submittedPrompts || []), promptId],
          } : null);
      }
  };

  const toggleSavePrompt = (promptId: string) => {
    if (!user) return;
    
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const savedPrompts = prevUser.savedPrompts || [];
      const isSaved = savedPrompts.includes(promptId);
      
      let newSavedPrompts: string[];
      if (isSaved) {
        newSavedPrompts = savedPrompts.filter(id => id !== promptId);
      } else {
        newSavedPrompts = [...savedPrompts, promptId];
      }
      
      return { ...prevUser, savedPrompts: newSavedPrompts };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile, purchaseCollection, addSubmittedPrompt, toggleSavePrompt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};