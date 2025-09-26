import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Prompt } from '../types';
import { MOCK_PROMPTS } from '../constants';

interface PromptContextType {
  prompts: Prompt[];
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (updatedPrompt: Prompt) => void;
  deletePrompt: (promptId: string) => void;
  voteOnPrompt: (id: string, type: 'up' | 'down') => void;
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

  const voteOnPrompt = (id: string, type: 'up' | 'down') => {
    setPrompts(prevPrompts =>
      prevPrompts.map(p => {
        if (p.id === id) {
          return {
            ...p,
            upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes,
            downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes,
          };
        }
        return p;
      })
    );
  };

  return (
    <PromptContext.Provider value={{ prompts, addPrompt, updatePrompt, deletePrompt, voteOnPrompt }}>
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