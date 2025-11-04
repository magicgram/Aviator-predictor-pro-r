
import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  affiliateLink: string | null;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
  affiliateLink: string | null;
}> = React.memo(({ onBack, onRegister, isRegistering, affiliateLink }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-4">{t('depositMessageTitle')}</h2>
      <p className="mb-6">{t('depositMessageAccess')}</p>
      <div className="space-y-3">
        <button
          onClick={onRegister}
          disabled={!affiliateLink || isRegistering}
          className="w-full py-3 bg-white rounded-lg text-red-500 font-bold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : t('depositAndGetAccess')}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent border-2 border-white/50 rounded-lg text-white font-semibold text-lg hover:bg-white/10 transition duration-300"
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
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-4">{t('reDepositMessageTitle')}</h2>
      <p className="mb-6">{t('reDepositMessageContinue', { amount: '$4' })}</p>
      <div className="space-y-3">
        <button
          onClick={onRegister}
          disabled={!affiliateLink || isRegistering}
          className="w-full py-3 bg-white rounded-lg text-red-500 font-bold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : t('depositAgain')}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent border-2 border-white/50 rounded-lg text-white font-semibold text-lg hover:bg-white/10 transition duration-300"
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
});


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, affiliateLink }) => {
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
                 if (response.success) {
                    setError(t('loginFailedNoCount'));
                } else {
                    setError(response.message || t('unknownErrorOccurred'));
                }
            }
        }
    } catch (err) {
        setPlayerId('');
        setError(t('unexpectedErrorOccurred'));
        console.error("Login attempt failed:", err);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRegister = useCallback(() => {
    if (affiliateLink) {
      setIsRegistering(true);
      setTimeout(() => {
        window.location.href = affiliateLink;
        setTimeout(() => setIsRegistering(false), 2000);
      }, 300);
    } else {
      alert(t('registrationLinkNotAvailable'));
    }
  }, [affiliateLink, t]);

  const handleBackFromDeposit = useCallback(() => setNeedsDeposit(false), []);
  const handleBackFromReDeposit = useCallback(() => setNeedsReDeposit(false), []);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#f52e2e] font-['Poppins'] relative overflow-hidden">
        
        <div className="w-full max-w-sm flex flex-col items-center justify-center flex-grow p-6 z-10">
            {needsDeposit ? (
                <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} affiliateLink={affiliateLink} />
            ) : needsReDeposit ? (
                <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} affiliateLink={affiliateLink} />
            ) : (
                <>
                    <img src="https://i.ibb.co/L8y2vM3/aviator-logo-top.png" alt="Aviator Predictor Pro" className="w-64" />

                    <div className="w-full mt-8">
                        <label htmlFor="playerId" className="text-white text-sm font-semibold mb-2 block text-left">
                            PLAYER ID
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                <UserIcon />
                            </div>
                            <input
                                id="playerId"
                                type="text"
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                placeholder="12345678"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-red-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 shadow-inner"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="w-full mt-4 p-3 rounded-md text-center text-sm bg-red-800/80 text-white border border-red-600">
                            {error}
                        </div>
                    )}

                    <div className="w-full pt-6">
                        <button
                            onClick={handleContinue}
                            disabled={isLoading || !playerId}
                            className="w-full py-3 bg-white rounded-lg text-red-500 font-bold text-lg hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('verifying')}...
                                </div>
                            ) : t('continue').toUpperCase()}
                        </button>
                    </div>
                    
                    <div className="w-full mt-8 text-center">
                        <p className="text-white text-sm mb-2 font-semibold">{t('dontHaveAccount').toUpperCase()}</p>
                        <button
                            onClick={handleRegister}
                            disabled={!affiliateLink || isRegistering}
                            className="w-full py-3 bg-white rounded-lg text-red-500 font-bold text-lg hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                        >
                             {isRegistering ? (
                                 <div className="flex justify-center items-center">
                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                     {t('redirecting')}...
                                 </div>
                             ) : t('registerHere').toUpperCase()}
                        </button>
                    </div>
                </>
            )}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-0">
            <div className="w-full h-full bg-white" style={{ clipPath: 'ellipse(120% 60% at 50% 100%)' }}></div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <img src="https://i.ibb.co/R4T5g5d/aviator-logo-footer.png" alt="Aviator Predictor Pro" className="w-40 opacity-70" />
            </div>
        </div>
    </div>
  );
};

export default React.memo(LoginScreen);
