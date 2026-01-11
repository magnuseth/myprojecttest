import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Sparkles, Zap, Shield, TrendingUp, Users, Trophy, ArrowRight, Gem, CheckCircle, LogIn, UserPlus, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Молниеносная скорость',
      description: 'Мгновенная генерация предсказаний без задержек'
    },
    {
      icon: Shield,
      title: 'Провабли фейр',
      description: 'Используйте собственные seeds для проверяемых результатов'
    },
    {
      icon: TrendingUp,
      title: 'Высокая точность',
      description: 'Алгоритм с оптимизированной генерацией безопасных зон'
    },
    {
      icon: Gem,
      title: '8 игр доступно',
      description: 'Mines, Crash, Chicken, Dice, Limbo, Wheel, Flip, Keno'
    }
  ];

  const stats = [
    { value: '150K+', label: 'Предсказаний' },
    { value: '99.9%', label: 'Uptime' },
    { value: '12K+', label: 'Пользователей' },
    { value: '8', label: 'Игр' }
  ];

  const games = [
    { name: 'Mines', icon: '💎' },
    { name: 'Crash', icon: '📈' },
    { name: 'Chicken', icon: '🎯' },
    { name: 'Dice', icon: '🎲' },
    { name: 'Limbo', icon: '⚡' },
    { name: 'Wheel', icon: '🎡' },
    { name: 'Flip', icon: '🪙' },
    { name: 'Keno', icon: '✨' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative">
        {/* Hero секция */}
        <section className="px-4 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Бейдж */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full px-6 py-2 mb-8"
              >
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">Лучший предиктор для Stake 2026</span>
              </motion.div>

              {/* Заголовок */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Stake Prediction
                </span>
                <br />
                <span className="text-white">Лучший AI предиктор</span>
              </motion.h1>

              {/* Описание */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Профессиональный инструмент для предсказания результатов на Stake.
                <br />
                <span className="text-emerald-400">8 игр</span> с провабли фейр системой и поддержкой custom seeds.
              </motion.p>

              {/* CTA кнопки */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {isAuthenticated ? (
                  <>
                    <Link to={createPageUrl('Predictor')}>
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-8 py-7 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group">
                        Начать предсказание
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to={createPageUrl('FAQ')}>
                      <Button variant="outline" className="border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold text-lg px-8 py-7 rounded-xl backdrop-blur-sm">
                        <HelpCircle className="mr-2 w-5 h-5" />
                        Как это работает?
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => base44.auth.redirectToLogin(window.location.origin + createPageUrl('Predictor'))}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-8 py-7 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group"
                    >
                      <LogIn className="mr-2 w-5 h-5" />
                      Войти / Регистрация
                    </Button>
                    <Link to={createPageUrl('FAQ')}>
                      <Button variant="outline" className="border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold text-lg px-8 py-7 rounded-xl backdrop-blur-sm">
                        <HelpCircle className="mr-2 w-5 h-5" />
                        Узнать больше
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Статистика */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Доступные игры */}
        <section className="px-4 py-20 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Доступные игры
              </h2>
              <p className="text-slate-400 text-lg">
                8 популярных игр Stake с AI предсказанием
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 text-center group cursor-pointer"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{game.icon}</div>
                  <div className="text-white font-semibold">{game.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Почему выбирают нас?
              </h2>
              <p className="text-slate-400 text-lg">
                Профессиональные инструменты для максимальной эффективности
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 group"
                >
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Провабли фейр */}
        <section className="px-4 py-20 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl p-8 md:p-12 border border-emerald-500/30 text-center"
            >
              <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                100% Провабли фейр
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Полная прозрачность генерации. Используйте собственные client и server seeds 
                для проверяемых результатов. Каждое предсказание можно воспроизвести.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {['Открытый алгоритм', 'Проверяемость', 'Честность'].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Готовы начать?
              </h2>
              <p className="text-slate-400 text-xl mb-8">
                Присоединяйтесь к тысячам пользователей уже сейчас
              </p>
              {isAuthenticated ? (
                <Link to={createPageUrl('Predictor')}>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-10 py-7 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group">
                    Запустить предиктор
                    <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin(window.location.origin + createPageUrl('Predictor'))}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-10 py-7 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group"
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Начать бесплатно
                </Button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Социальные сети */}
        <section className="px-4 py-12 border-t border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Присоединяйтесь к нашему сообществу</h3>
              <p className="text-slate-400">Получайте обновления и общайтесь с другими пользователями</p>
            </div>
            <div className="flex justify-center gap-6">
              <motion.a
                href="https://discord.gg/stakeprediction"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Discord</span>
              </motion.a>
              <motion.a
                href="https://youtube.com/@stakeprediction"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </motion.a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
            <p>© 2026 Stake Prediction. Все права защищены.</p>
            <p className="mt-2">⚠️ Для развлекательных целей. Играйте ответственно.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}