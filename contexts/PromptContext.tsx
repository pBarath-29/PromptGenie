import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Prompt, Comment, User } from '../types';
import { MOCK_PROMPTS } from '../constants';

interface PromptContextType {
  prompts: Prompt[];
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (updatedPrompt: Prompt) => void;
  deletePrompt: (promptId: string) => void;
  addRating: (promptId: string, rating: number) => void;
  addComment: (promptId: string, comment: { author: User; text: string }) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);

  const addPrompt = (prompt: Prompt) => {
    setPrompts(prevPrompts => [prompt, ...prevPrompts]);
  };
  
  const updatePrompt = (updatedPrompt: Prompt) => {
    setPrompts(prevPrompts =>
      prevPrompts.map(p => (p.id === updatedPrompt.id ? updatedPrompt : p))
    );
  };

  const deletePrompt = (promptId: string) => {
    setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptId));
  };

  const addRating = (promptId: string, rating: number) => {
    setPrompts(prevPrompts =>
      prevPrompts.map(p => {
        if (p.id === promptId) {
          const totalRating = p.averageRating * p.ratingsCount;
          const newRatingsCount = p.ratingsCount + 1;
          const newAverageRating = (totalRating + rating) / newRatingsCount;
          return {
            ...p,
            ratingsCount: newRatingsCount,
            averageRating: newAverageRating,
          };
        }
        return p;
      })
    );
  };

  const addComment = (promptId: string, comment: { author: User; text: string }) => {
    const newComment: Comment = {
      ...comment,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPrompts(prevPrompts =>
      prevPrompts.map(p =>
        p.id === promptId
          ? { ...p, comments: [newComment, ...p.comments] }
          : p
      )
    );
  };

  return (
    <PromptContext.Provider value={{ prompts, addPrompt, updatePrompt, deletePrompt, addRating, addComment }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = (): PromptContextType => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};