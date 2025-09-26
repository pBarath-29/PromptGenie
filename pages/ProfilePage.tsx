import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_PROMPTS } from '../constants';
import { Star, Award } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const savedPrompts = MOCK_PROMPTS.slice(0, 2); // Mock saved prompts

  if (!user) {
    return <div className="text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full ring-4 ring-primary-500" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{user.bio}</p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            {user.badges?.map(badge => (
              <span key={badge} className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-semibold rounded-full">
                <Award size={16} className="mr-1" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">My Library</h2>
        <div className="space-y-4">
          {savedPrompts.map(prompt => (
            <div key={prompt.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{prompt.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.category} - {prompt.model}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Star size={20} className="text-yellow-500"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
