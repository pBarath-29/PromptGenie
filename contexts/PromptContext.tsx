import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Prompt, Comment, User } from '../types';
import { MOCK_PROMPTS } from '../types';

interface PromptContextType {
  prompts: Prompt[];
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (updatedPrompt: Prompt) => void;
  deletePrompt: (promptId: string) => void;
  handlePromptVote: (promptId: string, voteType: 'up' | 'down', previousVote?: 'up' | 'down' | null) => void;
  addComment: (promptId: string, comment: { author: User; text: string }) => void;
  updatePromptStatus: (promptId: string, status: 'approved' | 'rejected') => void;
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

  const handlePromptVote = (promptId: string, voteType: 'up' | 'down', previousVote?: 'up' | 'down' | null) => {
    setPrompts(prevPrompts =>
      prevPrompts.map(p => {
        if (p.id === promptId) {
          let newUpvotes = p.upvotes;
          let newDownvotes = p.downvotes;

          // Revert previous vote if it exists
          if (previousVote === 'up') newUpvotes--;
          if (previousVote === 'down') newDownvotes--;
          
          // Apply new vote, or toggle off
          if (previousVote !== voteType) {
            if (voteType === 'up') newUpvotes++;
            if (voteType === 'down') newDownvotes++;
          }
          
          return {
            ...p,
            upvotes: Math.max(0, newUpvotes),
            downvotes: Math.max(0, newDownvotes),
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

  const updatePromptStatus = (promptId: string, status: 'approved' | 'rejected') => {
    setPrompts(prevPrompts =>
      prevPrompts.map(p => (p.id === promptId ? { ...p, status } : p))
    );
  };

  return (
    <PromptContext.Provider value={{ prompts, addPrompt, updatePrompt, deletePrompt, handlePromptVote, addComment, updatePromptStatus }}>
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
