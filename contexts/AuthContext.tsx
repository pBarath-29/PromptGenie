
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User as AppUser } from '../types';
import { FREE_TIER_LIMIT, FREE_TIER_POST_LIMIT, PRO_TIER_POST_LIMIT } from '../config';
import { getData, setData, updateData } from '../services/firebaseService';
import { auth } from '../services/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
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
  getUserById: (userId: string) => Promise<AppUser | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkAndResetGenerationCount = (currentUser: AppUser | null): AppUser | null => {
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

const checkAndResetSubmissionCount = (currentUser: AppUser | null): AppUser | null => {
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
const normalizeUser = (userToNormalize: AppUser | any): AppUser | null => {
    if (!userToNormalize) return null;

    let normalizedUser = { ...userToNormalize };
    
    if (typeof normalizedUser.hasCompletedTutorial === 'undefined') {
        normalizedUser.hasCompletedTutorial = true;
    }

    if (typeof normalizedUser.votes === 'undefined') {
      normalizedUser.votes = {};
    }

    const userWithGenReset = checkAndResetGenerationCount(normalizedUser);
    const userWithSubReset = checkAndResetSubmissionCount(userWithGenReset);
    
    return userWithSubReset;
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in. Fetch our custom user profile.
        const userProfile = await getData<AppUser>(`users/${firebaseUser.uid}`);
        if (userProfile) {
          setUser(normalizeUser(userProfile));
        } else {
            // This case might happen if DB entry creation failed after signup.
            // Or if user was deleted from DB but not from auth.
            console.warn(`No user profile found in DB for UID: ${firebaseUser.uid}. Logging out.`);
            await signOut(auth);
            setUser(null);
        }
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<void> => {
      if (!password) throw new Error("Password is required for login.");
      await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name: string, email: string, password?: string): Promise<void> => {
      if (!password) throw new Error("Password is required for signup.");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const isAdminByEmail = email.toLowerCase() === 'pbarath29@gmail.com';

      const newUser: AppUser = {
          id: firebaseUser.uid,
          name,
          email,
          avatar: `https://www.gravatar.com/avatar/?d=mp`,
          bio: "Hey there! I'm using Prompter.",
          submittedPrompts: [],
          purchasedCollections: [],
          savedPrompts: [],
          createdCollections: [],
          subscriptionTier: isAdminByEmail ? 'pro' : 'free',
          role: isAdminByEmail ? 'admin' : 'user',
          promptGenerations: isAdminByEmail ? 999 : 0,
          lastGenerationReset: `${new Date().getFullYear()}-${new Date().getMonth()}`,
          promptsSubmittedToday: 0,
          lastSubmissionDate: new Date().toISOString().split('T')[0],
          hasCompletedTutorial: false,
          votes: {},
      };
      
      await setData(`users/${firebaseUser.uid}`, newUser);
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const updateUserProfile = (data: { bio?: string; avatar?: string }) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      updateData(`users/${user.id}`, data).catch(err => console.error("Failed to sync profile update", err));
    }
  };

  const purchaseCollection = (collectionId: string) => {
    if (user && !user.purchasedCollections?.includes(collectionId)) {
      const updatedCollections = [...(user.purchasedCollections || []), collectionId];
      setUser({ ...user, purchasedCollections: updatedCollections });
      updateData(`users/${user.id}`, { purchasedCollections: updatedCollections }).catch(err => console.error("Failed to sync purchase", err));
    }
  };
  
  const addSubmittedPrompt = (promptId: string) => {
      if (user) {
          const updatedPrompts = [...(user.submittedPrompts || []), promptId];
          setUser({ ...user, submittedPrompts: updatedPrompts });
          updateData(`users/${user.id}`, { submittedPrompts: updatedPrompts }).catch(err => console.error("Failed to sync submitted prompt", err));
      }
  };

  const removeSubmittedPrompt = (promptId: string) => {
    if (user) {
      const updatedPrompts = user.submittedPrompts?.filter(id => id !== promptId);
      setUser({ ...user, submittedPrompts: updatedPrompts });
      updateData(`users/${user.id}`, { submittedPrompts: updatedPrompts }).catch(err => console.error("Failed to sync prompt removal", err));
    }
  };

  const toggleSavePrompt = (promptId: string) => {
    if (!user) return;
    
    const savedPrompts = user.savedPrompts || [];
    const isSaved = savedPrompts.includes(promptId);
    const newSavedPrompts = isSaved ? savedPrompts.filter(id => id !== promptId) : [...savedPrompts, promptId];
    
    setUser({ ...user, savedPrompts: newSavedPrompts });
    updateData(`users/${user.id}`, { savedPrompts: newSavedPrompts }).catch(err => console.error("Failed to sync saved prompt", err));
  };

  const handleVote = (promptId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    
    const currentVotes = { ...(user.votes || {}) };
    const currentVote = currentVotes[promptId];
    if (currentVote === voteType) delete currentVotes[promptId];
    else currentVotes[promptId] = voteType;
    
    setUser({ ...user, votes: currentVotes });
    updateData(`users/${user.id}`, { votes: currentVotes }).catch(err => console.error("Failed to sync vote", err));
  };

  const addCreatedCollection = (collectionId: string) => {
    if (user) {
      const updatedCollections = [...(user.createdCollections || []), collectionId];
      setUser({ ...user, createdCollections: updatedCollections });
      updateData(`users/${user.id}`, { createdCollections: updatedCollections }).catch(err => console.error("Failed to sync created collection", err));
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
      let currentGenerations = user.lastGenerationReset === currentMonthYear ? user.promptGenerations : 0;
      const updatedUser = { ...user, promptGenerations: currentGenerations + 1, lastGenerationReset: currentMonthYear };
      setUser(updatedUser);
      updateData(`users/${user.id}`, { promptGenerations: updatedUser.promptGenerations, lastGenerationReset: updatedUser.lastGenerationReset });
    }
  };

  const upgradeToPro = () => {
    if (user) {
      setUser({ ...user, subscriptionTier: 'pro' });
      updateData(`users/${user.id}`, { subscriptionTier: 'pro' });
    }
  };

  const cancelSubscription = () => {
    if (user && user.subscriptionTier === 'pro') {
        setUser({ ...user, subscriptionTier: 'free' });
        updateData(`users/${user.id}`, { subscriptionTier: 'free' });
    }
  };

  const getSubmissionsLeft = (): number => {
    if (!user) return 0;
    const limit = user.subscriptionTier === 'pro' ? PRO_TIER_POST_LIMIT : FREE_TIER_POST_LIMIT;
    const today = new Date().toISOString().split('T')[0];
    const submissions = user.lastSubmissionDate === today ? user.promptsSubmittedToday : 0;
    return limit - submissions;
  }

  const incrementSubmissionCount = () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const currentSubmissions = user.lastSubmissionDate === today ? user.promptsSubmittedToday : 0;
      const updatedUser = { ...user, promptsSubmittedToday: currentSubmissions + 1, lastSubmissionDate: today };
      setUser(updatedUser);
      updateData(`users/${user.id}`, { promptsSubmittedToday: updatedUser.promptsSubmittedToday, lastSubmissionDate: updatedUser.lastSubmissionDate });
    }
  };

  const completeTutorial = () => {
      if (user) {
          setUser({ ...user, hasCompletedTutorial: true });
          updateData(`users/${user.id}`, { hasCompletedTutorial: true });
      }
  };
  
  const getUserById = useCallback(async (userId: string): Promise<AppUser | undefined> => {
      const user = await getData<AppUser>(`users/${userId}`);
      return user || undefined;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUserProfile, purchaseCollection, addSubmittedPrompt, removeSubmittedPrompt, toggleSavePrompt, handleVote, addCreatedCollection, getGenerationsLeft, incrementGenerationCount, upgradeToPro, getSubmissionsLeft, incrementSubmissionCount, completeTutorial, cancelSubscription, getUserById }}>
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