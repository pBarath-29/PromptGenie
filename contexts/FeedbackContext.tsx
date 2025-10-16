import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FeedbackItem } from '../types';
import { getData, setData, pushData, updateData } from '../services/firebaseService';

interface FeedbackContextType {
  feedback: FeedbackItem[];
  addFeedback: (newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'status'>) => void;
  updateFeedbackStatus: (feedbackId: string, status: 'pending' | 'reviewed') => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  
  useEffect(() => {
    const loadFeedback = async () => {
        try {
            const feedbackData = await getData<{ [key: string]: FeedbackItem }>('feedback');
            const feedbackArray = feedbackData ? Object.values(feedbackData).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
            setFeedback(feedbackArray);
        } catch (error) {
            console.error("Failed to load feedback:", error);
            setFeedback([]);
        }
    }
    loadFeedback();
  }, []);


  const addFeedback = async (newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'status'>) => {
    const feedbackItem: Omit<FeedbackItem, 'id'> = {
      ...newFeedback,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    try {
        const response = await pushData('feedback', feedbackItem);
        const newId = response.key;
        if (!newId) throw new Error("Failed to get new key from Firebase");
        const finalFeedbackItem = { ...feedbackItem, id: newId };
        await updateData(`feedback/${newId}`, { id: newId });
        setFeedback(prevFeedback => [finalFeedbackItem, ...prevFeedback]);
    } catch (error) {
        console.error("Failed to add feedback to DB:", error);
    }
  };
  
  const updateFeedbackStatus = (feedbackId: string, status: 'pending' | 'reviewed') => {
    setFeedback(prevFeedback =>
      prevFeedback.map(f => (f.id === feedbackId ? { ...f, status } : f))
    );
    updateData(`feedback/${feedbackId}`, { status }).catch(error => console.error("Failed to update feedback status:", error));
  };

  return (
    <FeedbackContext.Provider value={{ feedback, addFeedback, updateFeedbackStatus }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};