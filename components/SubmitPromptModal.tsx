import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AI_MODELS, CATEGORIES } from '../types';
import { AIModel, Category, Prompt } from '../constants';
import { ChevronDown, CheckCircle } from 'lucide-react';

interface SubmitPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Prompt, 'id' | 'author' | 'upvotes' | 'downvotes' | 'comments' | 'createdAt' | 'status'>) => void;
}

const SubmitPromptModal: React.FC<SubmitPromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Education');
  const [model, setModel] = useState<AIModel>('Gemini');
  const [tags, setTags] = useState('');
  const [exampleOutput, setExampleOutput] = useState('');
  const [outputType, setOutputType] = useState<'text' | 'image'>('text');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
        const isTraditionallyImageModel = model === 'MidJourney' || model === 'DALL-E';
        setOutputType(isTraditionallyImageModel ? 'image' : 'text');
    }
  }, [isOpen, model]);

  const resetForm = () => {
    setTitle('');
    setPrompt('');
    setDescription('');
    setCategory('Education');
    setModel('Gemini');
    setTags('');
    setExampleOutput('');
    setOutputType('text');
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
      exampleOutput: exampleOutput.trim() || undefined,
    });
    setSubmitted(true);
  };
  
  const handleClose = () => {
    resetForm();
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={submitted ? "Submission Successful" : "Submit a New Prompt"}>
      {submitted ? (
        <div className="text-center p-6 flex flex-col items-center space-y-4">
            <CheckCircle size={56} className="text-green-500" />
            <h3 className="text-2xl font-bold">Submitted for Review!</h3>
            <p className="text-gray-600 dark:text-gray-300">
                Thank you for your contribution! Your prompt will be reviewed by an administrator shortly and will appear on the community page once approved.
            </p>
            <Button onClick={handleClose} className="mt-4">
                Close
            </Button>
        </div>
      ) : (
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
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Example Output Type (Optional)
                </label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="outputType"
                            value="text"
                            checked={outputType === 'text'}
                            onChange={() => setOutputType('text')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Text</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="outputType"
                            value="image"
                            checked={outputType === 'image'}
                            onChange={() => setOutputType('image')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Image URL</span>
                    </label>
                </div>
            </div>

            <div>
                <label htmlFor="exampleOutput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {outputType === 'image' ? 'Example Output Image URL' : 'Example Output Text'}
                </label>
                {outputType === 'image' ? (
                    <input
                        id="exampleOutput"
                        type="text"
                        value={exampleOutput}
                        onChange={(e) => setExampleOutput(e.target.value)}
                        placeholder="e.g., https://example.com/image.png"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                    />
                ) : (
                    <textarea
                        id="exampleOutput"
                        rows={4}
                        value={exampleOutput}
                        onChange={(e) => setExampleOutput(e.target.value)}
                        placeholder="Provide an example of what this prompt might generate."
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50 dark:bg-gray-700"
                    />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {outputType === 'image'
                        ? 'Provide a direct URL to an image that demonstrates the output.'
                        : 'This helps others understand what to expect from your prompt.'
                    }
                </p>
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
            <Button type="submit">Submit for Review</Button>
            </div>
        </form>
      )}
    </Modal>
  );
};

export default SubmitPromptModal;