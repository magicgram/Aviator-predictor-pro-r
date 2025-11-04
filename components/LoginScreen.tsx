

import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import GuideModal from './GuideModal';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void;
  affiliateLink: string | null;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const GuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

// --- Sub-components moved outside and memoized for performance ---

const DepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
  affiliateLink: string | null;
}> = React.memo(({ onBack, onRegister, isRegistering, affiliateLink }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-slate-300 animate-fade-in-up">
      <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg text-left border border-cyan-400/20">
        <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">🎉</span>
          <p className="flex-1"><strong>{t('depositMessageTitle')}</strong></p>
        </div>
         <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">✅</span>
          <p className="flex-1">{t('depositMessageSync')}</p>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">💴</span>
          <p className="flex-1">{t('depositMessageDeposit', { amount: '$5' })}</p>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">🕹️</span>
          <p className="flex-1">{t('depositMessageAccess')}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <button
            onClick={onRegister}
            disabled={!affiliateLink || isRegistering}
            className="w-full py-3 bg-cyan-400 rounded-lg text-slate-900 font-bold text-lg hover:bg-cyan-300 transition-all duration-300 btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('redirecting')}...
              </div>
            ) : t('depositAndGetAccess')}
        </button>
        <button
            onClick={onBack}
            className="w-full py-3 bg-transparent border-2 border-slate-600 rounded-lg text-slate-300 font-semibold text-lg hover:bg-slate-600/20 transition duration-300"
        >
          {t('back')}
        </button>
      </div>

       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

const ReDepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
  affiliateLink: string | null;
}> = React.memo(({ onBack, onRegister, isRegistering, affiliateLink }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-slate-300 animate-fade-in-up">
      <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg text-left border border-yellow-400/20">
        <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">⚠️</span>
          <p className="flex-1"><strong>{t('reDepositMessageTitle')}</strong></p>
        </div>
         <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">🔄</span>
          <p className="flex-1">{t('reDepositMessageUsedAll')}</p>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-2xl pt-0">💴</span>
          <p className="flex-1">{t('reDepositMessageContinue', { amount: '$4' })}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <button
            onClick={onRegister}
            disabled={!affiliateLink || isRegistering}
            className="w-full py-3 bg-yellow-400 rounded-lg text-slate-900 font-bold text-lg hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{boxShadow: '0 0 5px #facc15, 0 0 10px #facc15'}}
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : t('depositAgain')}
        </button>
        <button
            onClick={onBack}
            className="w-full py-3 bg-transparent border-2 border-slate-600 rounded-lg text-slate-300 font-semibold text-lg hover:bg-slate-600/20 transition duration-300"
        >
          {t('back')}
        </button>
      </div>

       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onOpenSidebar, affiliateLink }) => {
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsDeposit, setNeedsDeposit] = useState(false);
  const [needsReDeposit, setNeedsReDeposit] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>({});
  const { t } = useLanguage();

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    setNeedsDeposit(false);
    setNeedsReDeposit(false);
    
    const idToVerify = playerId;

    try {
        const response: VerificationResponse = await verifyUser(idToVerify);
        if (response.success && typeof response.predictionsLeft !== 'undefined') {
            onLoginSuccess(idToVerify, response.predictionsLeft);
        } else {
            setPlayerId(''); // Clear input on failure
            if (response.status === 'NEEDS_DEPOSIT') {
                setNeedsDeposit(true);
            } else if (response.status === 'NEEDS_REDEPOSIT') {
                setNeedsReDeposit(true);
            } else if (response.status === 'NOT_REGISTERED') {
                const currentAttempts = loginAttempts[idToVerify] || 0;
                const newAttemptsCount = currentAttempts + 1;
                setLoginAttempts(prev => ({ ...prev, [idToVerify]: newAttemptsCount }));

                if (newAttemptsCount >= 3) {
                    setError(t('noRegistrationFoundAfterAttempts'));
                } else {
                    setError(response.message || t('youAreNotRegistered'));
                }
            } else {
                 if (response.success) { // Handle case where login is successful but prediction count is missing
                    setError(t('loginFailedNoCount'));
                } else {
                    setError(response.message || t('unknownErrorOccurred'));
                }
            }
        }
    } catch (err) {
        setPlayerId(''); // Clear input on unexpected error
        setError(t('unexpectedErrorOccurred'));
        console.error("Login attempt failed:", err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegister = useCallback(() => {
    if (affiliateLink) {
      setIsRegistering(true);
      // A small delay to show feedback before navigating away
      setTimeout(() => {
        window.location.href = affiliateLink;
        // Reset state in case navigation is blocked or fails
        setTimeout(() => setIsRegistering(false), 2000);
      }, 300);
    } else {
      alert(t('registrationLinkNotAvailable'));
    }
  }, [affiliateLink, t]);

  const handleBackFromDeposit = useCallback(() => setNeedsDeposit(false), []);
  const handleBackFromReDeposit = useCallback(() => setNeedsReDeposit(false), []);

  const getScreenContent = () => {
    if (needsDeposit) {
      return <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} affiliateLink={affiliateLink} />;
    }
    if (needsReDeposit) {
      return <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} affiliateLink={affiliateLink} />;
    }
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-cyan tracking-wide">{t('unlockPredictions')}</h1>
          <p className="text-slate-400 mt-2">{t('enterPlayerIdToSync')}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="playerId" className="text-sm font-semibold text-slate-300">
              {t('playerIdLabel')}
            </label>
            <input
              id="playerId"
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="12345678"
              className="mt-2 w-full px-4 py-3 bg-slate-900/50 border-2 border-cyan-400/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-300"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg text-center text-sm bg-rose-900/80 text-rose-300 border border-rose-700">
                {error}
            </div>
          )}

          <div className="pt-2">
              <button
              onClick={handleContinue}
              disabled={isLoading || !playerId}
              className="w-full py-3 bg-cyan-400 rounded-lg text-slate-900 font-bold text-lg hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 btn-glow"
              >
              {isLoading ? (
                  <div className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('verifying')}...
                  </div>
              ) : t('continue')}
              </button>
          </div>


          <div className="text-center text-slate-400 pt-4">
            <p>{t('dontHaveAccount')}</p>
            <div className="w-1/4 h-px bg-cyan-400/30 my-3 mx-auto"></div>
          </div>

          <button
            onClick={handleRegister}
            disabled={!affiliateLink || isRegistering}
            className="w-full py-3 bg-transparent border-2 border-indigo-500 rounded-lg text-white font-semibold text-lg hover:bg-indigo-500/20 transition duration-300 btn-glow-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? (
              <div className="flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('redirecting')}...
              </div>
            ) : t('registerHere')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
      <header className="flex justify-between items-center mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/50 rounded-full">
                <UserIcon className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
                <p className="font-bold text-lg">{t('welcome')}</p>
                <p className="text-sm text-slate-400">Aviator Predictor Pro</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsGuideOpen(true)} className="p-2 rounded-full hover:bg-slate-800/50" aria-label={t('openGuide')}>
                <GuideIcon className="w-6 h-6" />
            </button>
            <button onClick={onOpenSidebar} className="p-2 rounded-full hover:bg-slate-800/50" aria-label={t('openMenu')}>
                <MenuIcon className="w-6 h-6" />
            </button>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        {getScreenContent()}
      </main>
    </div>
  );
};

export default React.memo(LoginScreen);