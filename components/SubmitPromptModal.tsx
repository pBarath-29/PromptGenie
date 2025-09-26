import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AI_MODELS, CATEGORIES } from '../constants';
import { AIModel, Category } from '../types';
import { ChevronDown } from 'lucide-react';

interface SubmitPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    prompt: string;
    description: string;
    category: Category;
    model: AIModel;
    tags: string[];
    isPublic: boolean;
  }) => void;
}

const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Education');
  const [model, setModel] = useState<AIModel>('Gemini');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setPrompt('');
    setDescription('');
    setCategory('Education');
    setModel('Gemini');
    setTags('');
    setError('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim() || !description.trim()) {
      setError('Title, Prompt, and Description are required fields.');
      return;
    }
    setError('');
    onSubmit({
      title,
      prompt,
      description,
      category,
      model,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isPublic: true,
    });
    resetForm();
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit a New Prompt">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input 
            id="title" 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Ultimate Essay Writing Assistant"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
            <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the full prompt text here..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 font-mono text-sm"
            />
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this prompt does."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
          <input 
            id="tags" 
            type="text" 
            value={tags} 
            onChange={e => setTags(e.target.value)}
            placeholder="e.g., Academic, Students, Writing"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
          />
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate tags with a comma.</p>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={handleClose} className="mr-2">Cancel</Button>
          <Button type="submit">Submit Prompt</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitPromptModal;