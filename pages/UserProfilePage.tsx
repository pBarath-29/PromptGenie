import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../contexts/PromptContext';
import { Prompt } from '../constants';
import PromptCard from '../components/PromptCard';
import PromptDetailModal from '../components/PromptDetailModal';
import { Award, BookOpen, UserX } from 'lucide-react';
import Button from '../components/Button';
import Pagination from '../components/Pagination';

const PROMPTS_PER_PAGE = 6;

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { getUserById, user: loggedInUser } = useAuth();
    const { prompts } = usePrompts();

    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const userProfile = userId ? getUserById(userId) : null;

    useEffect(() => {
        // If the logged-in user is viewing their own public profile, redirect them to their editable profile page
        if (userId === loggedInUser?.id) {
            navigate('/profile', { replace: true });
        }
    }, [userId, loggedInUser, navigate]);

    const badges = useMemo(() => {
        if (!userProfile) return [];
        
        const calculatedBadges: string[] = [];
        
        // Admin badge
        if (userProfile.role === 'admin') {
            calculatedBadges.push('Admin');
        }

        const approvedPrompts = prompts.filter(p => userProfile.submittedPrompts?.includes(p.id) && p.status === 'approved');
        
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
    }, [userProfile, prompts]);

    if (!userProfile) {
        return (
            <div className="text-center py-20">
                <UserX size={64} className="mx-auto text-gray-400 mb-4" />
                <h1 className="text-4xl font-bold">User Not Found</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    The profile you are looking for does not exist.
                </p>
                <Link to="/community">
                    <Button className="mt-6">Back to Community</Button>
                </Link>
            </div>
        );
    }

    const handlePromptClick = (prompt: Prompt) => setSelectedPrompt(prompt);
    const handleCloseDetailModal = () => setSelectedPrompt(null);

    const userPublicPrompts = prompts.filter(p =>
        p.author.id === userProfile.id && p.isPublic && p.status === 'approved'
    );
    
    const totalPages = Math.ceil(userPublicPrompts.length / PROMPTS_PER_PAGE);
    const paginatedPrompts = userPublicPrompts.slice(
        (currentPage - 1) * PROMPTS_PER_PAGE,
        currentPage * PROMPTS_PER_PAGE
    );

    return (
        <div className="space-y-12">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-32 h-32 rounded-full ring-4 ring-primary-500 object-cover" />
                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-4xl font-extrabold">{userProfile.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">{userProfile.bio}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                        <div className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-semibold rounded-full">
                            <BookOpen size={16} className="mr-1.5" />
                            <span>{userProfile.submittedPrompts?.length || 0} Prompts Submitted</span>
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
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <BookOpen className="mr-3 text-primary-500" /> Public Prompts by {userProfile.name}
                </h2>
                {userPublicPrompts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedPrompts.map(prompt => (
                                <PromptCard
                                    key={prompt.id}
                                    prompt={prompt}
                                    onClick={handlePromptClick}
                                />
                            ))}
                        </div>
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">{userProfile.name} hasn't shared any public prompts yet.</p>
                    </div>
                )}
            </section>

            <PromptDetailModal
                isOpen={!!selectedPrompt}
                onClose={handleCloseDetailModal}
                prompt={selectedPrompt}
            />
        </div>
    );
};

export default UserProfilePage;
