import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Gem, LogIn, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { getTranslation } from '@/components/translations';

export default function Layout({ children, currentPageName }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  };

  const t = (key) => getTranslation(language, key);

  return (
    <div className="min-h-screen pt-20">
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Лого */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Stake Prediction
              </span>
            </Link>

            {/* Навигационные ссылки */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl('Home')} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'Home' 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('home')}
              </Link>
              <Link 
                to={createPageUrl('Predictor')} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'Predictor' 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('predictors')}
              </Link>
              
              <Link 
                to={createPageUrl('FAQ')} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'FAQ' 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('faq')}
              </Link>
              
              <Link 
                to={createPageUrl('Mirrors')} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'Mirrors' 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('mirrors')}
              </Link>
              
              {isAuthenticated ? (
                <Link 
                  to={createPageUrl('Settings')} 
                  className={`text-sm font-medium transition-colors ${
                    currentPageName === 'Settings' 
                      ? 'text-emerald-400' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  {t('profile')}
                </Link>
              ) : (
                <Button
                  onClick={handleLogin}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('login')}
                </Button>
              )}
              
              <LanguageSelector currentLang={language} onLanguageChange={handleLanguageChange} />
            </div>

            {/* Mobile menu button - показывается только на маленьких экранах */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSelector currentLang={language} onLanguageChange={handleLanguageChange} />
              {isAuthenticated ? (
                <Link to={createPageUrl('Settings')}>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button onClick={handleLogin} size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <LogIn className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Контент страницы */}
      <main>
        {children}
      </main>
    </div>
  );
}