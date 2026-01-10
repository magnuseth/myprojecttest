import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap, Crown, Infinity } from 'lucide-react';

export default function PlanCard({ plan, isCurrentPlan, onSelect }) {
  const planIcons = {
    free: Zap,
    basic: CheckCircle,
    pro: Crown,
    unlimited: Infinity
  };

  const Icon = planIcons[plan.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`
        relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 transition-all duration-300
        ${isCurrentPlan ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-slate-700 hover:border-slate-600'}
      `}
    >
      {/* Популярный бейдж */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 rounded-full text-xs font-bold text-white">
          ПОПУЛЯРНЫЙ
        </div>
      )}

      {/* Иконка */}
      <div className={`bg-gradient-to-br ${plan.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Название плана */}
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      
      {/* Цена */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-white">${plan.price}</span>
        {plan.price > 0 && <span className="text-slate-400 ml-2">/месяц</span>}
      </div>

      {/* Описание */}
      <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

      {/* Особенности */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Кнопка */}
      <Button
        onClick={() => onSelect(plan.id)}
        disabled={isCurrentPlan}
        className={`
          w-full font-semibold py-6 rounded-xl transition-all duration-300
          ${isCurrentPlan 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30'
          }
        `}
      >
        {isCurrentPlan ? 'Текущий план' : 'Выбрать план'}
      </Button>
    </motion.div>
  );
}