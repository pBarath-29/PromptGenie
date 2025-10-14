import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeedbackItem } from '../constants';
import { MOCK_FEEDBACK } from '../types';

interface FeedbackContextType {
  feedback: FeedbackItem[];
  addFeedback: (newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'status'>) => void;
  updateFeedbackStatus: (feedbackId: string, status: 'pending' | 'reviewed') => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>(MOCK_FEEDBACK);

  const addFeedback = (newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'status'>) => {
    const feedbackItem: FeedbackItem = {
      ...newFeedback,
      id: `f${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setFeedback(prevFeedback => [feedbackItem, ...prevFeedback]);
  };
  
  const updateFeedbackStatus = (feedbackId: string, status: 'pending' | 'reviewed') => {
    setFeedback(prevFeedback =>
      prevFeedback.map(f => (f.id === feedbackId ? { ...f, status } : f))
    );
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
