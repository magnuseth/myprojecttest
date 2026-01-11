import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles, Shield, Zap, CheckCircle, PlayCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getTranslation } from '@/components/translations';

export default function FAQ() {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => getTranslation(language, key);
  const faqs = [
    {
      question: 'Что такое Stake Prediction?',
      answer: 'Stake Prediction - это профессиональный AI инструмент для предсказания результатов в популярных играх на Stake.com. Мы используем провабли фейр систему с поддержкой custom seeds для генерации предсказаний.'
    },
    {
      question: 'Как работает система предсказаний?',
      answer: 'Наша система использует криптографические алгоритмы для генерации предсказаний на основе client seed и server seed. Это обеспечивает полную прозрачность и проверяемость каждого результата. Вы можете использовать свои собственные seeds или генерировать случайные.'
    },
    {
      question: 'Какие игры поддерживаются?',
      answer: 'Мы поддерживаем 8 популярных игр: Mines (поиск безопасных ячеек), Crash (предсказание точки краха), Chicken (безопасные клетки), Dice (результат броска), Limbo (множитель), Wheel (выигрышный сектор), Flip (подбрасывание монеты), и Keno (выигрышные числа).'
    },
    {
      question: 'Что такое провабли фейр система?',
      answer: 'Провабли фейр (Provably Fair) - это система, которая позволяет проверить честность каждого результата. Используя client seed и server seed, вы можете самостоятельно воспроизвести и проверить любое предсказание. Это гарантирует полную прозрачность и отсутствие манипуляций.'
    },
    {
      question: 'Как использовать seeds?',
      answer: 'Seeds - это уникальные строки, которые используются для генерации результатов. Client seed вы можете установить сами (или использовать случайный), а server seed обычно берется из игры на Stake. Комбинация этих seeds определяет результат предсказания. Вы можете использовать те же seeds что и в игре для проверки.'
    },
    {
      question: 'Сколько стоит использование?',
      answer: 'У нас есть бесплатный план с 10 попытками для начинающих. Для более активного использования доступны платные планы: Basic (50 попыток), Pro (200 попыток) и Unlimited (неограниченно). Все планы включают доступ ко всем 8 играм.'
    },
    {
      question: 'Гарантирует ли это выигрыш?',
      answer: 'Нет, Stake Prediction - это инструмент для предсказаний, но не гарантирует 100% выигрыш. Результаты в играх зависят от множества факторов. Используйте наш сервис ответственно и только для развлечения. Никогда не ставьте больше, чем можете позволить себе потерять.'
    },
    {
      question: 'Как работает счетчик попыток?',
      answer: 'Каждое предсказание расходует одну попытку из вашего лимита. Лимит зависит от вашего плана подписки. Попытки обновляются ежемесячно. Вы всегда можете видеть оставшиеся попытки в интерфейсе предиктора.'
    },
    {
      question: 'Можно ли использовать на мобильных устройствах?',
      answer: 'Да! Stake Prediction полностью адаптирован для мобильных устройств. Вы можете использовать все функции на смартфоне или планшете через браузер.'
    },
    {
      question: 'Как получить поддержку?',
      answer: 'Присоединяйтесь к нашему Discord серверу для получения помощи от сообщества и команды поддержки. Также вы можете посмотреть обучающие видео на нашем YouTube канале.'
    }
  ];

  return (
    <div className="p-4 md:p-8 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            {t('faq_title')}
          </h1>
          <p className="text-slate-400 text-lg">
            {t('faq_subtitle')}
          </p>
        </motion.div>

        {/* Видео секция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <PlayCircle className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">{t('video_tutorial')}</h2>
            </div>
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-700">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Stake Prediction Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-slate-400 text-sm mt-4">
              {t('watch_video')}
            </p>
          </div>
        </motion.div>

        {/* Ключевые особенности */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            { icon: Shield, title: t('feature_provably_fair'), desc: t('feature_provably_fair_desc') },
            { icon: Zap, title: t('feature_8_games'), desc: t('feature_8_games_desc') },
            { icon: Sparkles, title: t('feature_instant'), desc: t('feature_instant_desc') }
          ].map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
              <feature.icon className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* FAQ список */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-slate-700">
                <AccordionTrigger className="text-left text-white hover:text-emerald-400 transition-colors">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pl-8 pr-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Поддержка */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-emerald-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">{t('need_help')}</h3>
            <p className="text-slate-400 mb-6">
              {t('join_community')}
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://discord.gg/stakeprediction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Discord
              </a>
              <a
                href="https://youtube.com/@stakeprediction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}