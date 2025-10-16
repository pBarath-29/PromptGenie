import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Collection } from '../types';
import { getData, setData, updateData } from '../services/firebaseService';

interface CollectionContextType {
  collections: Collection[];
  addCollection: (collection: Collection) => void;
  updateCollectionStatus: (collectionId: string, status: 'approved' | 'rejected') => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
        try {
            const collectionsData = await getData<{ [key: string]: Collection }>('collections');
            const collectionsArray = collectionsData ? Object.values(collectionsData) : [];
            setCollections(collectionsArray);
        } catch (error) {
            console.error("Failed to load collections:", error);
            setCollections([]);
        }
    }
    loadCollections();
  }, []);

  const addCollection = (collection: Collection) => {
    setCollections(prevCollections => [collection, ...prevCollections]);
    setData(`collections/${collection.id}`, collection).catch(error => {
        console.error("Failed to add collection to DB:", error);
        setCollections(prevCollections => prevCollections.filter(c => c.id !== collection.id));
    });
  };

  const updateCollectionStatus = (collectionId: string, status: 'approved' | 'rejected') => {
    setCollections(prevCollections =>
      prevCollections.map(c => (c.id === collectionId ? { ...c, status } : c))
    );
    updateData(`collections/${collectionId}`, { status }).catch(error => console.error("Failed to update collection status:", error));
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
