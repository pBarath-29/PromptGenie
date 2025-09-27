import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../contexts/PromptContext';
import { useCollections } from '../contexts/CollectionContext';
import { Award, Edit, BookOpen, ShoppingBag, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Button from '../components/Button';
import PromptCard from '../components/PromptCard';
import { Prompt } from '../types';
import PromptDetailModal from '../components/PromptDetailModal';
import CollectionCard from '../components/CollectionCard';
import EditPromptModal from '../components/EditPromptModal';
import ConfirmationModal from '../components/ConfirmationModal';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, removeSubmittedPrompt } = useAuth();
  const { prompts, updatePrompt, deletePrompt } = usePrompts();
  const { collections } = useCollections();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  if (!user) {
    return <div className="text-center text-lg">Please log in to view your profile.</div>;
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ bio, avatar });
    setIsEditModalOpen(false);
  };
  
  const handlePromptClick = (prompt: Prompt) => setSelectedPrompt(prompt);
  const handleCloseDetailModal = () => setSelectedPrompt(null);
  const handleEditClick = (prompt: Prompt) => setPromptToEdit(prompt);
  const handleDeleteClick = (promptId: string) => setPromptToDelete(promptId);

  const handlePromptUpdate = (updatedData: Omit<Prompt, 'author' | 'averageRating' | 'ratingsCount' | 'comments' | 'createdAt'>) => {
    if (!promptToEdit) return;
    const updatedPrompt = { ...promptToEdit, ...updatedData };
    updatePrompt(updatedPrompt);
    setPromptToEdit(null);
  };

  const handleConfirmDelete = () => {
      if (!promptToDelete) return;
      deletePrompt(promptToDelete);
      removeSubmittedPrompt(promptToDelete);
      setPromptToDelete(null);
  };
  
  const userPrompts = prompts.filter(p => user.submittedPrompts?.includes(p.id));
  const userCollections = collections.filter(c => user.purchasedCollections?.includes(c.id));
  const savedPrompts = prompts.filter(p => user.savedPrompts?.includes(p.id));

  return (
    <div className="space-y-12">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img src={avatar} alt={user.name} className="w-32 h-32 rounded-full ring-4 ring-primary-500 object-cover" />
        <div className="text-center md:text-left flex-grow">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <h1 className="text-4xl font-extrabold">{user.name}</h1>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} icon={<Edit size={16}/>}>
              Edit Profile
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">{bio}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            {user.badges?.map(badge => (
              <span key={badge} className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-semibold rounded-full">
                <Award size={16} className="mr-1.5" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><BookOpen className="mr-3 text-primary-500"/> My Submitted Prompts</h2>
        {userPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPrompts.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onClick={handlePromptClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You haven't submitted any prompts yet.</p>
            <Link to="/community">
                <Button className="mt-4">Submit Your First Prompt</Button>
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><Bookmark className="mr-3 text-primary-500"/> My Saved Prompts</h2>
        {savedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrompts.map(prompt => (
               <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onClick={handlePromptClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You haven't saved any prompts yet.</p>
             <Link to="/community">
                <Button className="mt-4">Explore Prompts</Button>
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><ShoppingBag className="mr-3 text-primary-500"/> My Purchased Collections</h2>
        {userCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCollections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You haven't purchased any collections yet.</p>
             <Link to="/marketplace">
                <Button className="mt-4">Explore Marketplace</Button>
            </Link>
          </div>
        )}
      </section>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Your Profile">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium mb-1">Avatar URL</label>
            <input 
              id="avatar" 
              type="text" 
              value={avatar} 
              onChange={e => setAvatar(e.target.value)} 
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
           <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              id="bio"
              rows={4}
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)} className="mr-2">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
      
      <PromptDetailModal
        isOpen={!!selectedPrompt}
        onClose={handleCloseDetailModal}
        prompt={selectedPrompt}
      />

      <EditPromptModal
          isOpen={!!promptToEdit}
          onClose={() => setPromptToEdit(null)}
          onSubmit={handlePromptUpdate}
          prompt={promptToEdit}
      />

      <ConfirmationModal
          isOpen={!!promptToDelete}
          onClose={() => setPromptToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Prompt"
          message="Are you sure you want to delete this prompt? This action cannot be undone."
          confirmButtonText="Delete"
          confirmButtonVariant="danger"
      />
    </div>
  );
};

export default ProfilePage;