import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { HistoryItem } from '../types';

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (promptData: { title: string; prompt: string; tags: string[] }) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'promptgenie-history';

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (promptData: { title: string; prompt: string; tags: string[] }) => {
    const newItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      ...promptData,
      createdAt: new Date().toISOString(),
    };
    setHistory(prevHistory => [newItem, ...prevHistory]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};