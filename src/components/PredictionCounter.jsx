import React from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertCircle } from 'lucide-react';

export default function PredictionCounter({ used, limit }) {
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
          <span className="text-white font-semibold">Попытки</span>
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
          <span>Осталось мало попыток! Обновите подписку</span>
        </div>
      )}
      
      {remaining === 0 && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Попытки закончились! Обновите подписку в настройках</span>
        </div>
      )}
    </motion.div>
  );
}