import React from 'react';
import { MOCK_COLLECTIONS } from '../constants';
import { Collection } from '../types';
import { ShoppingCart, Zap } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const CollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  const { user, purchaseCollection } = useAuth();
  const isOwned = user?.purchasedCollections?.includes(collection.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group flex flex-col">
      <img src={collection.coverImage} alt={collection.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{collection.description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-4">
            <Zap size={16} className="mr-2 text-primary-500"/>
            <span>{collection.promptCount} prompts</span>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-primary-500">${collection.price}</span>
          <Button 
            icon={isOwned ? undefined : <ShoppingCart size={16} />}
            onClick={() => purchaseCollection(collection.id)}
            disabled={isOwned}
          >
            {isOwned ? 'Owned' : 'Purchase'}
          </Button>
        </div>
      </div>
    </div>
  );
};


const MarketplacePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Prompt Marketplace</h1>
        <p className="text-gray-500 dark:text-gray-400">Purchase premium, curated prompt collections from top creators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_COLLECTIONS.map(collection => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;