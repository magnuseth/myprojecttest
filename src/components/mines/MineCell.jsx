import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Bomb } from 'lucide-react';

export default function MineCell({ index, isSafe, isRevealed, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative aspect-square rounded-xl transition-all duration-300
        ${isRevealed && isSafe 
          ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
          : 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800'
        }
        border-2 ${isRevealed && isSafe ? 'border-emerald-400' : 'border-slate-700'}
        overflow-hidden group
      `}
    >
      {/* Блик */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Иконка */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isRevealed && isSafe && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Gem className="w-8 h-8 text-white drop-shadow-lg" />
          </motion.div>
        )}
      </div>

      {/* Номер ячейки */}
      {!isRevealed && (
        <div className="absolute bottom-1 right-2 text-xs text-slate-600 font-mono">
          {index + 1}
        </div>
      )}

      {/* Эффект свечения */}
      {isRevealed && isSafe && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-emerald-400/30 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
}