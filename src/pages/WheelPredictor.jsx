import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, ArrowLeft, Sparkles, RotateCcw, Hash, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WheelPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [segments, setSegments] = useState(20);
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

    const combinedSeed = hashSeed(clientSeed + serverSeed + difficulty + segments);
    const random = seededRandom(combinedSeed);
    
    const winningSegment = Math.floor(random * segments) + 1;
    
    // Множители в зависимости от сложности
    const multipliers = {
      low: (1 + random * 5).toFixed(2),
      medium: (2 + random * 15).toFixed(2),
      high: (5 + random * 45).toFixed(2)
    };
    
    setPrediction({
      segment: winningSegment,
      multiplier: multipliers[difficulty],
      totalSegments: segments,
      confidence: (65 + random * 25).toFixed(1)
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Wheel Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Предсказание выигрышного сектора
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
                  <div className="text-slate-400 text-sm mb-2">Выигрышный сектор</div>
                  <div className="relative">
                    <div className="text-8xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      #{prediction.segment}
                    </div>
                    <div className="text-slate-500 text-sm">из {prediction.totalSegments} секторов</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
                    <div className="text-slate-300 text-sm mb-1">Множитель</div>
                    <div className="text-2xl font-bold text-indigo-400">{prediction.multiplier}x</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">Уверенность</div>
                    <div className="text-2xl font-bold text-purple-400">{prediction.confidence}%</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Информация
                  </h3>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Сложность: {difficulty}</li>
                    <li>• Всего секторов: {prediction.totalSegments}</li>
                    <li>• Шанс выигрыша: {(100 / prediction.totalSegments).toFixed(2)}%</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <Target className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p>Настройте параметры и нажмите "Предсказать"</p>
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
                  <Shield className="w-4 h-4 text-indigo-400" />
                  Сложность
                </label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкая (x1-6)</SelectItem>
                    <SelectItem value="medium">Средняя (x2-17)</SelectItem>
                    <SelectItem value="high">Высокая (x5-50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  Количество секторов
                </label>
                <Select value={segments.toString()} onValueChange={(val) => setSegments(parseInt(val))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 секторов</SelectItem>
                    <SelectItem value="20">20 секторов</SelectItem>
                    <SelectItem value="30">30 секторов</SelectItem>
                    <SelectItem value="40">40 секторов</SelectItem>
                    <SelectItem value="50">50 секторов</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-indigo-400" />
                  Client Seed
                </label>
                <Input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  placeholder="Введите client seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  Server Seed
                </label>
                <Input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  placeholder="Введите server seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePredict}
                  disabled={prediction !== null}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
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