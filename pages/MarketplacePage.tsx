import React from 'react';
import { MOCK_COLLECTIONS } from '../constants';
import { Collection } from '../types';
import { ShoppingCart, Zap } from 'lucide-react';
import Button from '../components/Button';

const CollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
      <img src={collection.coverImage} alt={collection.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{collection.description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300 mb-4">
            <Zap size={16} className="mr-2 text-primary-500"/>
            <span>{collection.promptCount} prompts</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary-500">${collection.price}</span>
          <Button icon={<ShoppingCart size={16} />}>Purchase</Button>
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
