import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Zap, Menu, X } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;
    
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'bg-primary-500 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;
    
  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  }
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400">
                <Zap size={24} />
                <span>Prompter</span>
              </NavLink>
              <nav className="hidden md:flex space-x-4">
                <NavLink to="/" className={navLinkClass}>Generator</NavLink>
                <NavLink to="/community" className={navLinkClass}>Community</NavLink>
                <NavLink to="/marketplace" className={navLinkClass}>Marketplace</NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 relative">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                       {user.subscriptionTier === 'pro' && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md ring-2 ring-white dark:ring-gray-800">
                            PRO
                        </span>
                      )}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
                      <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</NavLink>
                      <NavLink to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</NavLink>
                      <button onClick={() => setIsLogoutModalOpen(true)} className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                    </div>
                  </div>
                ) : (
                  null
                )}
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavLink to="/" className={mobileNavLinkClass} onClick={closeMobileMenu}>Generator</NavLink>
                <NavLink to="/community" className={mobileNavLinkClass} onClick={closeMobileMenu}>Community</NavLink>
                <NavLink to="/marketplace" className={mobileNavLinkClass} onClick={closeMobileMenu}>Marketplace</NavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <div className="px-2 space-y-1">
                  <div className="flex items-center px-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      {user.subscriptionTier === 'pro' && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md ring-2 ring-white dark:ring-gray-800">
                              PRO
                          </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-800 dark:text-white">{user.name}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">View profile</p>
                    </div>
                  </div>
                  <NavLink to="/profile" className={mobileNavLinkClass} onClick={closeMobileMenu}>Profile</NavLink>
                  <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={closeMobileMenu}>Dashboard</NavLink>
                  <button 
                    onClick={handleLogoutClick} 
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                null
              )}
            </div>
          </div>
        )}
      </header>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => { logout(); closeMobileMenu(); }}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmButtonText="Logout"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export default Header;