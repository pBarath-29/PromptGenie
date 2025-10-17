import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prompter. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/feedback" className="hover:text-primary-500">Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;