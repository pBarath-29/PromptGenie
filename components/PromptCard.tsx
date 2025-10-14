import React from 'react';
import { Prompt } from '../constants';
import { Copy, Bookmark, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RatingControl from './StarRating';
import { useNavigate, Link } from 'react-router-dom';
import { usePrompts } from '../contexts/PromptContext';

interface PromptCardProps {
  prompt: Prompt;
  onClick: (prompt: Prompt) => void;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick, onEdit, onDelete }) => {
  const { user, toggleSavePrompt, handleVote: handleUserVote } = useAuth();
  const { handlePromptVote } = usePrompts();
  const navigate = useNavigate();
  const isSaved = user?.savedPrompts?.includes(prompt.id);
  const isAuthor = user?.id === prompt.author.id;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      toggleSavePrompt(prompt.id);
    }
  };

  const handleVote = (voteType: 'up' | 'down') => {
    if (!user) {
      navigate('/login');
      return;
    }
    const previousVote = user.votes?.[prompt.id];
    handleUserVote(prompt.id, voteType);
    handlePromptVote(prompt.id, voteType, previousVote);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    onClick(prompt);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(prompt);
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(prompt.id);
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-semibold px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">{prompt.category}</span>
              <span className="font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{prompt.model}</span>
              {!prompt.isPublic && (
                <span className="flex items-center font-semibold px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                  <Bookmark size={12} className="mr-1" />
                  Premium
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{prompt.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{prompt.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            {user?.id !== prompt.author.id ? (
              <Link to={`/profile/${prompt.author.id}`} onClick={(e) => e.stopPropagation()} className="group">
                <img src={prompt.author.avatar} alt={prompt.author.name} className="w-10 h-10 rounded-full group-hover:ring-2 group-hover:ring-primary-400 transition-all" />
              </Link>
            ) : (
              <img src={prompt.author.avatar} alt={prompt.author.name} className="w-10 h-10 rounded-full" />
            )}
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{prompt.author.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {prompt.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-md">{tag}</span>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <RatingControl
            upvotes={prompt.upvotes}
            downvotes={prompt.downvotes}
            userVote={user?.votes?.[prompt.id]}
            onVote={handleVote}
          />
          <div className="flex items-center space-x-1">
              <MessageSquare size={16} />
              <span>{prompt.comments.length}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isAuthor && onEdit && onDelete && (
            <>
              <button onClick={handleEdit} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="Edit Prompt">
                <Edit size={18} />
              </button>
              <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500 transition-colors" title="Delete Prompt">
                <Trash2 size={18} />
              </button>
            </>
          )}
          <button 
            onClick={handleSave} 
            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isSaved ? 'text-primary-500' : ''}`} 
            title={isSaved ? "Unsave Prompt" : "Save Prompt"}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
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