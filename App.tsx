import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PromptProvider } from './contexts/PromptContext';
import { CollectionProvider } from './contexts/CollectionContext';
import { HistoryProvider } from './contexts/HistoryContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import MarketplacePage from './pages/MarketplacePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CollectionPage from './pages/CollectionPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PromptProvider>
          <CollectionProvider>
            <HistoryProvider>
              <HashRouter>
                <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  <Header />
                  <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                      <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </HashRouter>
            </HistoryProvider>
          </CollectionProvider>
        </PromptProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
