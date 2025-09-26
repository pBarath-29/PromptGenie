import React, { useState } from 'react';
import PromptCard from '../components/PromptCard';
import { usePrompts } from '../contexts/PromptContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';
import { AI_MODELS, CATEGORIES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { Category, AIModel } from '../types';

const CommunityPage: React.FC = () => {
  const { prompts, voteOnPrompt, addPrompt } = usePrompts();
  const { user, login, addSubmittedPrompt } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [model, setModel] = useState<AIModel>(AI_MODELS[0]);
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit a prompt.");
      return;
    }

    const newPromptId = `p${Date.now()}`;
    addPrompt({
      id: newPromptId,
      title,
      description,
      prompt: promptText,
      category,
      model,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      author: user,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString()
    });
    addSubmittedPrompt(newPromptId);

    setIsModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setPromptText('');
    setTags('');
  };

  const handleOpenModal = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      login();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Prompts</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover, vote, and share the best prompts from the community.</p>
        </div>
        <Button onClick={handleOpenModal} icon={<Plus size={18}/>}>
          Submit a Prompt
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map(prompt => (
          <PromptCard key={prompt.id} prompt={prompt} onVote={voteOnPrompt} />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit a New Prompt">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium">Prompt Text</label>
            <textarea value={promptText} onChange={e => setPromptText(e.target.value)} required rows={5} className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 font-mono text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">AI Model</label>
              <select value={model} onChange={e => setModel(e.target.value as any)} className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium">Tags (comma-separated)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default CommunityPage;