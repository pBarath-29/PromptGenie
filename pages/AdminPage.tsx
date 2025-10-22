import React, { useState } from 'react';
import { usePrompts } from '../contexts/PromptContext';
import { useCollections } from '../contexts/CollectionContext';
import Button from '../components/Button';
import { CheckCircle, XCircle, Eye, Inbox, Package, Clock, MessageSquare, Trash2, Tag } from 'lucide-react';
import { Prompt, Collection, FeedbackItem } from '../types';
import PromptDetailModal from '../components/PromptDetailModal';
import CollectionPreviewModal from '../components/CollectionPreviewModal';
import Pagination from '../components/Pagination';
import { useFeedback } from '../contexts/FeedbackContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { usePromoCodes } from '../contexts/PromoCodeContext';

const ITEMS_PER_PAGE = 5;

const AdminPage: React.FC = () => {
    const { prompts, updatePromptStatus } = usePrompts();
    const { collections, updateCollectionStatus } = useCollections();
    const { feedback, updateFeedbackStatus: updateFeedbackItemStatus, deleteFeedback } = useFeedback();
    const { promoCodes, addPromoCode, deletePromoCode } = usePromoCodes();
    
    const [activeTab, setActiveTab] = useState<'prompts' | 'collections' | 'feedback' | 'promoCodes'>('prompts');
    const [promptToPreview, setPromptToPreview] = useState<Prompt | null>(null);
    const [collectionToPreview, setCollectionToPreview] = useState<Collection | null>(null);
    const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
    const [promoToDelete, setPromoToDelete] = useState<string | null>(null);

    // Form states for new promo code
    const [newCodeName, setNewCodeName] = useState('');
    const [newCodeDiscount, setNewCodeDiscount] = useState<number | ''>('');
    const [newCodeLimit, setNewCodeLimit] = useState<number | ''>('');
    const [promoCodeError, setPromoCodeError] = useState('');


    // Pagination states
    const [promptsPage, setPromptsPage] = useState(1);
    const [collectionsPage, setCollectionsPage] = useState(1);
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [promoCodesPage, setPromoCodesPage] = useState(1);

    const pendingPrompts = prompts.filter(p => p.status === 'pending');
    const pendingCollections = collections.filter(c => c.status === 'pending');
    const pendingFeedback = feedback.filter(f => f.status === 'pending');
    
    // Pagination logic
    const paginate = <T,>(items: T[], page: number): { totalPages: number, paginatedItems: T[] } => {
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
        const paginatedItems = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        return { totalPages, paginatedItems };
    };
    
    const { totalPages: promptsTotalPages, paginatedItems: paginatedPrompts } = paginate(pendingPrompts, promptsPage);
    const { totalPages: collectionsTotalPages, paginatedItems: paginatedCollections } = paginate(pendingCollections, collectionsPage);
    const { totalPages: feedbackTotalPages, paginatedItems: paginatedFeedback } = paginate(pendingFeedback, feedbackPage);
    // FIX: Removed the third argument 'ITEMS_PER_PAGE' as the 'paginate' function only accepts two arguments.
    const { totalPages: promoCodesTotalPages, paginatedItems: paginatedPromoCodes } = paginate(promoCodes, promoCodesPage);

    const handleConfirmDeleteFeedback = () => {
        if (!feedbackToDelete) return;
        deleteFeedback(feedbackToDelete);
        setFeedbackToDelete(null);
    };

    const handleCreatePromoCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setPromoCodeError('');
        if (!newCodeName.trim() || !newCodeDiscount || !newCodeLimit) {
            setPromoCodeError('All fields are required.');
            return;
        }
        if (newCodeDiscount <= 0 || newCodeDiscount > 100) {
            setPromoCodeError('Discount must be between 1 and 100.');
            return;
        }
        if (newCodeLimit <= 0) {
            setPromoCodeError('Usage limit must be greater than 0.');
            return;
        }

        try {
            await addPromoCode({
                id: newCodeName,
                discountPercentage: newCodeDiscount,
                usageLimit: newCodeLimit
            });
            // Reset form
            setNewCodeName('');
            setNewCodeDiscount('');
            setNewCodeLimit('');
        } catch (error) {
            setPromoCodeError('Failed to create promo code. It might already exist.');
            console.error(error);
        }
    };
    
    const handleConfirmDeletePromoCode = () => {
        if (!promoToDelete) return;
        deletePromoCode(promoToDelete);
        setPromoToDelete(null);
    };

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
           <TabButton 
            label="Pending Feedback" 
            count={pendingFeedback.length} 
            isActive={activeTab === 'feedback'}
            onClick={() => setActiveTab('feedback')}
            icon={<MessageSquare size={18} />}
          />
          <TabButton 
            label="Promo Codes" 
            count={promoCodes.length} 
            isActive={activeTab === 'promoCodes'}
            onClick={() => setActiveTab('promoCodes')}
            icon={<Tag size={18} />}
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

            {activeTab === 'feedback' && (
                <div className="space-y-4">
                    {paginatedFeedback.map(item => (
                        <div key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    <img src={item.user.avatar} alt={item.user.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{item.user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">{item.type}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 my-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">{item.message}</p>
                            <div className="flex justify-end space-x-2">
                                <Button onClick={() => updateFeedbackItemStatus(item.id, 'reviewed')} icon={<CheckCircle size={16}/>}>Mark Reviewed</Button>
                                <Button variant="danger" onClick={() => setFeedbackToDelete(item.id)} icon={<Trash2 size={16}/>}>Delete</Button>
                            </div>
                        </div>
                    ))}
                    {pendingFeedback.length === 0 ? (
                        <p className="text-center py-8 text-gray-500 dark:text-gray-400">No pending feedback to review.</p>
                    ) : (
                        <Pagination currentPage={feedbackPage} totalPages={feedbackTotalPages} onPageChange={setFeedbackPage} />
                    )}
                </div>
            )}

            {activeTab === 'promoCodes' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold mb-4">Create New Promo Code</h3>
                        <form onSubmit={handleCreatePromoCode} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 space-y-4">
                            <div>
                                <label htmlFor="codeName" className="block text-sm font-medium mb-1">Code Name</label>
                                <input id="codeName" type="text" value={newCodeName} onChange={e => setNewCodeName(e.target.value.toUpperCase())} placeholder="e.g., SAVE25" className="w-full p-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"/>
                            </div>
                            <div>
                                <label htmlFor="discount" className="block text-sm font-medium mb-1">Discount (%)</label>
                                <input id="discount" type="number" value={newCodeDiscount} onChange={e => setNewCodeDiscount(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder="e.g., 25" className="w-full p-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"/>
                            </div>
                            <div>
                                <label htmlFor="limit" className="block text-sm font-medium mb-1">Usage Limit</label>
                                <input id="limit" type="number" value={newCodeLimit} onChange={e => setNewCodeLimit(e.target.value === '' ? '' : parseInt(e.target.value))} placeholder="e.g., 100" className="w-full p-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"/>
                            </div>
                            {promoCodeError && <p className="text-sm text-red-500">{promoCodeError}</p>}
                            <Button type="submit" className="w-full">Create Code</Button>
                        </form>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold mb-4">Existing Promo Codes</h3>
                        {paginatedPromoCodes.length > 0 ? paginatedPromoCodes.map(code => (
                            <div key={code.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                                <div>
                                    <p className="font-bold text-lg font-mono">{code.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-primary-500">{code.discountPercentage}% OFF</span>
                                        <span className="mx-2">|</span>
                                        <span>Usage: {code.timesUsed} / {code.usageLimit}</span>
                                    </p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <Button variant="danger" onClick={() => setPromoToDelete(code.id)} icon={<Trash2 size={16}/>}>Delete</Button>
                                </div>
                            </div>
                        )) : (
                           <p className="text-center py-8 text-gray-500 dark:text-gray-400">No promo codes have been created.</p>
                        )}
                        {promoCodes.length > 0 && (
                            <Pagination currentPage={promoCodesPage} totalPages={promoCodesTotalPages} onPageChange={setPromoCodesPage} />
                        )}
                    </div>
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
        <ConfirmationModal
            isOpen={!!feedbackToDelete}
            onClose={() => setFeedbackToDelete(null)}
            onConfirm={handleConfirmDeleteFeedback}
            title="Delete Feedback"
            message="Are you sure you want to permanently delete this feedback? This action cannot be undone."
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
        />
        <ConfirmationModal
            isOpen={!!promoToDelete}
            onClose={() => setPromoToDelete(null)}
            onConfirm={handleConfirmDeletePromoCode}
            title="Delete Promo Code"
            message={`Are you sure you want to delete the promo code "${promoToDelete}"? This action cannot be undone.`}
            confirmButtonText="Delete"
            confirmButtonVariant="danger"
        />
      </div>
    );
}

export default AdminPage;
