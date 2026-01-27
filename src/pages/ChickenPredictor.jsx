import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap, Hash, Shield, Loader2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PredictionCounter from '../components/PredictionCounter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTranslation } from '@/components/translations';

export default function ChickenPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        base44.auth.redirectToLogin(window.location.href);
      } else {
        const userData = await base44.auth.me();
        setUser(userData);
      }
      
      setIsLoading(false);
    };
    checkAuth();

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email
  });

  const queryClient = useQueryClient();

  const updateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!subscription) return;
      await base44.entities.Subscription.update(subscription.id, {
        predictions_used: subscription.predictions_used + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    }
  });

  const t = (key) => getTranslation(language, key);

  const handleGetValue = async () => {
    if (subscription && subscription.predictions_used >= subscription.predictions_limit) {
      alert(t('remaining_none'));
      return;
    }

    setIsCalculating(true);
    setResult(null);

    try {
      const response = await fetch('https://aquila.cash/api/v1/prediction/chicken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSeed: clientSeed || null,
          serverSeed: serverSeed || null,
          difficulty: difficulty
        })
      });

      const data = await response.json();
      
      setTimeout(() => {
        setResult(data.result);
        setIsCalculating(false);
        updateSubscriptionMutation.mutate();
      }, 800);
      
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setIsCalculating(false);
      alert('Error getting value. Please try again.');
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('back_to_selection')}</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            🐔
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Chicken Predictor
          </h1>
          <p className="text-slate-400 text-lg mb-4">
            Значение X для следующей ставки
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">READY</span>
          </div>
        </motion.div>

        {subscription && (
          <div className="mb-8">
            <PredictionCounter 
              used={subscription.predictions_used} 
              limit={subscription.predictions_limit}
              language={language}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Display - X Value */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border-2 border-yellow-500/20 shadow-2xl min-h-[500px] flex items-center justify-center relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-50" />
              <div className="absolute top-10 right-10 text-8xl opacity-5">🐔</div>
              <div className="absolute bottom-10 left-10 text-8xl opacity-5">🐔</div>

              <div className="relative z-10 text-center w-full">
                <AnimatePresence mode="wait">
                  {isCalculating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="space-y-6"
                    >
                      <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mx-auto" />
                      <p className="text-slate-400 text-lg">Getting value...</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="space-y-6"
                    >
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="text-7xl mb-4"
                      >
                        🐔
                      </motion.div>
                      
                      <div className="space-y-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                          className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-amber-500/20 rounded-2xl p-8 border-2 border-yellow-500/40"
                        >
                          <p className="text-8xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                            x{result.toFixed(2)}
                          </p>
                        </motion.div>
                        
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-slate-400 text-lg"
                        >
                          X для ставки
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-8xl mb-6 opacity-30">🐔</div>
                      <p className="text-slate-500 text-xl">Настройте параметры</p>
                      <p className="text-slate-600 text-sm">и нажмите кнопку для получения X</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Input Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border-2 border-slate-700 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Параметры</h2>
              </div>

              <div className="space-y-6">
                {/* Difficulty */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    Difficulty
                  </label>
                  <Select value={difficulty} onValueChange={setDifficulty} disabled={isCalculating || result}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Seed */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-emerald-400" />
                    Client Seed <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <Input
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Enter client seed..."
                    disabled={isCalculating || result}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12 text-base focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Server Seed */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-400" />
                    Server Seed <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <Input
                    value={serverSeed}
                    onChange={(e) => setServerSeed(e.target.value)}
                    placeholder="Enter server seed..."
                    disabled={isCalculating || result}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12 text-base focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {!result ? (
                    <Button
                      onClick={handleGetValue}
                      disabled={isCalculating}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-7 text-lg rounded-xl shadow-lg shadow-yellow-500/30 disabled:opacity-50"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      {isCalculating ? 'Getting value...' : 'Get X Value'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReset}
                      className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold py-7 text-lg rounded-xl"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      New Request
                    </Button>
                  )}
                </div>

                {/* Info box */}
                {!result && !isCalculating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-800/30 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl">ℹ️</div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Выберите сложность и нажмите кнопку для получения значения X. Seeds опциональны.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}