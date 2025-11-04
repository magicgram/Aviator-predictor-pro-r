

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
      } else {
        setError(data.message || t('incorrectPassword'));
      }
    } catch (err) {
      setError(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="w-full max-w-sm card-bg rounded-2xl p-6 md:p-8 flex flex-col animate-fade-in">
        <h1 className="text-2xl font-bold text-center text-white mb-2">{t('adminAccess')}</h1>
        <p className="text-center text-slate-400 mb-6">{t('enterPasswordToAccessTestPage')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-900/50 border-2 border-cyan-400/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-300"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg text-center text-sm bg-rose-900/80 text-rose-300 border border-rose-700">
                {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-transparent border-2 border-slate-600 rounded-lg text-slate-300 font-semibold text-lg hover:bg-slate-600/20 transition duration-300"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="py-3 bg-indigo-500 rounded-lg text-white font-semibold text-lg hover:bg-indigo-600 transition-all duration-300 btn-glow-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('verifying') : t('submit')}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default React.memo(AdminAuthModal);