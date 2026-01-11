import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gem, ArrowLeft, Sparkles, RotateCcw, Hash } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PredictionCounter from '../components/PredictionCounter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTranslation } from '@/components/translations';

export default function FlipPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const queryClient = useQueryClient();

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
    if (subscription && subscription.predictions_used >= subscription.predictions_limit) {
      alert(t('remaining_none'));
      return;
    }
    
    if (!clientSeed || !serverSeed) {
      alert(t('enter_seeds_predict'));
      return;
    }

    updateSubscriptionMutation.mutate();
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
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 pb-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('back_to_selection')}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-400 bg-clip-text text-transparent">
            {t('flip_predictor')}
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Gem className="w-5 h-5 text-slate-400" />
            {t('flip_desc')}
          </p>
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
          {/* Результат */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
          >
            {isFlipping ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-6xl shadow-2xl"
                >
                  💰
                </motion.div>
              </div>
            ) : prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-4">{t('result')}</div>
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
                    {prediction.result === 'heads' ? t('heads') : t('tails')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">{t('probability')}</div>
                    <div className="text-2xl font-bold text-slate-400">{prediction.probability}%</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">{t('confidence')}</div>
                    <div className="text-2xl font-bold text-slate-400">{prediction.confidence}%</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    {t('recommendations')}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {prediction.result === 'heads' ? t('heads') : t('tails')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-6xl opacity-30">
                    💰
                  </div>
                  <p>{t('enter_seeds_predict')}</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">{t('parameters')}</h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  {t('client_seed')}
                </label>
                <Input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  placeholder={t('enter_client_seed')}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-slate-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  {t('server_seed')}
                </label>
                <Input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  placeholder={t('enter_server_seed')}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-gray-500 focus:ring-gray-500/20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePredict}
                  disabled={prediction !== null || isFlipping}
                  className="flex-1 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isFlipping ? t('loading') : t('predict')}
                </Button>

                {prediction && !isFlipping && (
                  <Button
                    onClick={handleReset}
                    className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-6 rounded-xl"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {t('reset')}
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