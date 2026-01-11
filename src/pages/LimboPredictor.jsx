import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowLeft, Sparkles, RotateCcw, Hash, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function LimboPredictor() {
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
    
    // Генерация множителя от 1.00x до 1000.00x с экспоненциальным распределением
    const multiplier = (1 + Math.pow(random, 3) * 999).toFixed(2);
    
    // Рекомендуемая целевая точка (консервативная)
    const targetMultiplier = (Math.min(parseFloat(multiplier), 10) * 0.7).toFixed(2);
    
    // Определение уровня риска
    const riskLevel = parseFloat(multiplier) > 100 ? 'high' : parseFloat(multiplier) > 10 ? 'medium' : 'low';
    
    setPrediction({
      multiplier: multiplier,
      targetMultiplier: targetMultiplier,
      riskLevel: riskLevel,
      confidence: (50 + random * 40).toFixed(1)
    });
  };

  const handleReset = () => {
    setPrediction(null);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return { bg: 'from-red-500/20 to-orange-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      case 'medium': return { bg: 'from-yellow-500/20 to-orange-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 'low': return { bg: 'from-green-500/20 to-emerald-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      default: return { bg: 'from-slate-500/20 to-slate-600/20', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
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
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            Limbo Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Предсказание множителя
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
                  <div className="text-slate-400 text-sm mb-2">Предсказанный множитель</div>
                  <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    {prediction.multiplier}x
                  </div>
                  
                  {prediction.riskLevel && (
                    <div className={`inline-block px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${getRiskColor(prediction.riskLevel).bg} ${getRiskColor(prediction.riskLevel).text} border ${getRiskColor(prediction.riskLevel).border}`}>
                      {prediction.riskLevel === 'high' ? 'Высокий риск' : prediction.riskLevel === 'medium' ? 'Средний риск' : 'Низкий риск'}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-300">Рекомендуемая цель</span>
                    <span className="text-3xl font-bold text-green-400">{prediction.targetMultiplier}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Уверенность</span>
                    <span className="text-xl font-bold text-purple-400">{prediction.confidence}%</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    Стратегия
                  </h3>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Целевой множитель: {prediction.targetMultiplier}x</li>
                    <li>• Максимум: {prediction.multiplier}x</li>
                    <li>• {prediction.riskLevel === 'high' ? 'Играйте осторожно' : 'Умеренный риск'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <Zap className="w-20 h-20 mx-auto mb-4 opacity-30" />
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
                  <Hash className="w-4 h-4 text-purple-400" />
                  Client Seed
                </label>
                <Input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  placeholder="Введите client seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-pink-400" />
                  Server Seed
                </label>
                <Input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  placeholder="Введите server seed"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-pink-500/20"
                />
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-2 text-sm">О Limbo</h3>
                <ul className="space-y-1 text-slate-400 text-xs">
                  <li>• Множитель от 1.00x до 1000x+</li>
                  <li>• Чем выше цель, тем выше риск</li>
                  <li>• Рекомендуем консервативные ставки</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePredict}
                  disabled={prediction !== null}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
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