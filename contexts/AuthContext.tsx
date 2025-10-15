import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../constants';
import { MOCK_USERS } from '../types';
import { FREE_TIER_LIMIT, FREE_TIER_POST_LIMIT, PRO_TIER_POST_LIMIT } from '../config';

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
  handleVote: (promptId: string, voteType: 'up' | 'down') => void;
  addCreatedCollection: (collectionId: string) => void;
  incrementGenerationCount: () => void;
  upgradeToPro: () => void;
  getGenerationsLeft: () => number;
  getSubmissionsLeft: () => number;
  incrementSubmissionCount: () => void;
  completeTutorial: () => void;
  cancelSubscription: () => void;
  getUserById: (userId: string) => User | undefined;
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

const checkAndResetSubmissionCount = (currentUser: User | null): User | null => {
    if (!currentUser) return currentUser;

    const today = new Date().toISOString().split('T')[0];

    if (currentUser.lastSubmissionDate !== today) {
        return {
            ...currentUser,
            promptsSubmittedToday: 0,
            lastSubmissionDate: today,
        };
    }
    return currentUser;
};

// Helper to ensure user object is consistent, especially for users from older localStorage versions.
const normalizeUser = (userToNormalize: User | any): User | null => {
    if (!userToNormalize) return null;

    let normalizedUser = { ...userToNormalize };
    
    // Default hasCompletedTutorial to true for existing users.
    // This prevents the tutorial from showing to users who signed up before the feature existed.
    if (typeof normalizedUser.hasCompletedTutorial === 'undefined') {
        normalizedUser.hasCompletedTutorial = true;
    }

    if (typeof normalizedUser.votes === 'undefined') {
      normalizedUser.votes = {};
    }

    // Pass through existing normalization/reset functions
    const userWithGenReset = checkAndResetGenerationCount(normalizedUser);
    const userWithSubReset = checkAndResetSubmissionCount(userWithGenReset);
    
    return userWithSubReset;
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const loadedUser = storedUser ? JSON.parse(storedUser) : null;
      // Normalize user on initial load to handle schema changes.
      return normalizeUser(loadedUser);
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
        let foundUser: User | undefined;
        if (email.toLowerCase() === 'admin@example.com') {
            foundUser = users.find(u => u.role === 'admin');
        } else {
            foundUser = users.find(u => u.name.toLowerCase().replace(' ', '') + '@example.com' === email.toLowerCase());
        }

        if (foundUser) {
          // Normalize user on login to ensure all flags and counters are correctly set.
          setUser(normalizeUser(foundUser));
          resolve();
        } else {
          reject(new Error('Invalid email or password. Try alexdoe@example.com or admin@example.com'));
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
                avatar: `https://www.gravatar.com/avatar/?d=mp`,
                bio: "Hey there! I'm using Prompter.",
                submittedPrompts: [],
                purchasedCollections: [],
                savedPrompts: [],
                createdCollections: [],
                subscriptionTier: 'free',
                role: 'user',
                promptGenerations: 0,
                lastGenerationReset: `${new Date().getFullYear()}-${new Date().getMonth()}`,
                promptsSubmittedToday: 0,
                lastSubmissionDate: new Date().toISOString().split('T')[0],
                hasCompletedTutorial: false, // New users start with the tutorial incomplete.
                votes: {},
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

  const handleVote = (promptId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    setUser(prevUser => {
      if (!prevUser) return null;

      const currentVotes = { ...(prevUser.votes || {}) };
      const currentVote = currentVotes[promptId];
      
      if (currentVote === voteType) {
        // User is clicking the same vote button again, so remove the vote
        delete currentVotes[promptId];
      } else {
        // New vote or changing vote
        currentVotes[promptId] = voteType;
      }
      
      return { ...prevUser, votes: currentVotes };
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

  const cancelSubscription = () => {
    if (user && user.subscriptionTier === 'pro') {
        setUser(prevUser => prevUser ? {
            ...prevUser,
            subscriptionTier: 'free'
        } : null);
    }
  };

  const getSubmissionsLeft = (): number => {
    if (!user) return 0;
    const limit = user.subscriptionTier === 'pro' ? PRO_TIER_POST_LIMIT : FREE_TIER_POST_LIMIT;
    
    // The submission count should have been reset on login/load, so we can use it directly
    const submissions = user.promptsSubmittedToday;
    
    return limit - submissions;
  }

  const incrementSubmissionCount = () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const currentSubmissions = user.lastSubmissionDate === today ? user.promptsSubmittedToday : 0;

      setUser({
        ...user,
        promptsSubmittedToday: currentSubmissions + 1,
        lastSubmissionDate: today,
      });
    }
  };

  const completeTutorial = () => {
      if (user) {
          setUser(prevUser => prevUser ? {
              ...prevUser,
              hasCompletedTutorial: true,
          } : null);
      }
  };
  
  const getUserById = (userId: string): User | undefined => {
      // In a real app, this might be an API call. Here we search all known users.
      return users.find(u => u.id === userId);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserProfile, purchaseCollection, addSubmittedPrompt, removeSubmittedPrompt, toggleSavePrompt, handleVote, addCreatedCollection, getGenerationsLeft, incrementGenerationCount, upgradeToPro, getSubmissionsLeft, incrementSubmissionCount, completeTutorial, cancelSubscription, getUserById }}>
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