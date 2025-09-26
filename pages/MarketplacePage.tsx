import React from 'react';
import { MOCK_COLLECTIONS } from '../constants';
import CollectionCard from '../components/CollectionCard';

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