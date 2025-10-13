import React, { useState, useMemo } from 'react';
import CollectionCard from '../components/CollectionCard';
import { ChevronDown, Search, PackagePlus } from 'lucide-react';
import { useCollections } from '../contexts/CollectionContext';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../contexts/PromptContext';
import SubmitCollectionModal from '../components/SubmitCollectionModal';
import { Collection, Prompt } from '../constants';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import CollectionPreviewModal from '../components/CollectionPreviewModal';

type NewPromptData = Omit<Prompt, 'id' | 'author' | 'averageRating' | 'ratingsCount' | 'comments' | 'createdAt' | 'isPublic' | 'status'>;
type NewCollectionData = Omit<Collection, 'id' | 'creator' | 'promptCount' | 'promptIds' | 'status'>;

const MarketplacePage: React.FC = () => {
    const { collections, addCollection } = useCollections();
    const { addPrompt } = usePrompts();
    const { user, addCreatedCollection, addSubmittedPrompt } = useAuth();
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'prompts-desc' | 'price-asc' | 'price-desc'>('prompts-desc');
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [collectionToPreview, setCollectionToPreview] = useState<Collection | null>(null);

    const filteredCollections = useMemo(() => {
        return collections
            .filter(c => c.status === 'approved') // Only show approved collections
            .filter(c => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    c.name.toLowerCase().includes(searchLower) ||
                    c.description.toLowerCase().includes(searchLower) ||
                    c.creator.name.toLowerCase().includes(searchLower)
                );
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'prompts-desc':
                    default:
                        return b.promptCount - a.promptCount;
                }
            });
    }, [collections, searchTerm, sortBy]);

    const handleOpenSubmitModal = () => {
        if (!user) {
            navigate('/login');
        } else {
            setIsSubmitModalOpen(true);
        }
    };

    const handleCollectionSubmit = (collectionData: NewCollectionData, newPromptsData: NewPromptData[]) => {
        if (!user) return;
        
        const newPromptIds: string[] = [];
        newPromptsData.forEach((promptData, index) => {
            const newPrompt: Prompt = {
                ...promptData,
                id: `p${Date.now()}-${index}`,
                author: user,
                averageRating: 0,
                ratingsCount: 0,
                comments: [],
                createdAt: new Date().toISOString(),
                isPublic: false, // Mark as exclusive to the collection
                status: 'approved', // Prompts inside a collection are implicitly approved if the collection is.
            };
            addPrompt(newPrompt);
            addSubmittedPrompt(newPrompt.id);
            newPromptIds.push(newPrompt.id);
        });
        
        const newCollection: Collection = {
            ...collectionData,
            id: `c${Date.now()}`,
            creator: user,
            promptIds: newPromptIds,
            promptCount: newPromptIds.length,
            status: 'pending',
        };

        addCollection(newCollection);
        addCreatedCollection(newCollection.id);
        // The modal will show a success message
    };

    const handlePreviewClick = (collection: Collection) => {
        setCollectionToPreview(collection);
    };
    
    const handleClosePreview = () => {
        setCollectionToPreview(null);
    };


    return (
        <div className="space-y-8">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Prompt Marketplace</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Browse and purchase curated collections of high-quality prompts from expert creators.
                </p>
                <div className="mt-6">
                    <Button onClick={handleOpenSubmitModal} icon={<PackagePlus size={18}/>}>
                        Submit a Collection
                    </Button>
                </div>
            </section>
            
            <div className="sticky top-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search collections by name, creator..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    
                    <div className="relative">
                         <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as 'prompts-desc' | 'price-asc' | 'price-desc')}
                            className="w-full md:w-auto p-2 border rounded-lg appearance-none bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="prompts-desc">Most Prompts</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                </div>
            </div>

            {filteredCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredCollections.map(collection => (
                        <CollectionCard 
                          key={collection.id} 
                          collection={collection} 
                          onPreview={handlePreviewClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No collections found. Try adjusting your search.</p>
                </div>
            )}

            <CollectionPreviewModal
                isOpen={!!collectionToPreview}
                onClose={handleClosePreview}
                collection={collectionToPreview}
            />

            <SubmitCollectionModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onSubmit={handleCollectionSubmit}
            />
        </div>
    );
};

export default MarketplacePage;