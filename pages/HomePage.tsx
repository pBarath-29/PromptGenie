import React, { useState } from 'react';
import { Zap, Mic, Copy, Loader, ChevronDown } from 'lucide-react';
import { AI_MODELS, CATEGORIES } from '../constants';
import { AIModel, Category } from '../types';
import Button from '../components/Button';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { generateOptimizedPrompt } from '../services/geminiService';

const HomePage: React.FC = () => {
    const [request, setRequest] = useState('');
    const [model, setModel] = useState<AIModel>('Gemini');
    const [category, setCategory] = useState<Category>('Coding');
    const [generatedPrompt, setGeneratedPrompt] = useState<{ title: string; prompt: string; tags: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
    } = useSpeechRecognition({ onResult: setRequest });

    const handleGenerate = async () => {
        if (!request.trim()) {
            setError('Please describe what kind of prompt you want.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt(null);
        try {
            const result = await generateOptimizedPrompt(request, model, category);
            setGeneratedPrompt(result);
        } catch (err) {
            setError('Failed to generate prompt. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt.prompt);
        }
    };

    return (
        <div className="space-y-12">
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Generate Smarter Prompts <span className="text-primary-500">Instantly</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Describe your goal, choose your AI model, and let our AI craft the perfect, optimized prompt for you.
                </p>
            </section>

            <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl space-y-6">
                <div>
                    <label htmlFor="request" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Describe your goal</label>
                    <div className="relative">
                        <textarea
                            id="request"
                            rows={4}
                            className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                            placeholder="e.g., 'A marketing campaign slogan for a new coffee brand'"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                        />
                        <button 
                            onClick={isListening ? stopListening : startListening}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            title={isListening ? 'Stop recording' : 'Start recording'}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Model</label>
                        <select
                            id="model"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                            value={model}
                            onChange={(e) => setModel(e.target.value as AIModel)}
                        >
                            {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-9 text-gray-400 pointer-events-none"/>
                    </div>
                    <div className="relative">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            id="category"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={20} className="absolute right-3 top-9 text-gray-400 pointer-events-none"/>
                    </div>
                </div>

                <Button onClick={handleGenerate} isLoading={isLoading} className="w-full !py-3 !text-base" icon={<Zap size={20}/>}>
                    Generate Prompt
                </Button>
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
        </div>
    );
};

export default HomePage;
