import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PromptProvider } from './contexts/PromptContext';
import { CollectionProvider } from './contexts/CollectionContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { FeedbackProvider } from './contexts/FeedbackContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import CollectionPage from './pages/CollectionPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import AdminRoute from './components/AdminRoute';
import UpgradePage from './pages/UpgradePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FeedbackPage from './pages/FeedbackPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LogoSpinner from './components/LogoSpinner';
import { PromoCodeProvider } from './contexts/PromoCodeContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LogoSpinner size={64} />
      </div>
    );
  }

  const mainLayout = (children: React.ReactNode) => (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );

  if (user && user.role === 'admin') {
    return mainLayout(
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        {/* Redirect all other attempted paths to the admin panel */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return mainLayout(
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionPage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PromoCodeProvider>
          <PromptProvider>
            <CollectionProvider>
              <HistoryProvider>
                <FeedbackProvider>
                  <HashRouter>
                    <AppContent />
                  </HashRouter>
                </FeedbackProvider>
              </HistoryProvider>
            </CollectionProvider>
          </PromptProvider>
        </PromoCodeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
