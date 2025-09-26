import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Collection, Prompt, AIModel, Category } from '../types';
import { AI_MODELS, CATEGORIES } from '../constants';
import { ChevronDown, PlusCircle, Trash2, X } from 'lucide-react';

type NewPromptData = Omit<Prompt, 'id' | 'author' | 'upvotes' | 'downvotes' | 'createdAt' | 'isPublic'>;
type NewCollectionData = Omit<Collection, 'id' | 'creator' | 'promptCount' | 'promptIds'>;

interface SubmitCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (collectionData: NewCollectionData, newPromptsData: NewPromptData[]) => void;
}

const NewPromptForm: React.FC<{onAddPrompt: (prompt: NewPromptData) => void}> = ({ onAddPrompt }) => {
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Category>('Education');
    const [model, setModel] = useState<AIModel>('Gemini');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!title.trim() || !prompt.trim() || !description.trim()) {
            setError('Please fill in title, prompt, and description for the new prompt.');
            return;
        }
        onAddPrompt({
            title, prompt, description, category, model,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        });
        // Reset form
        setTitle(''); setPrompt(''); setDescription(''); setTags(''); setError('');
    };

    return (
        <div className="p-4 border border-dashed rounded-lg space-y-3 bg-gray-50 dark:bg-gray-900/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Add New Prompt to Collection</h4>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Prompt Title" className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"/>
             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Prompt text..." rows={4} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"/>
             <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Prompt description..." rows={2} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"/>
             <div className="grid grid-cols-2 gap-2">
                <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={model} onChange={e => setModel(e.target.value as AIModel)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                    {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>
             <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags, separated by commas" className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"/>
             {error && <p className="text-red-500 text-xs">{error}</p>}
             <Button type="button" onClick={handleAdd} icon={<PlusCircle size={16}/>}>Add Prompt</Button>
        </div>
    )
}


const SubmitCollectionModal: React.FC<SubmitCollectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [coverImage, setCoverImage] = useState('');
  const [newPrompts, setNewPrompts] = useState<NewPromptData[]>([]);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCoverImage('');
    setNewPrompts([]);
    setError('');
  };

  const handleAddPrompt = (prompt: NewPromptData) => {
    setNewPrompts(prev => [...prev, prompt]);
  }

  const handleRemovePrompt = (index: number) => {
    setNewPrompts(prev => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || price === '') {
      setError('Please fill out the collection name, description, and price.');
      return;
    }
    if (newPrompts.length === 0) {
      setError('A collection must contain at least one prompt.');
      return;
    }

    setError('');
    onSubmit(
        {
            name,
            description,
            price: Number(price),
            coverImage: coverImage || `https://picsum.photos/seed/${name.replace(/\s/g, '-')}/600/400`,
        },
        newPrompts
    );
    resetForm();
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit a New Collection">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="collection-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collection Name</label>
          <input id="collection-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., AI Artistry Master Pack" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
        </div>

        <div>
            <label htmlFor="collection-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="collection-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe what this collection is about." className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="collection-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                <input id="collection-price" type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 19.99" min="0" step="0.01" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
            </div>
             <div>
                <label htmlFor="collection-cover" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
                <input id="collection-cover" type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Optional, we'll generate one for you" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
            </div>
        </div>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompts for this Collection ({newPrompts.length})</label>
            {newPrompts.length > 0 && (
                <div className="space-y-2">
                    {newPrompts.map((p, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                           <span className="text-sm font-medium">{p.title}</span>
                           <button type="button" onClick={() => handleRemovePrompt(index)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                               <Trash2 size={16}/>
                           </button>
                        </div>
                    ))}
                </div>
            )}
           <NewPromptForm onAddPrompt={handleAddPrompt} />
        </div>
        
        {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
        
        <div className="flex justify-end pt-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 py-4 -mx-6 px-6">
          <Button type="button" variant="secondary" onClick={handleClose} className="mr-2">Cancel</Button>
          <Button type="submit">Submit Collection</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmitCollectionModal;