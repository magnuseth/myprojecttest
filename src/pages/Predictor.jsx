import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Gem, Zap, Target, Dices, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Predictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        base44.auth.redirectToLogin(window.location.href);
      }
      
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const predictors = [
    {
      id: 'mines',
      name: 'Mines',
      description: 'Предсказание безопасных ячеек на поле с минами',
      icon: Gem,
      color: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
      page: 'MinesPredictor'
    },
    {
      id: 'crash',
      name: 'Crash',
      description: 'Предсказание точки краха и оптимальный момент выхода',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgGlow: 'bg-orange-500/10',
      page: 'CrashPredictor'
    },
    {
      id: 'chicken',
      name: 'Chicken',
      description: 'Предсказание безопасных клеток с выбором сложности',
      icon: Target,
      color: 'from-yellow-500 to-orange-500',
      bgGlow: 'bg-yellow-500/10',
      page: 'ChickenPredictor'
    },
    {
      id: 'dice',
      name: 'Dice',
      description: 'Предсказание результата броска кубика',
      icon: Dices,
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/10',
      page: 'DicePredictor'
    },
    {
      id: 'limbo',
      name: 'Limbo',
      description: 'Предсказание множителя для игры Limbo',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/10',
      page: 'LimboPredictor'
    },
    {
      id: 'wheel',
      name: 'Wheel',
      description: 'Предсказание выигрышного сектора колеса фортуны',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
      bgGlow: 'bg-indigo-500/10',
      page: 'WheelPredictor'
    },
    {
      id: 'flip',
      name: 'Flip',
      description: 'Предсказание результата подбрасывания монеты',
      icon: Gem,
      color: 'from-slate-500 to-gray-500',
      bgGlow: 'bg-slate-500/10',
      page: 'FlipPredictor'
    },
    {
      id: 'keno',
      name: 'Keno',
      description: 'Предсказание выигрышных чисел в игре Keno',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-500/10',
      page: 'KenoPredictor'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 -mt-20 pt-20">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Выберите предиктор
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Профессиональные инструменты для предсказаний
          </p>
        </motion.div>

        {/* Сетка предикторов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictors.map((predictor, index) => {
            const Icon = predictor.icon;
            return (
              <motion.div
                key={predictor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={createPageUrl(predictor.page)}>
                  <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
                    {/* Фоновое свечение */}
                    <div className={`absolute inset-0 ${predictor.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Контент */}
                    <div className="relative z-10">
                      {/* Иконка */}
                      <div className={`bg-gradient-to-br ${predictor.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Название */}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                        {predictor.name}
                      </h3>

                      {/* Описание */}
                      <p className="text-slate-400 mb-6 leading-relaxed">
                        {predictor.description}
                      </p>

                      {/* Кнопка */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold bg-gradient-to-r ${predictor.color} bg-clip-text text-transparent`}>
                          Запустить
                        </span>
                        <ChevronRight className={`w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </div>

                    {/* Декоративные элементы */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-slate-600 text-sm"
        >
          <p>💡 Все предикторы используют провабли фейр систему с поддержкой custom seeds</p>
        </motion.div>
      </div>
    </div>
  );
}