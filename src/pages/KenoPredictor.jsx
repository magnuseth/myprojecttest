import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowLeft, RotateCcw, Hash } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function KenoPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);

  const totalNumbers = 40;
  const numbersToSelect = 10;

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

  const hashSeed = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const handlePredict = () => {
    if (!clientSeed || !serverSeed) {
      alert('Пожалуйста, введите оба seed');
      return;
    }

    const combinedSeed = hashSeed(clientSeed + serverSeed);
    const allNumbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    
    const shuffled = allNumbers.sort((a, b) => {
      return seededRandom(combinedSeed + a) - seededRandom(combinedSeed + b);
    });
    
    const lucky = shuffled.slice(0, numbersToSelect).sort((a, b) => a - b);
    setLuckyNumbers(lucky);
    setIsRevealed(true);
  };

  const handleReset = () => {
    setLuckyNumbers([]);
    setIsRevealed(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Назад к выбору</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
            Keno Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            Предсказание выигрышных чисел
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Игровое поле */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 border-2 border-slate-700 shadow-2xl"
            >
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-4 border border-pink-500/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-semibold">Счастливые числа</span>
                    <span className="text-white font-bold">{luckyNumbers.length} чисел выбрано</span>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-8 gap-2 md:gap-3">
                {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((number) => (
                  <motion.div
                    key={number}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: number * 0.01 }}
                    className={`
                      aspect-square rounded-xl transition-all duration-300 flex items-center justify-center font-bold
                      ${isRevealed && luckyNumbers.includes(number)
                        ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] border-2 border-pink-400 text-white text-lg scale-110'
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 text-slate-400 text-sm'
                      }
                    `}
                  >
                    {isRevealed && luckyNumbers.includes(number) ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {number}
                      </motion.span>
                    ) : (
                      number
                    )}
                  </motion.div>
                ))}
              </div>

              {!isRevealed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-500 mt-6 text-sm"
                >
                  Введите seeds и нажмите "Предсказать" →
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Панель управления */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Параметры</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-pink-400" />
                    Client Seed
                  </label>
                  <Input
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Введите client seed"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-pink-500/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-rose-400" />
                    Server Seed
                  </label>
                  <Input
                    value={serverSeed}
                    onChange={(e) => setServerSeed(e.target.value)}
                    placeholder="Введите server seed"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500/20"
                  />
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-slate-400 text-xs mb-1">Всего чисел</div>
                      <div className="text-white text-xl font-bold">{totalNumbers}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs mb-1">Будет выбрано</div>
                      <div className="text-pink-400 text-xl font-bold">{numbersToSelect}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handlePredict}
                    disabled={isRevealed}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Предсказать
                  </Button>

                  {isRevealed && (
                    <Button
                      onClick={handleReset}
                      className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-6 rounded-xl"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Сбросить
                    </Button>
                  )}
                </div>

                <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2 text-sm">Как играть?</h3>
                  <ul className="space-y-1 text-slate-400 text-xs">
                    <li>• Выбираются 10 случайных чисел</li>
                    <li>• Из диапазона от 1 до 40</li>
                    <li>• Чем больше совпадений, тем выше выигрыш</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}