import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, ArrowLeft, Sparkles, RotateCcw, Hash, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ChickenPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [safeCells, setSafeCells] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);

  const gridSizes = {
    easy: 16,
    medium: 20,
    hard: 25,
    expert: 30
  };

  const bonesCounts = {
    easy: 3,
    medium: 5,
    hard: 8,
    expert: 12
  };

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

    const totalCells = gridSizes[difficulty];
    const bonesCount = bonesCounts[difficulty];
    const safeCount = totalCells - bonesCount;
    
    const combinedSeed = hashSeed(clientSeed + serverSeed + difficulty);
    const allCells = Array.from({ length: totalCells }, (_, i) => i);
    
    const shuffled = allCells.sort((a, b) => {
      return seededRandom(combinedSeed + a) - seededRandom(combinedSeed + b);
    });
    
    const safe = shuffled.slice(0, safeCount);
    setSafeCells(safe);
    setIsRevealed(true);
  };

  const handleReset = () => {
    setSafeCells([]);
    setIsRevealed(false);
  };

  const getGridCols = () => {
    const cols = {
      easy: 4,
      medium: 5,
      hard: 5,
      expert: 6
    };
    return cols[difficulty];
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Chicken Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Предсказание безопасных клеток
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
                  className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">Сложность: {difficulty}</span>
                    <span className="text-white font-bold">{safeCells.length} безопасных клеток</span>
                  </div>
                </motion.div>
              )}

              <div className={`grid gap-2 md:gap-3`} style={{ gridTemplateColumns: `repeat(${getGridCols()}, 1fr)` }}>
                {Array.from({ length: gridSizes[difficulty] }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`
                      aspect-square rounded-xl transition-all duration-300
                      ${isRevealed && safeCells.includes(index)
                        ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.5)] border-2 border-yellow-400'
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700'
                      }
                      flex items-center justify-center
                    `}
                  >
                    {isRevealed && safeCells.includes(index) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <Target className="w-6 h-6 text-white drop-shadow-lg" />
                      </motion.div>
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
                  Выберите сложность и нажмите "Предсказать" →
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
                    <Shield className="w-4 h-4 text-yellow-400" />
                    Сложность
                  </label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (4x4, 3 кости)</SelectItem>
                      <SelectItem value="medium">Medium (5x4, 5 костей)</SelectItem>
                      <SelectItem value="hard">Hard (5x5, 8 костей)</SelectItem>
                      <SelectItem value="expert">Expert (6x5, 12 костей)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-yellow-400" />
                    Client Seed
                  </label>
                  <Input
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Введите client seed"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-yellow-500/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-orange-400" />
                    Server Seed
                  </label>
                  <Input
                    value={serverSeed}
                    onChange={(e) => setServerSeed(e.target.value)}
                    placeholder="Введите server seed"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handlePredict}
                    disabled={isRevealed}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}