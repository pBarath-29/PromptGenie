import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Collection } from '../types';
import { MOCK_COLLECTIONS } from '../constants';

interface CollectionContextType {
  collections: Collection[];
  addCollection: (collection: Collection) => void;
  updateCollectionStatus: (collectionId: string, status: 'approved' | 'rejected') => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);

  const addCollection = (collection: Collection) => {
    setCollections(prevCollections => [collection, ...prevCollections]);
  };

  const updateCollectionStatus = (collectionId: string, status: 'approved' | 'rejected') => {
    setCollections(prevCollections =>
      prevCollections.map(c => (c.id === collectionId ? { ...c, status } : c))
    );
  };

  return (
    <CollectionContext.Provider value={{ collections, addCollection, updateCollectionStatus }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollections = (): CollectionContextType => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionProvider');
  }
  return context;
};