import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../contexts/PromptContext';
import { useCollections } from '../contexts/CollectionContext';
import { useHistory } from '../contexts/HistoryContext';
import { Award, Edit, BookOpen, ShoppingBag, Bookmark, Package, History, KeyRound, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Button from '../components/Button';
import PromptCard from '../components/PromptCard';
import { Prompt, HistoryItem } from '../constants';
import PromptDetailModal from '../components/PromptDetailModal';
import CollectionCard from '../components/CollectionCard';
import EditPromptModal from '../components/EditPromptModal';
import ConfirmationModal from '../components/ConfirmationModal';
import HistoryDetailModal from '../components/HistoryDetailModal';
import ImageUpload from '../components/ImageUpload';
import Pagination from '../components/Pagination';
import ChangePasswordModal from '../components/ChangePasswordModal';

const HISTORY_PER_PAGE = 5;
const PROMPTS_PER_PAGE = 6;
const COLLECTIONS_PER_PAGE = 4;

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, removeSubmittedPrompt, cancelSubscription } = useAuth();
  const { prompts, updatePrompt, deletePrompt } = usePrompts();
  const { collections } = useCollections();
  const { history } = useHistory();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isCancelSubModalOpen, setIsCancelSubModalOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  // Pagination states
  const [historyPage, setHistoryPage] = useState(1);
  const [submittedPromptsPage, setSubmittedPromptsPage] = useState(1);
  const [createdCollectionsPage, setCreatedCollectionsPage] = useState(1);
  const [savedPromptsPage, setSavedPromptsPage] = useState(1);
  const [purchasedCollectionsPage, setPurchasedCollectionsPage] = useState(1);


  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setAvatar(user.avatar);
    }
  }, [user, isEditModalOpen]);

  const badges = useMemo(() => {
    if (!user) return [];
    
    const calculatedBadges: string[] = [];
    
    // Admin badge
    if (user.role === 'admin') {
        calculatedBadges.push('Admin');
    }

    const approvedPrompts = prompts.filter(p => user.submittedPrompts?.includes(p.id) && p.status === 'approved');
    
    // Prompt Master badge: 20 or more approved prompts
    if (approvedPrompts.length >= 20) {
        calculatedBadges.push('Prompt Master');
    }
    
    // Top Creator badge: Average of 100+ upvotes across all approved prompts
    if (approvedPrompts.length > 0) {
        const totalUpvotes = approvedPrompts.reduce((sum, p) => sum + p.upvotes, 0);
        const averageUpvotes = totalUpvotes / approvedPrompts.length;
        if (averageUpvotes >= 100) {
            calculatedBadges.push('Top Creator');
        }
    }
    
    return calculatedBadges;
  }, [user, prompts]);

  if (!user) {
    return <div className="text-center text-lg">Please log in to view your profile.</div>;
  }

  const handleProfileUpdate = () => {
    updateUserProfile({ bio, avatar });
    setIsEditModalOpen(false);
  };
  
  const handlePromptClick = (prompt: Prompt) => setSelectedPrompt(prompt);
  const handleCloseDetailModal = () => setSelectedPrompt(null);
  const handleEditClick = (prompt: Prompt) => setPromptToEdit(prompt);
  const handleDeleteClick = (promptId: string) => setPromptToDelete(promptId);

  const handlePromptUpdate = (updatedData: Omit<Prompt, 'author' | 'upvotes' | 'downvotes' | 'comments' | 'createdAt'>) => {
    if (!promptToEdit) return;
    const updatedPrompt = { 
      ...promptToEdit, 
      ...updatedData,
      upvotes: 0,
      downvotes: 0,
    };
    updatePrompt(updatedPrompt);
    setPromptToEdit(null);
  };

  const handleConfirmDelete = () => {
      if (!promptToDelete) return;
      deletePrompt(promptToDelete);
      removeSubmittedPrompt(promptToDelete);
      setPromptToDelete(null);
  };

  const handleCancelSubscription = () => {
    cancelSubscription();
    setIsCancelSubModalOpen(false);
  };
  
  // Data for sections
  const userPrompts = prompts.filter(p => user.submittedPrompts?.includes(p.id));
  const userCreatedCollections = collections.filter(c => user.createdCollections?.includes(c.id));
  const userPurchasedCollections = collections.filter(c => user.purchasedCollections?.includes(c.id));
  const savedPrompts = prompts.filter(p => user.savedPrompts?.includes(p.id));

  // Pagination Logic
  const paginate = (items: any[], page: number, perPage: number) => {
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice((page - 1) * perPage, page * perPage);
    return { totalPages, paginatedItems };
  };

  const { totalPages: historyTotalPages, paginatedItems: paginatedHistory } = paginate(history, historyPage, HISTORY_PER_PAGE);
  const { totalPages: submittedPromptsTotalPages, paginatedItems: paginatedSubmittedPrompts } = paginate(userPrompts, submittedPromptsPage, PROMPTS_PER_PAGE);
  const { totalPages: createdCollectionsTotalPages, paginatedItems: paginatedCreatedCollections } = paginate(userCreatedCollections, createdCollectionsPage, COLLECTIONS_PER_PAGE);
  const { totalPages: savedPromptsTotalPages, paginatedItems: paginatedSavedPrompts } = paginate(savedPrompts, savedPromptsPage, PROMPTS_PER_PAGE);
  const { totalPages: purchasedCollectionsTotalPages, paginatedItems: paginatedPurchasedCollections } = paginate(userPurchasedCollections, purchasedCollectionsPage, COLLECTIONS_PER_PAGE);


  return (
    <div className="space-y-12">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img src={avatar} alt={user.name} className="w-32 h-32 rounded-full ring-4 ring-primary-500 object-cover" />
        <div className="text-center md:text-left flex-grow">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <h1 className="text-4xl font-extrabold">{user.name}</h1>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} icon={<Edit size={16}/>}>
                Edit Profile
              </Button>
               <Button variant="secondary" onClick={() => setIsChangePasswordModalOpen(true)} icon={<KeyRound size={16}/>}>
                Change Password
              </Button>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">{bio}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <div className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-semibold rounded-full">
                <BookOpen size={16} className="mr-1.5" />
                <span>{user.submittedPrompts?.length || 0} Prompts Submitted</span>
            </div>
            {badges.map(badge => (
              <span key={badge} className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-semibold rounded-full">
                <Award size={16} className="mr-1.5" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><CreditCard className="mr-3 text-primary-500"/> My Subscription</h2>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {user.subscriptionTier === 'pro' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                <p className="text-xl font-bold text-primary-500 flex items-center">
                  <Award size={20} className="mr-2"/> Pro Plan
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p><span className="font-semibold">Renewal Date:</span> July 28, 2024</p>
                <p><span className="font-semibold">Billing Cycle:</span> Monthly</p>
                <p><span className="font-semibold">Amount:</span> $9.90 / month</p>
              </div>
              <div className="md:text-right">
                <Button variant="danger" onClick={() => setIsCancelSubModalOpen(true)}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                <p className="text-xl font-bold">Free Plan</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Unlock unlimited generations and an ad-free experience.</p>
              </div>
              <Link to="/upgrade">
                <Button icon={<ArrowRight size={16}/>} className="!flex-row-reverse">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><History className="mr-3 text-primary-500"/> My Generation History</h2>
        {history.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedHistory.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedHistoryItem(item)} 
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.tags.join(', ')}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={historyPage} totalPages={historyTotalPages} onPageChange={setHistoryPage} />
          </>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You haven't generated any prompts yet.</p>
            <Link to="/">
                <Button className="mt-4">Generate Your First Prompt</Button>
            </Link>
          </div>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><BookOpen className="mr-3 text-primary-500"/> My Submitted Prompts</h2>
        {userPrompts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedSubmittedPrompts.map(prompt => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt} 
                  onClick={handlePromptClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
            <Pagination currentPage={submittedPromptsPage} totalPages={submittedPromptsTotalPages} onPageChange={setSubmittedPromptsPage} />
          </>
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
        <h2 className="text-2xl font-bold mb-4 flex items-center"><Package className="mr-3 text-primary-500"/> My Created Collections</h2>
        {userCreatedCollections.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedCreatedCollections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            <Pagination currentPage={createdCollectionsPage} totalPages={createdCollectionsTotalPages} onPageChange={setCreatedCollectionsPage} />
          </>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">You haven't created any collections yet.</p>
             <Link to="/marketplace">
                <Button className="mt-4">Create Your First Collection</Button>
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center"><Bookmark className="mr-3 text-primary-500"/> My Saved Prompts</h2>
        {savedPrompts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedSavedPrompts.map(prompt => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt} 
                  onClick={handlePromptClick}
                />
              ))}
            </div>
            <Pagination currentPage={savedPromptsPage} totalPages={savedPromptsTotalPages} onPageChange={setSavedPromptsPage} />
          </>
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
        {userPurchasedCollections.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedPurchasedCollections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            <Pagination currentPage={purchasedCollectionsPage} totalPages={purchasedCollectionsTotalPages} onPageChange={setPurchasedCollectionsPage} />
          </>
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
        <div className="space-y-4">
          <ImageUpload
              label="Avatar Image"
              initialImageUrl={avatar}
              onImageSelect={setAvatar}
          />
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
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
      
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

      <ConfirmationModal
        isOpen={isCancelSubModalOpen}
        onClose={() => setIsCancelSubModalOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your Pro subscription? You will lose access to Pro benefits at the end of your current billing cycle."
        confirmButtonText="Confirm Cancellation"
        confirmButtonVariant="danger"
      />

      <HistoryDetailModal
        isOpen={!!selectedHistoryItem}
        onClose={() => setSelectedHistoryItem(null)}
        item={selectedHistoryItem}
      />
    </div>
  );
};

export default ProfilePage;