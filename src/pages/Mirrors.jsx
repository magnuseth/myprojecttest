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
    },
    {
      domain: 'stake1181.com',
      status: 'update',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    {
      domain: 'stake1011.com',
      status: 'update',
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
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
          <div className="relative bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 animate-pulse" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30">
                <AlertCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                  {t('mirrors_notice_title')}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Important
                  </span>
                </h3>
                <p className="text-slate-300 leading-relaxed text-base">
                  {t('mirrors_notice_text')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Список зеркал */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mirrors.map((mirror, index) => {
            const Icon = mirror.icon;
            return (
              <motion.div
                key={mirror.domain}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index, type: "spring", stiffness: 100 }}
                className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border-2 ${mirror.borderColor} shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 overflow-hidden group ${mirror.status === 'working' ? 'ring-2 ring-emerald-500/20' : ''}`}
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mirror.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -translate-y-16 translate-x-16" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${mirror.bgColor} p-3 rounded-xl shadow-lg backdrop-blur-sm border ${mirror.borderColor}`}>
                        <Icon className={`w-6 h-6 ${mirror.textColor}`} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{mirror.domain}</h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${mirror.bgColor} border ${mirror.borderColor}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${mirror.status === 'working' ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
                          <span className={`text-xs ${mirror.textColor} font-semibold uppercase tracking-wide`}>
                            {t(`mirror_status_${mirror.status}`)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {mirror.status === 'working' && (
                      <a
                        href={`https://${mirror.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 group/link"
                      >
                        <ExternalLink className="w-5 h-5 group-hover/link:rotate-12 transition-transform" />
                      </a>
                    )}
                  </div>

                  {mirror.status === 'working' && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                          <div className="relative">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                          </div>
                          <span className="font-semibold">{t('mirror_online')}</span>
                        </div>
                        <div className="text-xs text-emerald-400/60 font-medium">Active Now</div>
                      </div>
                    </div>
                  )}

                  {mirror.status === 'update' && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {t('mirror_update_text')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 border-2 border-slate-700 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">{t('mirrors_info_title')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{t('mirrors_info_1')}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-teal-500/50 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="bg-teal-500/20 p-2 rounded-lg border border-teal-500/30 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-teal-400" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{t('mirrors_info_2')}</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-cyan-500/50 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-cyan-400" />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{t('mirrors_info_3')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}