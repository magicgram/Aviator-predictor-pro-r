import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  affiliateLink: string | null;
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
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
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={!affiliateLink || isRegistering}
          className="w-full py-3 bg-white rounded-lg text-red-500 font-bold text-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 shadow-[0_4px_10px_rgba(150,20,20,0.4)]"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
             <div className="flex justify-center items-center">
                <span>{t('depositAndGetAccess').toUpperCase()}</span>
             </div>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent border-2 border-white/50 rounded-lg text-white font-semibold text-lg hover:bg-white/10 transition duration-300"
        >
          {t('back').toUpperCase()}
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
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={!affiliateLink || isRegistering}
          className="w-full py-3 bg-white rounded-lg text-red-500 font-bold text-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 shadow-[0_4px_10px_rgba(150,20,20,0.4)]"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span>{t('depositAgain').toUpperCase()}</span>
            </div>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-transparent border-2 border-white/50 rounded-lg text-white font-semibold text-lg hover:bg-white/10 transition duration-300"
        >
          {t('back').toUpperCase()}
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
    <div className="w-full h-full flex flex-col items-center bg-[#ef1a25] font-['Poppins'] relative overflow-hidden">
        
      {/* Decorative white curve and bottom logo */}
      <div className="absolute bottom-0 left-0 w-full h-[20vh] pointer-events-none">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[180vw] h-[22vh] bg-[#d01011] rounded-t-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180vw] h-[22vh] bg-white rounded-t-full"></div>
          <img 
            src="https://i.postimg.cc/d0V9DrJY/Picsart-25-11-04-16-01-32-557.png" 
            alt="Aviator Predictor Pro" 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 z-10" 
            style={{ filter: 'grayscale(1) brightness(0.7) opacity(0.6)' }} 
          />
      </div>


      <div className="w-full h-full flex flex-col items-center justify-center z-10 px-6 pt-6 pb-[25vh]">
          {needsDeposit ? (
              <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} affiliateLink={affiliateLink} />
          ) : needsReDeposit ? (
              <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} affiliateLink={affiliateLink} />
          ) : (
              <div className="w-full max-w-sm flex flex-col items-center justify-between flex-grow">
                  {/* Group 1: Logo */}
                  <div className="w-full flex flex-col items-center">
                    <img src="https://i.postimg.cc/d0V9DrJY/Picsart-25-11-04-16-01-32-557.png" alt="Aviator Predictor Pro" className="w-72 object-contain" />
                  </div>

                  {/* Group 2: Input & Continue */}
                  <div className="w-full">
                      <label htmlFor="playerId" className="text-white text-xs font-semibold mb-2 block text-left tracking-wider">
                          PLAYER ID
                      </label>
                      <div className="relative flex items-center">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                              <UserIcon />
                          </div>
                          <input
                              id="playerId"
                              type="text"
                              value={playerId}
                              onChange={(e) => setPlayerId(e.target.value)}
                              placeholder="12345678"
                              className="w-full pl-10 pr-4 py-3 bg-white border border-black/20 rounded-lg text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
                          />
                      </div>

                      {error && (
                          <div className="w-full mt-2 p-3 rounded-md text-center text-sm bg-red-800/80 text-white border border-red-600">
                              {error}
                          </div>
                      )}

                      <div className="w-full pt-4">
                          <button
                              onClick={handleContinue}
                              disabled={isLoading || !playerId}
                              className="w-full relative py-3 bg-white rounded-lg text-red-600 font-bold text-lg hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)]"
                          >
                              {isLoading ? (
                                  <div className="flex justify-center items-center">
                                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      {t('verifying')}...
                                  </div>
                              ) : (
                                  <span>COUNTINUE</span>
                              )}
                          </button>
                      </div>
                  </div>

                  {/* Group 3: Register */}
                  <div className="w-full text-center">
                      <p className="text-white text-xs mb-2 font-semibold tracking-wider">I DON'T HAVE AN ACCOUNT</p>
                      <button
                          onClick={handleRegister}
                          disabled={!affiliateLink || isRegistering}
                          className="w-full relative py-3 bg-white rounded-lg text-red-600 font-bold text-lg hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)]"
                      >
                          {isRegistering ? (
                              <div className="flex justify-center items-center">
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {t('redirecting')}...
                              </div>
                          ) : (
                              <span>{t('registerHere').toUpperCase()}</span>
                          )}
                      </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default React.memo(LoginScreen);