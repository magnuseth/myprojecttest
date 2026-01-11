import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, Lock, User, ArrowLeft, Gem, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Валидация
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      setIsLoading(false);
      return;
    }

    try {
      // Используем встроенную систему регистрации Base44
      await base44.auth.register(email, password, { full_name: fullName });
      
      // Создаём подписку для нового пользователя
      await base44.entities.Subscription.create({
        user_email: email,
        plan: 'free',
        predictions_limit: 10,
        predictions_used: 0,
        is_active: true
      });

      window.location.href = createPageUrl('Predictor');
    } catch (err) {
      setError('Ошибка регистрации. Возможно, этот email уже используется.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Фоновые эффекты */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Кнопка назад */}
      <Link 
        to={createPageUrl('Home')}
        className="fixed top-8 left-8 text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>На главную</span>
      </Link>

      {/* Форма регистрации */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl">
          {/* Лого */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gem className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Регистрация</h1>
            <p className="text-slate-400">Создайте бесплатный аккаунт</p>
          </div>

          {/* Преимущества */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
            <ul className="space-y-2 text-sm">
              {['10 бесплатных предсказаний', 'Провабли фейр система', 'Никаких скрытых платежей'].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Форма */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Имя */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Полное имя
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иван Иванов"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ваш@email.com"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* Пароль */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Пароль
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Подтвердите пароль
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* Ошибка */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Кнопка регистрации */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              {isLoading ? (
                'Регистрация...'
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </form>

          {/* Вход */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Уже есть аккаунт?{' '}
              <Link 
                to={createPageUrl('Login')} 
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}