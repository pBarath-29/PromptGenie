import React, { useState } from 'react';
import { Zap, Mic, Copy, Loader, ChevronDown } from 'lucide-react';
import { TONES, CATEGORIES } from '../constants';
import { Tone, Category } from '../types';
import Button from '../components/Button';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { generateOptimizedPrompt } from '../services/geminiService';
import { useHistory } from '../contexts/HistoryContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UpgradeModal from '../components/UpgradeModal';
import { FREE_TIER_LIMIT } from '../config';
import AdModal from '../components/AdModal';

const HomePage: React.FC = () => {
    const [request, setRequest] = useState('');
    const [tone, setTone] = useState<Tone>('Professional');
    const [category, setCategory] = useState<Category>('Coding');
    const [generatedPrompt, setGeneratedPrompt] = useState<{ title: string; prompt: string; tags: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToHistory } = useHistory();
    const { user, getGenerationsLeft, incrementGenerationCount, upgradeToPro } = useAuth();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);

    const generationsLeft = user ? getGenerationsLeft() : 0;
    const canGenerate = generationsLeft > 0;

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
    } = useSpeechRecognition({ onResult: setRequest });

    const proceedWithGeneration = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt(null);
        try {
            const result = await generateOptimizedPrompt(request, tone, category);
            setGeneratedPrompt(result);
            addToHistory(result);
            incrementGenerationCount();
        } catch (err) {
            setError((err as Error).message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!user) {
            setError("Please log in to generate prompts.");
            return;
        }
        if (!canGenerate) {
            setIsUpgradeModalOpen(true);
            return;
        }
        if (!request.trim()) {
            setError('Please describe what kind of prompt you want.');
            return;
        }
        
        if (user.subscriptionTier === 'free') {
            setIsAdModalOpen(true);
        } else {
            proceedWithGeneration();
        }
    };
    
    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt.prompt);
        }
    };
    
    const handleUpgrade = () => {
        upgradeToPro();
        setIsUpgradeModalOpen(false);
    }

    const handleAdClose = () => {
        setIsAdModalOpen(false);
        proceedWithGeneration();
    };

    return (
        <div className="space-y-12">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Generate Smarter Prompts <span className="text-primary-500">Instantly</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Describe your goal, choose your desired tone, and let our AI craft the perfect, optimized prompt for you.
                </p>
            </section>

            <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl space-y-6">
                <div className={`${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <label htmlFor="request" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Describe your goal</label>
                    <div className="relative">
                        <textarea
                            id="request"
                            rows={4}
                            className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            placeholder="e.g., 'A marketing campaign slogan for a new coffee brand'"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                            disabled={!user}
                        />
                        <button 
                            onClick={isListening ? stopListening : startListening}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            title={isListening ? 'Stop recording' : 'Start recording'}
                            disabled={!user}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="relative">
                        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tone</label>
                        <select
                            id="tone"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            value={tone}
                            onChange={(e) => setTone(e.target.value as Tone)}
                            disabled={!user}
                        >
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-9 text-gray-400 pointer-events-none"/>
                    </div>
                    <div className="relative">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            id="category"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            disabled={!user}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-9 text-gray-400 pointer-events-none"/>
                    </div>
                </div>

                {user && user.subscriptionTier === 'free' && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        You have <span className="font-bold text-primary-500">{generationsLeft}</span> of {FREE_TIER_LIMIT} free generations left this month.
                    </div>
                )}

                <Button 
                    onClick={handleGenerate} 
                    isLoading={isLoading} 
                    className="w-full !py-3 !text-base" 
                    icon={<Zap size={20}/>}
                    disabled={!user || isLoading}
                >
                    {user ? 'Generate Prompt' : 'Login to Generate Prompts'}
                </Button>

                 {!user && (
                    <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mt-2 p-3 bg-yellow-100/50 dark:bg-yellow-900/30 rounded-lg">
                        Please <Link to="/login" className="font-bold underline hover:text-yellow-500">log in</Link> or <Link to="/signup" className="font-bold underline hover:text-yellow-500">sign up</Link> to generate prompts.
                    </p>
                )}
            </div>

            {error && <div className="text-center text-red-500">{error}</div>}

            {isLoading && (
                <div className="text-center flex flex-col items-center justify-center space-y-4">
                    <Loader size={48} className="animate-spin text-primary-500" />
                    <p className="text-lg">Generating your masterpiece...</p>
                </div>
            )}

            {generatedPrompt && (
                <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">{generatedPrompt.title}</h2>
                    <div className="relative p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{generatedPrompt.prompt}</p>
                        <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Copy prompt">
                            <Copy size={16} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {generatedPrompt.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            )}

            <UpgradeModal 
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                onUpgrade={handleUpgrade}
            />
            <AdModal
                isOpen={isAdModalOpen}
                onClose={handleAdClose}
            />
        </div>
    );
};

export default HomePage;
