import React from 'react';
import { Prompt } from '../types';
import { ThumbsUp, ThumbsDown, Copy, Bookmark } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onVote: (id: string, type: 'up' | 'down') => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onVote }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-semibold px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">{prompt.category}</span>
              <span className="font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{prompt.model}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{prompt.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{prompt.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <img src={prompt.author.avatar} alt={prompt.author.name} className="w-10 h-10 rounded-full" />
            <span className="text-sm font-medium">{prompt.author.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {prompt.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-md">{tag}</span>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => onVote(prompt.id, 'up')} className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
            <ThumbsUp size={16} />
            <span>{prompt.upvotes}</span>
          </button>
          <button onClick={() => onVote(prompt.id, 'down')} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
            <ThumbsDown size={16} />
            <span>{prompt.downvotes}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Save Prompt">
            <Bookmark size={18} />
          </button>
          <button onClick={handleCopy} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Copy Prompt">
            <Copy size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
