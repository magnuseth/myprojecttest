import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, 
  Copy, 
  CheckCircle, 
  Wallet,
  Clock,
  QrCode,
  AlertCircle,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getTranslation } from '@/components/translations';

export default function CryptoPayment() {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key) => getTranslation(language, key);

  // Get pack info from URL
  const urlParams = new URLSearchParams(window.location.search);
  const packPrice = urlParams.get('price') || '249';
  const packAttempts = urlParams.get('attempts') || '50';

  const cryptoOptions = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTC',
      network: 'Bitcoin',
      icon: '₿',
      color: 'from-orange-500 to-yellow-500',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      processingTime: '10-30'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      network: 'ERC-20',
      icon: 'Ξ',
      color: 'from-blue-500 to-purple-500',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      processingTime: '2-5'
    },
    {
      id: 'usdt_trc',
      name: 'Tether',
      symbol: 'USDT',
      network: 'TRC-20',
      icon: '₮',
      color: 'from-green-500 to-emerald-500',
      address: 'TXx8rSudPVbHFhxEwGKfZmUVF2PdVfVgBH',
      processingTime: '1-3'
    },
    {
      id: 'usdt_erc',
      name: 'Tether',
      symbol: 'USDT',
      network: 'ERC-20',
      icon: '₮',
      color: 'from-teal-500 to-cyan-500',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      processingTime: '2-5'
    },
    {
      id: 'ltc',
      name: 'Litecoin',
      symbol: 'LTC',
      network: 'Litecoin',
      icon: 'Ł',
      color: 'from-slate-500 to-gray-500',
      address: 'LdP8Qox1VAhCzLJNqrr74YovaWYyNBUWvL',
      processingTime: '5-15'
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      network: 'BEP-20',
      icon: '◆',
      color: 'from-yellow-500 to-orange-500',
      address: 'bnb1xz3xqf4p2ygrw9lhp5g5df4ep4nd5mt0vc8z9n',
      processingTime: '1-3'
    }
  ];

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success(t('address_copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Settings')}>
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800/50 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('back_to_profile')}
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30 mb-6 relative"
          >
            <Wallet className="w-10 h-10 text-emerald-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 border-t-emerald-500/50"
            />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            {t('crypto_payment')}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('select_crypto')}</p>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 border-2 border-emerald-500/20 mb-12 shadow-2xl shadow-emerald-500/10"
        >
          {/* Animated background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Amount Section */}
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/40"
              >
                <Wallet className="w-12 h-12 text-white" />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('payment_amount')}
                </p>
                <p className="text-6xl font-bold text-white">${packPrice}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />

            {/* Attempts Section */}
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm font-medium mb-3">{t('one_time_purchase')}</p>
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl px-8 py-4 shadow-lg shadow-emerald-500/20">
                <Zap className="w-8 h-8 text-emerald-400" />
                <div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    +{packAttempts}
                  </span>
                  <p className="text-slate-400 text-xs font-medium">{t('attempts_count')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Crypto Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Choose Payment Method</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cryptoOptions.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 group ${
                    selectedCrypto?.id === crypto.id
                      ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500 shadow-xl shadow-emerald-500/20'
                      : 'bg-slate-800/30 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Selection Indicator */}
                  {selectedCrypto?.id === crypto.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {/* Icon */}
                  <div className={`text-5xl font-bold bg-gradient-to-r ${crypto.color} bg-clip-text text-transparent mb-4`}>
                    {crypto.icon}
                  </div>

                  {/* Name */}
                  <h3 className="text-white font-bold text-xl mb-1">{crypto.name}</h3>
                  <p className="text-slate-400 text-sm font-medium mb-3">{crypto.symbol}</p>

                  {/* Network Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${crypto.color} bg-opacity-10 border border-current`}>
                    <span className="text-xs font-semibold text-white">{crypto.network}</span>
                  </div>

                  {/* Processing Time */}
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{crypto.processingTime} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {selectedCrypto && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Address Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-emerald-400" />
                  </div>
                  {t('send_to_address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* QR Code */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
                  <div className="relative bg-white p-6 rounded-2xl shadow-2xl">
                    <div className="w-full aspect-square bg-slate-200 rounded-xl flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-400" />
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div className="bg-slate-800/60 border-2 border-slate-700 rounded-xl p-5 break-all group hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedCrypto.color}`} />
                    <p className="text-slate-400 text-xs font-semibold">{selectedCrypto.network} {t('network')}</p>
                  </div>
                  <p className="text-white font-mono text-sm leading-relaxed">{selectedCrypto.address}</p>
                </div>

                {/* Copy Button */}
                <Button
                  onClick={() => handleCopyAddress(selectedCrypto.address)}
                  className={`w-full h-14 font-bold text-base transition-all ${
                    copied 
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t('address_copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      {t('copy_address')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                  {t('payment_instructions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Steps */}
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((num) => (
                    <motion.div
                      key={num}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: num * 0.1 }}
                      className="flex items-start gap-4 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-lg shadow-emerald-500/30">
                        {num}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed pt-1">{t(`instruction_${num}`)}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Processing Time */}
                <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-400 font-bold text-base mb-1">
                        {selectedCrypto.processingTime} {t('minutes')}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {t('processing_time')} • {t('waiting_confirmation')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Network Info */}
                <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-emerald-400 font-bold text-base">{selectedCrypto.network}</p>
                      <p className="text-slate-400 text-sm">{selectedCrypto.symbol} Network</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Help */}
        {!selectedCrypto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-3xl p-16">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-24 h-24 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-6"
              >
                <Wallet className="w-12 h-12 text-slate-600" />
              </motion.div>
              <p className="text-slate-400 text-lg font-medium mb-2">
                {t('select_crypto')}
              </p>
              <p className="text-slate-500 text-sm">
                Choose your preferred payment method above
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}