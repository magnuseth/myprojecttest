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
  AlertCircle
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
    <div className="min-h-screen pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to={createPageUrl('Settings')}>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('back_to_profile')}
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Wallet className="w-10 h-10 text-emerald-400" />
            {t('crypto_payment')}
          </h1>
          <p className="text-slate-400 text-lg">{t('select_crypto')}</p>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border-2 border-emerald-500/30 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-300 mb-1">{t('payment_amount')}</p>
              <p className="text-4xl font-bold text-white">${packPrice}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-300 mb-1">{packAttempts} {t('attempts_count')}</p>
              <p className="text-emerald-400 font-semibold">{t('one_time_purchase')}</p>
            </div>
          </div>
        </motion.div>

        {/* Crypto Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cryptoOptions.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => setSelectedCrypto(crypto)}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedCrypto?.id === crypto.id
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-slate-600'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-4xl font-bold bg-gradient-to-r ${crypto.color} bg-clip-text text-transparent`}>
                      {crypto.icon}
                    </div>
                    {selectedCrypto?.id === crypto.id && (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{crypto.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">{crypto.symbol}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className={`px-2 py-1 rounded bg-gradient-to-r ${crypto.color} bg-opacity-20`}>
                      {crypto.network}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Details */}
        {selectedCrypto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Address Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  {t('send_to_address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-xl">
                  <div className="w-full aspect-square bg-slate-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-slate-400" />
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-xl p-4 break-all">
                  <p className="text-slate-400 text-xs mb-2">{selectedCrypto.network} {t('network')}</p>
                  <p className="text-white font-mono text-sm">{selectedCrypto.address}</p>
                </div>

                <Button
                  onClick={() => handleCopyAddress(selectedCrypto.address)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-6"
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
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  {t('payment_instructions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                        {num}
                      </div>
                      <p className="text-slate-300 text-sm">{t(`instruction_${num}`)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-semibold text-sm mb-1">
                        {t('processing_time')}: {selectedCrypto.processingTime} {t('minutes')}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {t('waiting_confirmation')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">{selectedCrypto.network}</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    {t('network')} - {selectedCrypto.symbol}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Help */}
        {!selectedCrypto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-8">
                <Wallet className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  {t('select_crypto')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}