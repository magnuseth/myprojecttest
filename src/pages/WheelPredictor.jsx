import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, ArrowLeft, Sparkles, RotateCcw, Hash, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PredictionCounter from '../components/PredictionCounter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTranslation } from '@/components/translations';

export default function WheelPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [segments, setSegments] = useState(20);
  const [prediction, setPrediction] = useState(null);
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
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 pb-12">
      <div className="max-w-5xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('back_to_selection')}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('wheel_predictor')}
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            {t('wheel_desc')}
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
            {prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-slate-400 text-sm mb-2">{t('winning_segment')}</div>
                  <div className="relative">
                    <div className="text-8xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      #{prediction.segment}
                    </div>
                    <div className="text-slate-500 text-sm">{t('segments')}: {prediction.totalSegments}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
                    <div className="text-slate-300 text-sm mb-1">{t('multiplier')}</div>
                    <div className="text-2xl font-bold text-indigo-400">{prediction.multiplier}x</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-300 text-sm mb-1">{t('confidence')}</div>
                    <div className="text-2xl font-bold text-purple-400">{prediction.confidence}%</div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    {t('settings')}
                  </h3>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• {t('risk_level')}: {t(difficulty + '_risk')}</li>
                    <li>• {t('segments')}: {prediction.totalSegments}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500">
                  <Target className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p>{t('configure_predict')}</p>
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
                  <Shield className="w-4 h-4 text-indigo-400" />
                  {t('risk_level')}
                </label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('low_risk')} (x1-6)</SelectItem>
                    <SelectItem value="medium">{t('medium_risk')} (x2-17)</SelectItem>
                    <SelectItem value="high">{t('high_risk')} (x5-50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  {t('segments')}
                </label>
                <Select value={segments.toString()} onValueChange={(val) => setSegments(parseInt(val))}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-indigo-400" />
                  {t('client_seed')}
                </label>
                <Input
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  placeholder={t('enter_client_seed')}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  {t('server_seed')}
                </label>
                <Input
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  placeholder={t('enter_server_seed')}
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
                  {t('predict')}
                </Button>

                {prediction && (
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