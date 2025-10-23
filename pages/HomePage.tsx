import React, { useState, useEffect, useRef } from 'react';
import { Zap, Mic, Copy, Eraser, TrendingUp, Check } from 'lucide-react';
import { TONES, CATEGORIES, Tone, Category } from '../types';
import Button from '../components/Button';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { generateOptimizedPrompt, validateUserInput } from '../services/geminiService';
import { useHistory } from '../contexts/HistoryContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UpgradeModal from '../components/UpgradeModal';
import { FREE_TIER_LIMIT } from '../config';
import AdModal from '../components/AdModal';
import TutorialGuide from '../components/TutorialGuide';
import WelcomeBanner from '../components/WelcomeBanner';
import CustomDropdown from '../components/CustomDropdown';
import LogoSpinner from '../components/LogoSpinner';
import PromptComparison from '../components/PromptComparison';
import Modal from '../components/Modal';

const tutorialSteps = [
    {
        title: "Welcome to Prompter!",
        content: "Let's take a quick tour of the main features to get you started.",
    },
    {
        selector: "#prompt-generator-card",
        title: "The Prompt Generator",
        content: "This is where the magic happens! Describe your goal, select a tone and category, and our AI will craft a high-quality, optimized prompt for you."
    },
    {
        selector: "#nav-community",
        title: "Community Prompts",
        content: "Explore a vast library of prompts created and shared by our community. You can also share your own creations here!"
    },
    {
        selector: "#nav-marketplace",
        title: "The Marketplace",
        content: "Discover and purchase curated collections of premium prompts from expert creators for your specific needs."
    },
    {
        selector: "#user-menu-button",
        title: "Your Account",
        content: "Access your profile, saved prompts, and manage your account settings right here."
    },
    {
        title: "You're All Set!",
        content: "That's the basics. Feel free to explore and start creating. Happy prompting!",
    }
];


const HomePage: React.FC = () => {
    const [request, setRequest] = useState('');
    const [tone, setTone] = useState<Tone>('Professional');
    const [category, setCategory] = useState<Category>('Coding');
    const [generatedPrompt, setGeneratedPrompt] = useState<{ title: string; prompt: string; tags: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Generating your masterpiece...');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { addToHistory } = useHistory();
    const { user, getGenerationsLeft, incrementGenerationCount, completeTutorial } = useAuth();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isTutorialActive, setIsTutorialActive] = useState(false);
    const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
    
    // Ref to track the current user state to prevent race conditions on logout
    const userRef = useRef(user);
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    useEffect(() => {
        if (user) {
            // Handle new user greeting banner
            const isNewUser = sessionStorage.getItem('newUserGreeting');
            if (isNewUser === 'true') {
                setShowWelcomeBanner(true);
                sessionStorage.removeItem('newUserGreeting');
            }

            // Launch tutorial for new users
            if (!user.hasCompletedTutorial) {
                // A small delay to ensure the page has rendered
                setTimeout(() => setIsTutorialActive(true), 500);
            }
        } else {
            // When user logs out, clear the generator state
            setRequest('');
            setGeneratedPrompt(null);
            setError(null);
            setShowWelcomeBanner(false);
        }
    }, [user]);

    const generationsLeft = user ? getGenerationsLeft() : 0;
    const canGenerate = generationsLeft > 0;

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
    } = useSpeechRecognition({ onResult: setRequest });

    const handleClear = () => {
        setRequest('');
        setGeneratedPrompt(null);
        setError(null);
    };

    const proceedWithGeneration = async () => {
        setIsLoading(true);
        setLoadingText('Generating your masterpiece...');
        setError(null);
        setGeneratedPrompt(null);
        try {
            const result = await generateOptimizedPrompt(request, tone, category);
            // CRITICAL CHECK: After the API call returns, check if the user is still logged in.
            if (userRef.current) {
                setGeneratedPrompt(result);
                addToHistory(result);
                incrementGenerationCount();
            } else {
                console.log("User logged out during generation. Aborting state update.");
            }
        } catch (err) {
            // Also check before showing an error
            if (userRef.current) {
                setError((err as Error).message);
                console.error(err);
            } else {
                console.log("User logged out during generation. Suppressing error for logged-out state.");
            }
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
        
        if (request.trim().length < 15) {
            setError('Please provide a more detailed description (at least 15 characters).');
            return;
        }
        
        // Start validation phase
        setIsLoading(true);
        setLoadingText('Validating your request...');
        setError(null);
        setGeneratedPrompt(null);

        try {
            const validationResult = await validateUserInput(request);

            if (!validationResult.isValid) {
                setError("Your request seems unclear. Please try describing your goal in more detail.");
                setIsLoading(false); // Stop loading on validation failure
                return;
            }

            // Validation successful, move to next step
            if (user.subscriptionTier === 'free') {
                setIsAdModalOpen(true);
                // Stop loading here, as user needs to interact with the ad modal.
                // The ad modal's close handler will trigger the generation.
                setIsLoading(false); 
            } else {
                // For Pro users, proceed directly to generation.
                // proceedWithGeneration will handle the loading state from here.
                await proceedWithGeneration();
            }
        } catch (err) {
            setError((err as Error).message);
            setIsLoading(false); // Stop loading on any error during validation
        }
    };
    
    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAdClose = () => {
        setIsAdModalOpen(false);
        proceedWithGeneration();
    };

    const handleTutorialComplete = () => {
        setIsTutorialActive(false);
        completeTutorial();
    };

    const toneOptions = TONES.map(t => ({ value: t, label: t }));
    const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));


    return (
        <div className="space-y-12">
            {showWelcomeBanner && user && (
                <WelcomeBanner name={user.name} onDismiss={() => setShowWelcomeBanner(false)} />
            )}
             {isTutorialActive && (
                <TutorialGuide
                    steps={tutorialSteps}
                    onComplete={handleTutorialComplete}
                />
            )}
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Generate Smarter Prompts <span className="text-primary-500">Instantly</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Describe your goal, choose your desired tone, and let our AI craft the perfect, optimized prompt for you.
                </p>
            </section>

            <div id="prompt-generator-card" className="max-w-4xl mx-auto p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl space-y-6">
                <div className={`${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="mb-1">
                        <label htmlFor="request" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Describe your goal</label>
                    </div>
                    <div className="relative">
                        <textarea
                            id="request"
                            rows={4}
                            className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 disabled:bg-gray-200 dark:disabled:bg-gray-700/50"
                            placeholder="e.g., 'A marketing campaign slogan for a new coffee brand'"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                            disabled={!user || isLoading}
                        />
                        <button 
                            onClick={isListening ? stopListening : startListening}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            title={isListening ? 'Stop recording' : 'Start recording'}
                            disabled={!user || isLoading}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <CustomDropdown
                        label="Tone"
                        options={toneOptions}
                        value={tone}
                        onChange={(newTone) => setTone(newTone as Tone)}
                        disabled={!user || isLoading}
                    />
                    <CustomDropdown
                        label="Category"
                        options={categoryOptions}
                        value={category}
                        onChange={(newCategory) => setCategory(newCategory as Category)}
                        disabled={!user || isLoading}
                    />
                </div>

                {user && user.subscriptionTier === 'free' && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        You have <span className="font-bold text-primary-500">{generationsLeft}</span> of {FREE_TIER_LIMIT} free generations left this month.
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2">
                    <Button
                        variant="secondary"
                        onClick={handleClear}
                        disabled={!user || isLoading || !request.trim()}
                        icon={<Eraser size={18} />}
                        className="w-full sm:w-auto"
                    >
                        Clear
                    </Button>
                    <Button 
                        onClick={handleGenerate} 
                        isLoading={isLoading} 
                        className="w-full sm:flex-1 !py-3 !text-base" 
                        icon={<Zap size={20}/>}
                        disabled={!user || isLoading || !request.trim()}
                    >
                        {user ? 'Generate Prompt' : 'Login to Generate Prompts'}
                    </Button>
                </div>

                 {!user && (
                    <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mt-2 p-3 bg-yellow-100/50 dark:bg-yellow-900/30 rounded-lg">
                        Please <Link to="/login" className="font-bold underline hover:text-yellow-500">log in</Link> or <Link to="/signup" className="font-bold underline hover:text-yellow-500">sign up</Link> to generate prompts.
                    </p>
                )}
            </div>

            {error && <div className="text-center text-red-500">{error}</div>}

            {isLoading && (
                <div className="text-center flex flex-col items-center justify-center space-y-4 animate-fade-in">
                    <LogoSpinner size={48} />
                    <p className="text-lg">{loadingText}</p>
                </div>
            )}

            {generatedPrompt && !isLoading && (
                <div className="animate-fade-in">
                    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">{generatedPrompt.title}</h2>
                        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{generatedPrompt.prompt}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {generatedPrompt.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">{tag}</span>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t dark:border-gray-700 flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                             <Button
                                variant="secondary"
                                onClick={() => setIsAnalysisModalOpen(true)}
                                icon={<TrendingUp size={16}/>}
                                className="w-full sm:w-auto"
                            >
                                Analyze Prompt
                            </Button>
                            <Button
                                onClick={handleCopy}
                                icon={copied ? <Check size={16}/> : <Copy size={16}/>}
                                className="w-full sm:w-auto"
                            >
                                {copied ? 'Copied!' : 'Copy Prompt'}
                            </Button>
                        </div>
                    </div>
                    
                    <Modal
                        isOpen={isAnalysisModalOpen}
                        onClose={() => setIsAnalysisModalOpen(false)}
                        title="Prompt Analysis"
                        size="4xl"
                    >
                        {isAnalysisModalOpen && (
                            <PromptComparison 
                                userRequest={request}
                                generatedPrompt={generatedPrompt}
                            />
                        )}
                    </Modal>
                </div>
            )}

            <UpgradeModal 
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
            <AdModal
                isOpen={isAdModalOpen}
                onClose={handleAdClose}
            />
        </div>
    );
};

export default HomePage;