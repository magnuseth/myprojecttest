import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import MineCell from '../components/mines/MineCell';
import ControlPanel from '../components/mines/ControlPanel';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MinesPredictor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mineCount, setMineCount] = useState(3);
  const [safeCells, setSafeCells] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');

  const totalCells = 25;

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        base44.auth.redirectToLogin(window.location.href);
      }
      
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const playPredictSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

  const hashSeed = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const handlePredict = () => {
    playPredictSound();
    
    const safeCount = totalCells - mineCount;
    const allCells = Array.from({ length: totalCells }, (_, i) => i);
    
    if (clientSeed && serverSeed) {
      const combinedSeed = hashSeed(clientSeed + serverSeed);
      const shuffled = allCells.sort((a, b) => {
        return seededRandom(combinedSeed + a) - seededRandom(combinedSeed + b);
      });
      const safe = shuffled.slice(0, safeCount);
      setSafeCells(safe);
    } else {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Link to={createPageUrl('Predictor')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Назад к выбору</span>
        </Link>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 border-2 border-slate-700 shadow-2xl"
            >
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold">Предсказание готово</span>
                    <span className="text-white font-bold">{safeCells.length} безопасных ячеек</span>
                  </div>
                </motion.div>
              )}

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
          </div>
        </div>
      </div>
    </div>
  );
}