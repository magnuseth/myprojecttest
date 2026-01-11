import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Save } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/components/translations';

export default function ProfileSection({ user, language = 'en', onUpdate }) {
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  const t = (key) => getTranslation(language, key);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({ full_name: fullName });
      onUpdate();
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border-2 border-slate-700"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-emerald-400" />
        {t('profile')}
      </h2>

      <div className="space-y-4">
        {/* Email (только чтение) */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            {t('email_address')}
          </label>
          <Input
            value={user?.email || ''}
            disabled
            className="bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed"
          />
        </div>

        {/* Имя */}
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            {t('full_name')}
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t('full_name')}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>

        {/* Кнопка сохранения */}
        <Button
          onClick={handleSave}
          disabled={isSaving || fullName === user?.full_name}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6 rounded-xl disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? t('saving') : t('save_changes')}
        </Button>
      </div>
    </motion.div>
  );
}