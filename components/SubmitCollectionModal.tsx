import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Collection, Prompt, AIModel, Category } from '../constants';
import { AI_MODELS, CATEGORIES } from '../types';
import { ChevronDown, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

// FIX: Update Omit to use correct properties from the Prompt type ('upvotes', 'downvotes') instead of the non-existent 'averageRating' and 'ratingsCount'.
type NewPromptData = Omit<Prompt, 'id' | 'author' | 'upvotes' | 'downvotes' | 'comments' | 'createdAt' | 'isPublic' | 'status'>;
type NewCollectionData = Omit<Collection, 'id' | 'creator' | 'promptCount' | 'promptIds' | 'status'>;

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
    const [exampleOutput, setExampleOutput] = useState('');
    const [outputType, setOutputType] = useState<'text' | 'image'>('text');
    const [error, setError] = useState('');

    useEffect(() => {
        const isTraditionallyImageModel = model === 'MidJourney' || model === 'DALL-E';
        setOutputType(isTraditionallyImageModel ? 'image' : 'text');
        setExampleOutput('');
    }, [model]);


    const handleAdd = () => {
        if (!title.trim() || !prompt.trim() || !description.trim()) {
            setError('Please fill in title, prompt, and description for the new prompt.');
            return;
        }
        onAddPrompt({
            title, prompt, description, category, model,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            exampleOutput: exampleOutput.trim() || undefined,
        });
        // Reset form
        setTitle(''); setPrompt(''); setDescription(''); setTags(''); setError('');
        setExampleOutput('');
        setOutputType('text');
    };

    return (
        <div className="p-4 border border-dashed rounded-lg space-y-3 bg-gray-50 dark:bg-gray-900/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Add New Prompt to Collection</h4>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Prompt Title" className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"/>
             <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Prompt text..." rows={4} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"/>
             <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Prompt description..." rows={2} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"/>
             
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Example Output Type (Optional)
                </label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={`outputType-${title}`}
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
                            name={`outputType-${title}`}
                            value="image"
                            checked={outputType === 'image'}
                            onChange={() => setOutputType('image')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Image</span>
                    </label>
                </div>
            </div>

            <div>
                {outputType === 'image' ? (
                    <ImageUpload
                        label="Example Output Image"
                        onImageSelect={setExampleOutput}
                    />
                ) : (
                    <>
                        <label htmlFor={`exampleOutput-${title}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Example Output Text</label>
                        <textarea
                            id={`exampleOutput-${title}`}
                            rows={4}
                            value={exampleOutput}
                            onChange={(e) => setExampleOutput(e.target.value)}
                            placeholder="Provide an example of what this prompt might generate."
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                        />
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This helps others understand what to expect from your prompt.
                        </p>
                    </>
                )}
            </div>

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
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
  };
  
  const handleClose = () => {
    resetForm();
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={submitted ? "Submission Successful" : "Submit a New Collection"}>
      {submitted ? (
         <div className="text-center p-6 flex flex-col items-center space-y-4">
            <CheckCircle size={56} className="text-green-500" />
            <h3 className="text-2xl font-bold">Submitted for Review!</h3>
            <p className="text-gray-600 dark:text-gray-300">
                Your collection will be reviewed by an administrator. Once approved, it will be available on the Marketplace.
            </p>
            <Button onClick={handleClose} className="mt-4">
                Close
            </Button>
        </div>
      ) : (
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
                <div className="flex flex-col justify-end">
                    <ImageUpload 
                        label="Cover Image (Optional)"
                        onImageSelect={setCoverImage}
                    />
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
      )}
    </Modal>
  );
};

export default SubmitCollectionModal;