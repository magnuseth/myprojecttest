import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dices, ArrowLeft, Sparkles, RotateCcw, Hash } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DicePredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [prediction, setPrediction] = useState(null);

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
    const random = seededRandom(combinedSeed);
    
    // Генерация результата от 0.00 до 100.00
    const result = (random * 100).toFixed(2);
    
    // Определение зоны (Over/Under)
    const isOver50 = parseFloat(result) > 50;
    
    setPrediction({
      result: result,
      zone: isOver50 ? 'Over 50' : 'Under 50',
      multiplier: (1 + random * 1.5).toFixed(2),
      confidence: (60 + random * 30).toFixed(1)
    });
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Dice Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Dices className="w-5 h-5 text-blue-400" />
            Предсказание результата броска
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Результат */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
          >
            {prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-2">Предсказанный результат</div>
                  <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    {prediction.result}
                  </div>
                  <div className={`inline-block px-6 py-3 rounded-xl font-bold text-lg ${
                    prediction.zone === 'Over 50' 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {prediction.zone}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-400 text-sm mb-1">Множитель</div>
                    <div className="text-2xl font-bold text-blue-400">{prediction.multiplier}x</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-400 text-sm mb-1">Уверенность</div>
                    <div className="text-2xl font-bold text-cyan-400">{prediction.confidence}%</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Рекомендация
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {prediction.zone === 'Over 50' 
                      ? 'Ставьте на Over 50 для оптимальной прибыли'
                      : 'Ставьте на Under 50 для безопасной игры'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <Dices className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p>Введите seeds и нажмите "Предсказать"</p>
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
                  <Hash className="w-4 h-4 text-blue-400" />
                  Client Seed
                </label>
                <Input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  placeholder="Введите client seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  Server Seed
                </label>
                <Input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  placeholder="Введите server seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2 text-sm">Как это работает?</h3>
                <ul className="space-y-1 text-slate-400 text-xs">
                  <li>• Результат от 0.00 до 100.00</li>
                  <li>• Over 50: результат выше 50</li>
                  <li>• Under 50: результат ниже 50</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePredict}
                  disabled={prediction !== null}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Предсказать
                </Button>

                {prediction && (
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