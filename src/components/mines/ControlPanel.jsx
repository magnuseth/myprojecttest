import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, Bomb, Hash } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { getTranslation } from '@/components/translations';

export default function ControlPanel({ 
  mineCount, 
  onMineCountChange, 
  onPredict, 
  onReset, 
  isRevealed,
  clientSeed,
  serverSeed,
  onClientSeedChange,
  onServerSeedChange,
  language = 'en'
}) {
  const t = (key) => getTranslation(language, key);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl"
    >
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Bomb className="w-6 h-6 text-red-500" />
          {t('settings')}
        </h2>
        <p className="text-slate-400 text-sm">
          {t('configure_predict')}
        </p>
      </div>

      {/* Слайдер количества мин */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-slate-300">
            {t('mines_count')}
          </label>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg">
            <span className="text-white font-bold text-lg">{mineCount}</span>
          </div>
        </div>
        
        <Slider
          value={[mineCount]}
          onValueChange={(value) => onMineCountChange(value[0])}
          min={1}
          max={24}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>1</span>
          <span>24</span>
        </div>
      </div>

      {/* Seeds */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-400" />
            {t('client_seed')}
          </label>
          <Input
            value={clientSeed}
            onChange={(e) => onClientSeedChange(e.target.value)}
            placeholder={t('enter_client_seed')}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-400" />
            {t('server_seed')}
          </label>
          <Input
            value={serverSeed}
            onChange={(e) => onServerSeedChange(e.target.value)}
            placeholder={t('enter_server_seed')}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Информация */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-slate-400 text-xs mb-1">{t('total_cells')}</div>
            <div className="text-white text-xl font-bold">25</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">{t('safe_cells')}</div>
            <div className="text-emerald-400 text-xl font-bold">{25 - mineCount}</div>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <Button
          onClick={onPredict}
          disabled={isRevealed}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t('predict')}
        </Button>
        
        {isRevealed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-1"
          >
            <Button
              onClick={onReset}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-6 rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {t('reset')}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}