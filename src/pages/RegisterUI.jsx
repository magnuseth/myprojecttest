import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Gem, Mail, Lock, User as UserIcon, Tag, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslation } from '@/components/translations';

/**
 * MOCK REGISTER PAGE (UI ONLY)
 * 
 * Route: /register-ui
 * 
 * UI template for registration - ready for backend integration.
 */

export default function RegisterUI() {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    promoCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => getTranslation(language, key);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // MOCK REGISTRATION
    console.log('=== MOCK REGISTRATION (UI ONLY) ===');
    console.log('Name:', formData.fullName);
    console.log('Email:', formData.email);
    console.log('Password:', '***hidden***');
    console.log('Promo Code:', formData.promoCode || 'None');
    console.log('===================================');

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', promoCode: '' });
    }, 2000);

    /*
     * REPLACE WITH REAL BACKEND:
     * 
     * const response = await fetch(`${API_URL}/auth/register`, {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     fullName: formData.fullName,
     *     email: formData.email,
     *     password: formData.password,
     *     promoCode: formData.promoCode
     *   })
     * });
     * 
     * const data = await response.json();
     * if (data.success) {
     *   navigate(createPageUrl('LoginUI'));
     * }
     */
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 group mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Gem className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Stake Prediction
            </span>
          </Link>
          
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
            <span className="text-yellow-400 text-xs font-semibold">UI TEMPLATE - NO BACKEND</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700">
            <CardHeader>
              <CardTitle className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">{t('register_title')}</h1>
                <p className="text-slate-400 text-sm font-normal">{t('register_subtitle')}</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-emerald-400 text-sm">Account created! (MOCK)</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                    {t('full_name')}
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder={t('email_placeholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder={t('password_placeholder')}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    {t('confirm_password')}
                  </label>
                  <Input
                    type="password"
                    placeholder={t('confirm_password')}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    {t('promo_code')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('promo_placeholder')}
                    value={formData.promoCode}
                    onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      {t('create_account')} (MOCK)
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm">
                    {t('already_have_account')}{' '}
                    <Link
                      to={createPageUrl('LoginUI')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                    >
                      {t('sign_in')}
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Link
            to={createPageUrl('Home')}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            ← {t('home')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}