import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, Clock, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { getTranslation } from '@/components/translations';

export default function Mirrors() {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => getTranslation(language, key);

  const mirrors = [
    {
      domain: 'stake1102.com',
      status: 'working',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400'
    },
    {
      domain: 'stake.us',
      status: 'update',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    {
      domain: 'stake.com',
      status: 'update',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    {
      domain: 'stake1018.com',
      status: 'update',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 -mt-20 pt-20">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <LinkIcon className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            {t('mirrors_title')}
          </h1>
          <p className="text-slate-400 text-lg">
            {t('mirrors_subtitle')}
          </p>
        </motion.div>

        {/* Важное уведомление */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{t('mirrors_notice_title')}</h3>
                <p className="text-slate-300 leading-relaxed">
                  {t('mirrors_notice_text')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Список зеркал */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mirrors.map((mirror, index) => {
            const Icon = mirror.icon;
            return (
              <motion.div
                key={mirror.domain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border-2 ${mirror.borderColor} shadow-xl hover:scale-105 transition-all duration-300 ${mirror.status === 'working' ? 'ring-2 ring-emerald-500/20' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${mirror.bgColor} p-3 rounded-xl`}>
                      <Icon className={`w-6 h-6 ${mirror.textColor}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl">{mirror.domain}</h3>
                      <p className={`text-sm ${mirror.textColor} font-semibold`}>
                        {t(`mirror_status_${mirror.status}`)}
                      </p>
                    </div>
                  </div>
                  {mirror.status === 'working' && (
                    <a
                      href={`https://${mirror.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {mirror.status === 'working' && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="font-semibold">{t('mirror_online')}</span>
                    </div>
                  </div>
                )}

                {mirror.status === 'update' && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">
                      {t('mirror_update_text')}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">{t('mirrors_info_title')}</h3>
            <div className="space-y-3 text-slate-400 text-left max-w-2xl mx-auto">
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{t('mirrors_info_1')}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{t('mirrors_info_2')}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{t('mirrors_info_3')}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}