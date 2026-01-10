import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Sparkles, Zap, Shield, TrendingUp, Users, Trophy, ArrowRight, Gem, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
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
      title: 'Гибкие настройки',
      description: 'Настройка количества мин от 1 до 24 для любой стратегии'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Предсказаний' },
    { value: '99.9%', label: 'Uptime' },
    { value: '5K+', label: 'Пользователей' },
    { value: '#1', label: 'Рейтинг' }
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
                <span className="text-emerald-400 font-semibold text-sm">Лучший предиктор 2024</span>
              </motion.div>

              {/* Заголовок */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Самый точный
                </span>
                <br />
                <span className="text-white">Mines Predictor</span>
              </motion.h1>

              {/* Описание */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Профессиональный инструмент для генерации безопасных ячеек.
                <br />
                <span className="text-emerald-400">Провабли фейр система</span> с поддержкой custom seeds.
              </motion.p>

              {/* CTA кнопки */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to={createPageUrl('Predictor')}>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-8 py-7 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group">
                    Начать предсказание
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button variant="outline" className="border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold text-lg px-8 py-7 rounded-xl backdrop-blur-sm">
                  Как это работает?
                </Button>
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

        {/* Преимущества */}
        <section className="px-4 py-20 bg-slate-900/50">
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

        {/* Как это работает */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Простота использования
              </h2>
              <p className="text-slate-400 text-lg">
                Всего три шага до результата
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Настройте параметры', desc: 'Выберите количество мин и введите seeds (опционально)' },
                { step: '02', title: 'Нажмите предсказать', desc: 'Алгоритм мгновенно сгенерирует безопасные позиции' },
                { step: '03', title: 'Используйте результат', desc: 'Зелёные ячейки — ваши безопасные зоны' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                  )}
                  
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
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
              <Link to={createPageUrl('Predictor')}>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg px-10 py-7 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group">
                  Запустить предиктор
                  <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-slate-600 text-sm">
            <p>© 2024 Mines Predictor. Все права защищены.</p>
            <p className="mt-2">⚠️ Для развлекательных целей. Играйте ответственно.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}