import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MineCell from '../components/mines/MineCell';
import ControlPanel from '../components/mines/ControlPanel';
import { Sparkles } from 'lucide-react';

export default function Predictor() {
  const [mineCount, setMineCount] = useState(3);
  const [safeCells, setSafeCells] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');

  const totalCells = 25;

  // Функция для воспроизведения звука
  const playPredictSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Создаём серию звуков для эффекта
    const times = [0, 0.1, 0.2];
    const frequencies = [800, 1000, 1200];
    
    times.forEach((time, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequencies[index];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.3);
      
      oscillator.start(audioContext.currentTime + time);
      oscillator.stop(audioContext.currentTime + time + 0.3);
    });
  };

  // Простая хеш-функция для seed
  const hashSeed = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Генератор псевдослучайных чисел на основе seed
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const handlePredict = () => {
    // Воспроизводим звук
    playPredictSound();
    
    // Генерируем безопасные ячейки
    const safeCount = totalCells - mineCount;
    const allCells = Array.from({ length: totalCells }, (_, i) => i);
    
    // Если указаны seeds, используем их для генерации
    if (clientSeed && serverSeed) {
      const combinedSeed = hashSeed(clientSeed + serverSeed);
      const shuffled = allCells.sort((a, b) => {
        return seededRandom(combinedSeed + a) - seededRandom(combinedSeed + b);
      });
      const safe = shuffled.slice(0, safeCount);
      setSafeCells(safe);
    } else {
      // Иначе случайная генерация
      const shuffled = allCells.sort(() => Math.random() - 0.5);
      const safe = shuffled.slice(0, safeCount);
      setSafeCells(safe);
    }
    
    setIsRevealed(true);
  };

  const handleReset = () => {
    setSafeCells([]);
    setIsRevealed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Mines Predictor
          </h1>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Генератор безопасных ячеек
          </p>
        </motion.div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Игровое поле */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 border-2 border-slate-700 shadow-2xl"
            >
              {/* Статистика сверху */}
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold">
                      Предсказание готово
                    </span>
                    <span className="text-white font-bold">
                      {safeCells.length} безопасных ячеек
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Сетка 5x5 */}
              <div className="grid grid-cols-5 gap-2 md:gap-3 aspect-square">
                {Array.from({ length: totalCells }).map((_, index) => (
                  <MineCell
                    key={index}
                    index={index}
                    isSafe={safeCells.includes(index)}
                    isRevealed={isRevealed}
                  />
                ))}
              </div>

              {/* Подсказка */}
              {!isRevealed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-500 mt-6 text-sm"
                >
                  Настройте параметры и нажмите "Предсказать" →
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Панель управления */}
          <div className="lg:col-span-1">
            <ControlPanel
              mineCount={mineCount}
              onMineCountChange={setMineCount}
              onPredict={handlePredict}
              onReset={handleReset}
              isRevealed={isRevealed}
              clientSeed={clientSeed}
              serverSeed={serverSeed}
              onClientSeedChange={setClientSeed}
              onServerSeedChange={setServerSeed}
            />

            {/* Дополнительная информация */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-slate-900/50 rounded-xl p-6 border border-slate-800"
            >
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Как это работает?
              </h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Выберите количество мин на поле</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Нажмите "Предсказать" для генерации</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Зелёные ячейки — безопасные позиции</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>Используйте "Сбросить" для новой попытки</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Футер */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-slate-600 text-sm"
        >
          <p>⚠️ Для развлекательных целей. Результаты генерируются случайно.</p>
        </motion.div>
      </div>
    </div>
  );
}