import React from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertCircle } from 'lucide-react';

export default function PredictionCounter({ used, limit, language = 'en' }) {
  const t = (key) => {
    const translations = {
      en: {
        attempts: 'Attempts',
        remaining_low: 'Few attempts left! Upgrade subscription',
        remaining_none: 'Attempts finished! Upgrade in settings'
      },
      ru: {
        attempts: 'Попытки',
        remaining_low: 'Осталось мало попыток! Обновите подписку',
        remaining_none: 'Попытки закончились! Обновите подписку в настройках'
      },
      es: {
        attempts: 'Intentos',
        remaining_low: '¡Pocos intentos restantes! Actualice suscripción',
        remaining_none: '¡Intentos agotados! Actualice en configuración'
      },
      pt: {
        attempts: 'Tentativas',
        remaining_low: 'Poucas tentativas restantes! Atualize assinatura',
        remaining_none: 'Tentativas esgotadas! Atualize nas configurações'
      },
      tr: {
        attempts: 'Denemeler',
        remaining_low: 'Az deneme kaldı! Aboneliği yükseltin',
        remaining_none: 'Denemeler bitti! Ayarlardan yükseltin'
      },
      hi: {
        attempts: 'प्रयास',
        remaining_low: 'कुछ प्रयास शेष! सदस्यता अपग्रेड करें',
        remaining_none: 'प्रयास समाप्त! सेटिंग में अपग्रेड करें'
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };
  const remaining = limit - used;
  const percentage = (remaining / limit) * 100;
  
  const getColor = () => {
    if (percentage > 50) return 'from-emerald-500 to-teal-500';
    if (percentage > 20) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border-2 border-slate-700 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-semibold">{t('attempts')}</span>
        </div>
        <span className={`text-2xl font-bold bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}>
          {remaining}/{limit}
        </span>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
        />
      </div>
      
      {remaining <= 3 && remaining > 0 && (
        <div className="flex items-center gap-2 mt-3 text-orange-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{t('remaining_low')}</span>
        </div>
      )}
      
      {remaining === 0 && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{t('remaining_none')}</span>
        </div>
      )}
    </motion.div>
  );
}