import React, { useState, useMemo } from 'react';
import { usePrompts } from '../contexts/PromptContext';
import PromptCard from '../components/PromptCard';
import PromptDetailModal from '../components/PromptDetailModal';
import { Prompt, AIModel, Category } from '../constants';
import { AI_MODELS, CATEGORIES } from '../types';
import { ChevronDown, Search, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import SubmitPromptModal from '../components/SubmitPromptModal';
import { useNavigate } from 'react-router-dom';
import LimitReachedModal from '../components/LimitReachedModal';


const CommunityPage: React.FC = () => {
    const { prompts, addPrompt } = usePrompts();
    const { user, addSubmittedPrompt, getSubmissionsLeft, incrementSubmissionCount } = useAuth();
    const navigate = useNavigate();
    
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [selectedModel, setSelectedModel] = useState<AIModel | 'all'>('all');
    const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');

    const filteredPrompts = useMemo(() => {
        return prompts
            .filter(p => p.isPublic && p.status === 'approved') // Only show approved public prompts
            .filter(p => {
                const searchLower = searchTerm.toLowerCase();
                const searchMatch = 
                    p.title.toLowerCase().includes(searchLower) ||
                    p.description.toLowerCase().includes(searchLower) ||
                    p.author.name.toLowerCase().includes(searchLower) ||
                    p.tags.some(tag => tag.toLowerCase().includes(searchLower));
                
                const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
                const modelMatch = selectedModel === 'all' || p.model === selectedModel;
                return searchMatch && categoryMatch && modelMatch;
            })
            .sort((a, b) => {
                if (sortBy === 'popular') {
                    const scoreA = a.upvotes - a.downvotes;
                    const scoreB = b.upvotes - b.downvotes;
                    return scoreB - scoreA;
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [prompts, searchTerm, selectedCategory, selectedModel, sortBy]);

    const handlePromptClick = (prompt: Prompt) => setSelectedPrompt(prompt);
    const handleCloseDetailModal = () => setSelectedPrompt(null);
    
    const handleOpenSubmitModal = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (getSubmissionsLeft() > 0) {
            setIsSubmitModalOpen(true);
        } else {
            setIsLimitModalOpen(true);
        }
    };

    const handlePromptSubmit = (newPromptData: Omit<Prompt, 'id' | 'author' | 'upvotes' | 'downvotes' | 'comments' | 'createdAt' | 'status'>) => {
        if (!user) return;
        const newPrompt: Prompt = {
            id: `p${Date.now()}`,
            ...newPromptData,
            author: user,
            upvotes: 0,
            downvotes: 0,
            comments: [],
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        addPrompt(newPrompt);
        addSubmittedPrompt(newPrompt.id);
        incrementSubmissionCount();
        // The modal will show a success message and the user will close it.
    };

    return (
        <div className="space-y-8">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Community Prompts</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Discover, share, and vote on the best AI prompts from our growing community.
                </p>
                <div className="mt-6">
                    <Button onClick={handleOpenSubmitModal} icon={<PlusCircle size={18}/>}>
                        Submit Your Prompt
                    </Button>
                </div>
            </section>
            
            <div className="sticky top-16 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by keyword, tag, author..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value as Category | 'all')}
                            className="w-full md:w-auto p-2 border rounded-lg appearance-none bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                         <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                    
                    <div className="relative">
                         <select
                            value={selectedModel}
                            onChange={e => setSelectedModel(e.target.value as AIModel | 'all')}
                            className="w-full md:w-auto p-2 border rounded-lg appearance-none bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">All Models</option>
                            {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>

                     <div className="relative">
                         <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as 'popular' | 'newest')}
                            className="w-full md:w-auto p-2 border rounded-lg appearance-none bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="popular">Popular</option>
                            <option value="newest">Newest</option>
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                </div>
            </div>

            {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.map(prompt => (
                        <PromptCard 
                            key={prompt.id} 
                            prompt={prompt} 
                            onClick={handlePromptClick}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No prompts found. Try adjusting your filters.</p>
                </div>
            )}


            <PromptDetailModal
                isOpen={!!selectedPrompt}
                onClose={handleCloseDetailModal}
                prompt={selectedPrompt}
            />

            <SubmitPromptModal 
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                onSubmit={handlePromptSubmit}
            />

            <LimitReachedModal
                isOpen={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
                isPro={user?.subscriptionTier === 'pro'}
            />
        </div>
    );
};

export default CommunityPage;