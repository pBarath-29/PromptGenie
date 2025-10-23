import React, { useState, useEffect } from 'react';
import { analyzePromptComparison } from '../services/geminiService';
import LogoSpinner from './LogoSpinner';
import { TrendingUp, Award, CheckCircle } from 'lucide-react';

interface PromptComparisonProps {
  userRequest: string;
  generatedPrompt: { title: string; prompt: string; tags: string[] };
}

const PromptComparison: React.FC<PromptComparisonProps> = ({ userRequest, generatedPrompt }) => {
  const [comparison, setComparison] = useState<{ userInputScore: number; generatedPromptScore: number; analysis: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await analyzePromptComparison(userRequest, generatedPrompt.prompt);
        setComparison(result);
      } catch (err) {
        setError((err as Error).message);
        console.error("Failed to analyze prompt comparison:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    getAnalysis();
  }, [userRequest, generatedPrompt]);

  if (isLoading) {
    return (
      <div className="text-center flex flex-col items-center justify-center space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl animate-fade-in">
        <LogoSpinner size={32} />
        <p className="text-lg">Analyzing prompt effectiveness...</p>
      </div>
    );
  }
  
  if (error) {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-red-100/50 dark:bg-red-900/30 rounded-2xl animate-fade-in text-center">
            <p className="text-red-600 dark:text-red-300">Could not load prompt analysis: {error}</p>
        </div>
    );
  }

  if (!comparison) return null;

  const improvement = comparison.generatedPromptScore - comparison.userInputScore;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
                <TrendingUp className="text-primary-500" />
                <span>Prompt Analysis</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Comparing your request to the AI-optimized prompt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2">Your Request</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3">"{userRequest}"</p>
                <div className="mt-4 text-center">
                    <span className="text-3xl font-bold">{comparison.userInputScore}</span>
                    <span className="text-sm text-gray-500">/100</span>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Effectiveness Score</p>
                </div>
            </div>
             <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-300 dark:border-primary-700">
                <h3 className="font-semibold text-lg mb-2 text-primary-700 dark:text-primary-300">Optimized Prompt</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3">"{generatedPrompt.prompt}"</p>
                 <div className="mt-4 text-center">
                    <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{comparison.generatedPromptScore}</span>
                    <span className="text-sm text-gray-500">/100</span>
                     <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Effectiveness Score</p>
                </div>
            </div>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h3 className="font-bold text-lg text-green-800 dark:text-green-300 flex items-center mb-3">
                <Award size={20} className="mr-2"/>
                Key Improvements
                {improvement > 0 && (
                    <span className="ml-2 text-sm font-bold bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                        +{improvement} Pts
                    </span>
                )}
            </h3>
            <ul className="space-y-2">
                {comparison.analysis.map((point, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default PromptComparison;