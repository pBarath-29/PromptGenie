import React, { useState } from 'react';
import { usePrompts } from '../contexts/PromptContext';
import { useCollections } from '../contexts/CollectionContext';
import Button from '../components/Button';
import { CheckCircle, XCircle, Eye, Inbox, Package, Clock } from 'lucide-react';
// FIX: Changed import from '../constants' to '../types' as types are now consolidated in types.ts.
import { Prompt, Collection } from '../types';
import PromptDetailModal from '../components/PromptDetailModal';
import CollectionPreviewModal from '../components/CollectionPreviewModal';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 5;

const AdminPage: React.FC = () => {
    const { prompts, updatePromptStatus } = usePrompts();
    const { collections, updateCollectionStatus } = useCollections();
    
    const [activeTab, setActiveTab] = useState<'prompts' | 'collections'>('prompts');
    const [promptToPreview, setPromptToPreview] = useState<Prompt | null>(null);
    const [collectionToPreview, setCollectionToPreview] = useState<Collection | null>(null);

    // Pagination states
    const [promptsPage, setPromptsPage] = useState(1);
    const [collectionsPage, setCollectionsPage] = useState(1);

    const pendingPrompts = prompts.filter(p => p.status === 'pending');
    const pendingCollections = collections.filter(c => c.status === 'pending');
    
    // Pagination logic
    const paginate = (items: any[], page: number) => {
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
        const paginatedItems = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        return { totalPages, paginatedItems };
    };
    
    const { totalPages: promptsTotalPages, paginatedItems: paginatedPrompts } = paginate(pendingPrompts, promptsPage);
    const { totalPages: collectionsTotalPages, paginatedItems: paginatedCollections } = paginate(pendingCollections, collectionsPage);


    const TabButton: React.FC<{
        label: string;
        count: number;
        isActive: boolean;
        onClick: () => void;
        icon: React.ReactNode;
    }> = ({ label, count, isActive, onClick, icon }) => (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
                isActive
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
        >
            {icon}
            <span>{label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                {count}
            </span>
        </button>
    );
    
    return (
      <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Panel</h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                Review and moderate user-submitted content.
            </p>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 flex space-x-2">
          <TabButton 
            label="Pending Prompts" 
            count={pendingPrompts.length} 
            isActive={activeTab === 'prompts'}
            onClick={() => setActiveTab('prompts')}
            icon={<Inbox size={18} />}
          />
          <TabButton 
            label="Pending Collections" 
            count={pendingCollections.length} 
            isActive={activeTab === 'collections'}
            onClick={() => setActiveTab('collections')}
            icon={<Package size={18} />}
          />
        </div>
        
        <div className="transition-opacity duration-300">
            {activeTab === 'prompts' && (
            <div className="space-y-4">
                {paginatedPrompts.map(prompt => (
                <div key={prompt.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                    <div className="mb-4 md:mb-0">
                        <p className="font-bold text-lg">{prompt.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By <span className="font-medium text-gray-700 dark:text-gray-300">{prompt.author.name}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center"><Clock size={12} className="mr-1.5"/> Submitted on {new Date(prompt.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                        <Button variant="secondary" onClick={() => setPromptToPreview(prompt)} icon={<Eye size={16}/>}>Preview</Button>
                        <Button onClick={() => updatePromptStatus(prompt.id, 'approved')} icon={<CheckCircle size={16}/>}>Approve</Button>
                        <Button variant="danger" onClick={() => updatePromptStatus(prompt.id, 'rejected')} icon={<XCircle size={16}/>}>Reject</Button>
                    </div>
                </div>
                ))}
                {pendingPrompts.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No pending prompts to review.</p>
                ) : (
                    <Pagination currentPage={promptsPage} totalPages={promptsTotalPages} onPageChange={setPromptsPage} />
                )}
            </div>
            )}
            
            {activeTab === 'collections' && (
            <div className="space-y-4">
                {paginatedCollections.map(collection => (
                <div key={collection.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                     <div className="mb-4 md:mb-0">
                        <p className="font-bold text-lg">{collection.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            By <span className="font-medium text-gray-700 dark:text-gray-300">{collection.creator.name}</span>
                        </p>
                         <p className="text-xs text-gray-400 mt-1 flex items-center"><Clock size={12} className="mr-1.5"/> Submitted on {new Date(collection.creator.lastSubmissionDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                        <Button variant="secondary" onClick={() => setCollectionToPreview(collection)} icon={<Eye size={16}/>}>Preview</Button>
                        <Button onClick={() => updateCollectionStatus(collection.id, 'approved')} icon={<CheckCircle size={16}/>}>Approve</Button>
                        <Button variant="danger" onClick={() => updateCollectionStatus(collection.id, 'rejected')} icon={<XCircle size={16}/>}>Reject</Button>
                    </div>
                </div>
                ))}
                {pendingCollections.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">No pending collections to review.</p>
                ) : (
                    <Pagination currentPage={collectionsPage} totalPages={collectionsTotalPages} onPageChange={setCollectionsPage} />
                )}
            </div>
            )}
        </div>

        <PromptDetailModal isOpen={!!promptToPreview} onClose={() => setPromptToPreview(null)} prompt={promptToPreview} isAdminPreview={true} />
        <CollectionPreviewModal 
            isOpen={!!collectionToPreview} 
            onClose={() => setCollectionToPreview(null)} 
            collection={collectionToPreview}
            isAdminPreview={true}
        />
      </div>
    );
}

export default AdminPage;