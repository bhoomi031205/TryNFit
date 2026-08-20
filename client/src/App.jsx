import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WardrobeProvider } from './context/WardrobeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { ExplorePage } from './pages/ExplorePage';
import { WardrobePage } from './pages/WardrobePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { checkHealth } from './services/api';

// Automatically scrolls window to top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    const performCheck = async () => {
      const status = await checkHealth();
      setServerStatus(status);
    };

    performCheck();
    const interval = setInterval(performCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <WardrobeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-studio-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
            {/* Header Navigation */}
            <Navbar serverStatus={serverStatus} />

            {/* Main Route View */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/wardrobe" element={<WardrobePage />} />
                <Route path="/history" element={<WardrobePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </WardrobeProvider>
    </AuthProvider>
  );
};

export default App;
