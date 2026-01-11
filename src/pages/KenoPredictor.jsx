import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowLeft, RotateCcw, Hash } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PredictionCounter from '../components/PredictionCounter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTranslation } from '@/components/translations';

export default function KenoPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [luckyNumbers, setLuckyNumbers] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const queryClient = useQueryClient();

  const totalNumbers = 40;
  const numbersToSelect = 10;

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

  const handlePredict = () => {
    if (subscription && subscription.predictions_used >= subscription.predictions_limit) {
      alert(t('remaining_none'));
      return;
    }
    
    if (!clientSeed || !serverSeed) {
      alert(t('enter_seeds_predict'));
      return;
    }

    updateSubscriptionMutation.mutate();

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
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('back_to_selection')}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
            {t('keno_predictor')}
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            {t('keno_desc')}
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
                    <span className="text-pink-400 font-semibold">{t('predicted_numbers')}</span>
                    <span className="text-white font-bold">{luckyNumbers.length}</span>
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
                        ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] border-2 border-pink-400 text-white text-base md:text-lg scale-110'
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 text-slate-400 text-xs md:text-sm'
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
                  {t('enter_seeds_predict')}
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
              <h2 className="text-2xl font-bold text-white mb-6">{t('parameters')}</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-pink-400" />
                    {t('client_seed')}
                  </label>
                  <Input
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder={t('enter_client_seed')}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-pink-500/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-rose-400" />
                    {t('server_seed')}
                  </label>
                  <Input
                    value={serverSeed}
                    onChange={(e) => setServerSeed(e.target.value)}
                    placeholder={t('enter_server_seed')}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-rose-500 focus:ring-rose-500/20"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handlePredict}
                    disabled={isRevealed}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('predict')}
                  </Button>

                  {isRevealed && (
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
    </div>
  );
}