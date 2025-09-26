import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} PromptGenie. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-500">Twitter</a>
            <a href="#" className="hover:text-primary-500">GitHub</a>
            <a href="#" className="hover:text-primary-500">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
