import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, CreditCard, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileSection from '../components/settings/ProfileSection';
import PlanCard from '../components/settings/PlanCard';
import { toast } from 'sonner';

export default function Settings() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  // Загрузка пользователя
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
      }
    };
    loadUser();
  }, []);

  // Загрузка подписки
  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: () => base44.entities.Subscription.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const currentSubscription = subscriptions[0];

  // Планы
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Идеально для начала',
      color: 'from-slate-600 to-slate-700',
      features: [
        '10 предсказаний в день',
        'Базовые настройки',
        'Стандартная поддержка'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      description: 'Для регулярного использования',
      color: 'from-blue-500 to-blue-600',
      popular: false,
      features: [
        '100 предсказаний в день',
        'Все настройки',
        'Приоритетная поддержка',
        'Статистика использования'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      description: 'Для профессионалов',
      color: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        '500 предсказаний в день',
        'Все функции Basic',
        'Расширенная аналитика',
        'API доступ',
        'VIP поддержка 24/7'
      ]
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 99,
      description: 'Без ограничений',
      color: 'from-emerald-500 to-teal-500',
      features: [
        '∞ Неограниченные предсказания',
        'Все функции Pro',
        'Белый список IP',
        'Персональный менеджер',
        'Кастомные интеграции'
      ]
    }
  ];

  // Обновление плана
  const updatePlanMutation = useMutation({
    mutationFn: async (planId) => {
      const limits = {
        free: 10,
        basic: 100,
        pro: 500,
        unlimited: 999999
      };

      if (currentSubscription) {
        return base44.entities.Subscription.update(currentSubscription.id, {
          plan: planId,
          predictions_limit: limits[planId],
          predictions_used: 0,
          is_active: true
        });
      } else {
        return base44.entities.Subscription.create({
          user_email: user.email,
          plan: planId,
          predictions_limit: limits[planId],
          predictions_used: 0,
          is_active: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('План успешно обновлён!');
    },
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-10 h-10 text-emerald-400" />
            Настройки
          </h1>
          <p className="text-slate-400 text-lg">Управление профилем и подпиской</p>
        </motion.div>

        {/* Статус подписки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">
                Текущий план: <span className="text-emerald-400">{currentSubscription?.plan?.toUpperCase() || 'FREE'}</span>
              </h3>
              <p className="text-slate-300">
                Использовано: {currentSubscription?.predictions_used || 0} / {currentSubscription?.predictions_limit || 10} предсказаний
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">
                {currentSubscription?.predictions_limit && currentSubscription.predictions_used 
                  ? Math.round((currentSubscription.predictions_used / currentSubscription.predictions_limit) * 100)
                  : 0}% использовано
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Профиль */}
          <div className="lg:col-span-1">
            <ProfileSection 
              user={user} 
              onUpdate={async () => {
                const userData = await base44.auth.me();
                setUser(userData);
              }} 
            />

            {/* Кнопка выхода */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold py-6 rounded-xl"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти из аккаунта
              </Button>
            </motion.div>
          </div>

          {/* Планы */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-emerald-400" />
                Планы и подписка
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={currentSubscription?.plan === plan.id || (!currentSubscription && plan.id === 'free')}
                    onSelect={(planId) => updatePlanMutation.mutate(planId)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-600 text-sm"
        >
          <p>💡 Лимиты обновляются ежедневно в 00:00 UTC</p>
        </motion.div>
      </div>
    </div>
  );
}