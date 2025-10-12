import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';
import { FREE_TIER_LIMIT } from '../config';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: { bio?: string; avatar?: string }) => void;
  purchaseCollection: (collectionId: string) => void;
  addSubmittedPrompt: (promptId: string) => void;
  removeSubmittedPrompt: (promptId: string) => void;
  toggleSavePrompt: (promptId: string) => void;
  addCreatedCollection: (collectionId: string) => void;
  incrementGenerationCount: () => void;
  upgradeToPro: () => void;
  getGenerationsLeft: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'prompter-user';

const checkAndResetGenerationCount = (currentUser: User | null): User | null => {
    if (!currentUser || currentUser.subscriptionTier === 'pro') return currentUser;
    
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;

    if (currentUser.lastGenerationReset !== currentMonthYear) {
        return {
            ...currentUser,
            promptGenerations: 0,
            lastGenerationReset: currentMonthYear,
        };
    }
    return currentUser;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const loadedUser = storedUser ? JSON.parse(storedUser) : null;
      return checkAndResetGenerationCount(loadedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // This is a mock user store for demonstration. In a real app, this would be your user database.
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate API latency
        const foundUser = users.find(u => u.name.toLowerCase().replace(' ', '') + '@example.com' === email.toLowerCase());
        if (foundUser) {
          setUser(checkAndResetGenerationCount(foundUser));
          resolve();
        } else {
          reject(new Error('Invalid email or password. Try alexdoe@example.com'));
        }
      }, 500);
    });
  };

  const signup = (name: string, email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate API latency
            const existingUser = users.find(u => u.name.toLowerCase().replace(' ', '') + '@example.com' === email.toLowerCase());
            if(existingUser) {
                reject(new Error('An account with this email already exists.'));
                return;
            }

            const newUser: User = {
                id: `u${Date.now()}`,
                name,
                avatar: `https://i.pravatar.cc/150?u=${`u${Date.now()}`}`,
                bio: '',
                badges: ['New Member'],
                submittedPrompts: [],
                purchasedCollections: [],
                savedPrompts: [],
                createdCollections: [],
                subscriptionTier: 'free',
                promptGenerations: 0,
                lastGenerationReset: `${new Date().getFullYear()}-${new Date().getMonth()}`
            };
            setUsers(prev => [...prev, newUser]);
            setUser(newUser);
            resolve();
        }, 500)
    });
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

  const removeSubmittedPrompt = (promptId: string) => {
    if (user) {
      setUser(prevUser => {
        if (!prevUser) return null;
        const newSubmittedPrompts = prevUser.submittedPrompts?.filter(id => id !== promptId);
        return { ...prevUser, submittedPrompts: newSubmittedPrompts };
      });
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

  const addCreatedCollection = (collectionId: string) => {
    if (user) {
      setUser(prevUser => prevUser ? {
        ...prevUser,
        createdCollections: [...(prevUser.createdCollections || []), collectionId],
      } : null);
    }
  };

  const getGenerationsLeft = (): number => {
    if (!user || user.subscriptionTier === 'pro') return Infinity;

    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;
    const generations = user.lastGenerationReset === currentMonthYear ? user.promptGenerations : 0;
    
    return FREE_TIER_LIMIT - generations;
  }

  const incrementGenerationCount = () => {
    if (user && user.subscriptionTier === 'free') {
      const now = new Date();
      const currentMonthYear = `${now.getFullYear()}-${now.getMonth()}`;

      let currentGenerations = user.promptGenerations;
      let lastReset = user.lastGenerationReset;

      if (lastReset !== currentMonthYear) {
        currentGenerations = 0;
        lastReset = currentMonthYear;
      }
      
      setUser({
        ...user,
        promptGenerations: currentGenerations + 1,
        lastGenerationReset: lastReset,
      });
    }
  };

  const upgradeToPro = () => {
    if (user) {
      setUser(prevUser => prevUser ? {
        ...prevUser,
        subscriptionTier: 'pro'
      } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserProfile, purchaseCollection, addSubmittedPrompt, removeSubmittedPrompt, toggleSavePrompt, addCreatedCollection, getGenerationsLeft, incrementGenerationCount, upgradeToPro }}>
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