import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { User, Zap, TrendingUp, LogOut, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { getTranslation } from '@/components/translations';

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => getTranslation(language, key);

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: () => base44.entities.Subscription.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const currentSubscription = subscriptions[0];

  const packs = [
    {
      id: 'basic',
      name: t('starter_pack'),
      price: 249,
      attempts: 50,
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'bg-blue-500/10',
      icon: Zap,
      description: t('one_time_purchase')
    },
    {
      id: 'pro',
      name: t('professional_pack'),
      price: 999,
      attempts: 250,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-500/10',
      icon: TrendingUp,
      popular: true,
      description: t('one_time_purchase')
    },
    {
      id: 'high_roller',
      name: t('high_roller_pack'),
      price: 9999,
      attempts: 1000,
      color: 'from-emerald-500 to-teal-500',
      bgGlow: 'bg-emerald-500/10',
      icon: Sparkles,
      description: t('one_time_purchase')
    }
  ];

  const handleBuyPack = (pack) => {
    navigate(createPageUrl(`CryptoPayment?pack=${pack.id}&price=${pack.price}&attempts=${pack.attempts}`));
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <User className="w-10 h-10 text-emerald-400" />
            {t('profile_title')}
          </h1>
          <p className="text-slate-400 text-lg">{t('manage_account')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-slate-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{user.full_name || 'User'}</h3>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400 text-sm">{t('email_address')}</span>
                  <span className="text-white text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400 text-sm">Role</span>
                  <span className="text-emerald-400 text-sm font-medium capitalize">{user.role}</span>
                </div>
              </div>
            </motion.div>

            {/* Attempts Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border-2 border-emerald-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-emerald-400" />
                <h3 className="text-white font-bold text-lg">{t('attempts_balance')}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-300 text-sm">{t('attempts_used')}</span>
                  <span className="text-3xl font-bold text-white">
                    {currentSubscription?.predictions_used || 0}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentSubscription ? (currentSubscription.predictions_used / currentSubscription.predictions_limit) * 100 : 0}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
                <p className="text-slate-400 text-xs">
                  {currentSubscription?.predictions_limit || 0} {t('attempts_count')} {t('total_cells')}
                </p>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold py-6 rounded-xl"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t('logout_account')}
              </Button>
            </motion.div>
          </div>

          {/* Buy Attempts Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">{t('buy_attempts')}</h2>
              </div>
              <p className="text-slate-400 mb-8">{t('purchase_attempts')}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packs.map((pack, index) => {
                  const Icon = pack.icon;
                  return (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-2 ${
                        pack.popular ? 'border-purple-500/50 ring-2 ring-purple-500/20' : 'border-slate-700'
                      } hover:scale-105 transition-all duration-300 overflow-hidden group`}
                    >
                      {pack.popular && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          POPULAR
                        </div>
                      )}

                      <div className={`absolute inset-0 ${pack.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      
                      <div className="relative z-10">
                        <div className={`bg-gradient-to-br ${pack.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <h3 className="text-white font-bold text-xl mb-2">{pack.name}</h3>
                        <p className="text-slate-400 text-sm mb-4">{pack.description}</p>
                        
                        <div className="mb-6">
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-4xl font-bold text-white">${pack.price}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">
                              {pack.attempts} {t('attempts_count')}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleBuyPack(pack)}
                          className={`w-full bg-gradient-to-r ${pack.color} hover:opacity-90 text-white font-bold py-6 rounded-xl shadow-lg transition-all`}
                        >
                          {t('buy_now')}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}