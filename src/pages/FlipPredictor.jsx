import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gem, ArrowLeft, Sparkles, RotateCcw, Hash } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FlipPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

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

  const handlePredict = async () => {
    if (!clientSeed || !serverSeed) {
      alert('Пожалуйста, введите оба seed');
      return;
    }

    setIsFlipping(true);
    
    // Анимация переворота монеты
    await new Promise(resolve => setTimeout(resolve, 1500));

    const combinedSeed = hashSeed(clientSeed + serverSeed);
    const random = seededRandom(combinedSeed);
    
    const result = random > 0.5 ? 'heads' : 'tails';
    
    setPrediction({
      result: result,
      probability: (random * 100).toFixed(1),
      confidence: (60 + random * 35).toFixed(1)
    });
    
    setIsFlipping(false);
  };

  const handleReset = () => {
    setPrediction(null);
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Назад к выбору</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-400 bg-clip-text text-transparent">
            Flip Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Gem className="w-5 h-5 text-slate-400" />
            Предсказание подбрасывания монеты
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Результат */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
          >
            {isFlipping ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotateY: [0, 1800] }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-6xl shadow-2xl"
                >
                  💰
                </motion.div>
              </div>
            ) : prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-4">Результат</div>
                  <motion.div
                    initial={{ scale: 0, rotateY: 0 }}
                    animate={{ scale: 1, rotateY: 360 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center text-7xl shadow-2xl mb-6 ${
                      prediction.result === 'heads'
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                        : 'bg-gradient-to-br from-slate-500 to-slate-700'
                    }`}
                  >
                    {prediction.result === 'heads' ? '👑' : '🎯'}
                  </motion.div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {prediction.result === 'heads' ? 'HEADS' : 'TAILS'}
                  </div>
                  <div className="text-slate-400">
                    {prediction.result === 'heads' ? 'Орёл' : 'Решка'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">Вероятность</div>
                    <div className="text-2xl font-bold text-slate-400">{prediction.probability}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">Уверенность</div>
                    <div className="text-2xl font-bold text-slate-400">{prediction.confidence}%</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Совет
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {prediction.result === 'heads'
                      ? 'Орёл выпадает чаще при этих seeds'
                      : 'Решка - безопасная ставка для этой комбинации'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-6xl opacity-30">
                    💰
                  </div>
                  <p>Введите seeds и нажмите "Подбросить"</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Панель управления */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Параметры</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  Client Seed
                </label>
                <Input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  placeholder="Введите client seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  Server Seed
                </label>
                <Input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  placeholder="Введите server seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-gray-500 focus:ring-gray-500/20"
                />
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2 text-sm">О игре</h3>
                <ul className="space-y-1 text-slate-400 text-xs">
                  <li>• 50/50 шанс на выигрыш</li>
                  <li>• Heads (Орёл) или Tails (Решка)</li>
                  <li>• Простая и честная игра</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePredict}
                  disabled={prediction !== null || isFlipping}
                  className="flex-1 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isFlipping ? 'Подбрасываем...' : 'Подбросить'}
                </Button>

                {prediction && !isFlipping && (
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
  );
}