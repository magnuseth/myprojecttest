import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Gem } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen">
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
                Mines Predictor
              </span>
            </Link>

            {/* Навигационные ссылки */}
            <div className="flex items-center gap-6">
              <Link 
                to={createPageUrl('Home')} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'Home' 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Главная
              </Link>
              <Link 
                to={createPageUrl('Predictor')} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === 'Predictor' 
                    ? 'text-emerald-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Предиктор
              </Link>
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