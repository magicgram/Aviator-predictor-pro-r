

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { User } from '../types';
import { usePrediction } from '../services/authService';
import Sidebar from './Sidebar';
import TestPostbackScreen from './TestPostbackScreen';
import GuideModal from './GuideModal';
import AdminAuthModal from './AdminAuthModal';
import { useLanguage } from '../contexts/LanguageContext';

interface PredictorScreenProps {
  user: User;
  onLogout: () => void;
  affiliateLink: string | null;
  isAdminFeatureEnabled: boolean;
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

const LimitReachedView = React.memo(({ handleDepositRedirect, affiliateLink }: { handleDepositRedirect: () => void; affiliateLink: string | null; }) => {
  const { t } = useLanguage();
  return (
    <div className="text-center p-8 card-bg rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-yellow-400">{t('limitReachedTitle')}</h2>
      <p className="mt-4 text-slate-300">{t('limitReachedText', { amount: '$4' })}</p>
      <button 
        onClick={handleDepositRedirect}
        disabled={!affiliateLink}
        className="mt-6 w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('depositNow')}
      </button>
    </div>
  );
});


const PredictorView = React.memo((props: {
    user: User;
    profilePic: string | null;
    currentTime: string;
    predictionsLeft: number;
    displayValue: string;
    prediction: string | null;
    accuracy: number | null;
    isPredicting: boolean;
    isRoundComplete: boolean;
    onOpenGuide: () => void;
    onOpenSidebar: () => void;
    onGetSignal: () => void;
    onNextRound: () => void;
}) => {
  const { t } = useLanguage();
  return (
     <div className="w-full h-full flex flex-col">
       <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
             <div className="w-12 h-12 flex-shrink-0 bg-slate-800/50 rounded-full flex items-center justify-center">
                {props.profilePic ? (
                    <img src={props.profilePic} alt={t('profileAlt')} className="w-full h-full rounded-full object-cover" />
                ) : (
                    <UserIcon className="w-8 h-8 text-cyan-300" />
                )}
            </div>
            <div>
                <p className="font-bold text-lg truncate max-w-40">{t('welcomeUser', { playerId: props.user.playerId })}</p>
                <p className="text-sm text-slate-400">Aviator Predictor Pro</p>
                <p className="text-xs text-slate-500 mt-1 font-mono">{props.currentTime}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={props.onOpenGuide} className="p-2 rounded-full hover:bg-slate-800/50" aria-label={t('openGuide')}>
                <GuideIcon className="w-6 h-6" />
            </button>
            <button onClick={props.onOpenSidebar} className="p-2 rounded-full hover:bg-slate-800/50" aria-label={t('openMenu')}>
                <MenuIcon className="w-6 h-6" />
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <div className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-all duration-300
          ${props.prediction ? 'bg-gradient-to-br from-rose-500/20 to-red-500/10 border-4 border-red-500' : 
            'bg-cyan-500/10 border-4 border-cyan-400 animate-pulse'}`}>
          <div className="flex flex-col items-center justify-center">
            {props.prediction && (
                <div className="bg-red-900/70 border border-red-600/60 px-4 py-1 rounded-full mb-2 shadow-md">
                    <p className="text-sm font-bold text-red-300 tracking-widest uppercase">{t('flewAway')}</p>
                </div>
            )}
            <p className={`font-bold font-mono transition-colors duration-300 whitespace-nowrap
                ${props.prediction ? 'text-5xl md:text-6xl text-red-400' : 
                  `text-4xl md:text-5xl ${props.isPredicting ? 'text-slate-400' : 'text-white'}`
                }`}>
                {props.displayValue}
            </p>
          </div>
        </div>
        
        <div className="w-full">
            <div className="mt-6 w-full max-w-xs h-24 flex items-center justify-center mx-auto">
                {props.accuracy && props.prediction ? (
                    <div className="w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg">
                        <p className="text-cyan-300 font-bold text-xl">{t('accuracy')}: {props.accuracy}%</p>
                        <p className="text-cyan-200/80 text-sm mt-1">{t('cashoutBefore')} 👉🏻 {props.prediction}</p>
                    </div>
                ) : null}
            </div>
        </div>
      </main>

      <footer className="space-y-3">
         <p className="text-center text-slate-400">{t('predictionsLeft', { count: props.predictionsLeft })}</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={props.onGetSignal}
            disabled={props.isPredicting || props.isRoundComplete}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {props.isPredicting ? t('predicting') : t('getSignal')}
          </button>
          <button 
            onClick={props.onNextRound}
            disabled={!props.isRoundComplete || props.isPredicting}
            className="w-full py-3 bg-transparent border-2 border-indigo-500 rounded-lg text-white font-semibold text-lg hover:bg-indigo-500/20 disabled:opacity-50 transition duration-300 btn-glow-dark"
          >
            {t('nextRound')}
          </button>
        </div>
      </footer>
     </div>
  );
});

const PredictorScreen: React.FC<PredictorScreenProps> = ({ user, onLogout, affiliateLink, isAdminFeatureEnabled }) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [displayValue, setDisplayValue] = useState("?.??x");
  const [predictionsLeft, setPredictionsLeft] = useState(user.predictionsLeft);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('predictor'); // 'predictor' or 'testPostback'
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const storedPic = localStorage.getItem(`profile_pic_${user.playerId}`);
    if (storedPic) {
      setProfilePic(storedPic);
    } else {
      setProfilePic(null);
    }
  }, [user.playerId]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const handleProfilePictureChange = useCallback((newPicUrl: string) => {
    setProfilePic(newPicUrl);
  }, []);

  const handleGetSignal = useCallback(async () => {
    if (isPredicting || predictionsLeft <= 0 || isRoundComplete) return;

    setIsPredicting(true);

    try {
      const result = await usePrediction(user.playerId);
      if (!result.success) {
        alert(`${t('errorLabel')}: ${result.message || t('couldNotUsePrediction')}`);
        setIsPredicting(false);
        return;
      }
      
      setPredictionsLeft(prev => prev - 1);
      setPrediction(null);
      setAccuracy(null);
      setIsRoundComplete(false);

      intervalRef.current = window.setInterval(() => {
        const randomValue = (Math.random() * 9 + 1).toFixed(2);
        setDisplayValue(`${randomValue}x`);
      }, 50);

      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const isRare = Math.random() < 2 / 25;
        let finalPrediction: string;

        if (isRare) {
          finalPrediction = (Math.random() * (3.90 - 2.10) + 2.10).toFixed(2);
        } else {
          finalPrediction = (Math.random() * (2.10 - 1.10) + 1.10).toFixed(2);
        }

        const finalAccuracy = Math.floor(Math.random() * (99 - 78 + 1) + 78);
        
        setPrediction(`${finalPrediction}x`);
        setAccuracy(finalAccuracy);
        setDisplayValue(`${finalPrediction}x`);
        setIsPredicting(false);
        setIsRoundComplete(true);
      }, 3000);

    } catch (error) {
       console.error("Failed to get signal:", error);
       alert(t('unexpectedErrorSignal'));
       setIsPredicting(false);
    }
  }, [user.playerId, isPredicting, predictionsLeft, isRoundComplete, t]);
  
  const handleNextRound = useCallback(() => {
    if (isPredicting) return;
    setPrediction(null);
    setAccuracy(null);
    setDisplayValue("0.00x");
    setIsRoundComplete(false);
  }, [isPredicting]);

  const handleDepositRedirect = useCallback(() => {
    if (affiliateLink) {
        window.location.href = affiliateLink;
        onLogout();
    } else {
        alert(t('depositLinkNotAvailable'));
    }
  }, [affiliateLink, onLogout, t]);
  
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNavigate = useCallback((view) => { setCurrentView(view); setIsSidebarOpen(false); }, []);
  const handleTestPostbackClick = useCallback(() => { setIsSidebarOpen(false); setShowAdminModal(true); }, []);
  const handleAdminSuccess = useCallback(() => { setShowAdminModal(false); setCurrentView('testPostback'); }, []);
  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToPredictor = useCallback(() => setCurrentView('predictor'), []);

  if (predictionsLeft <= 0 && !isPredicting) {
    return <LimitReachedView handleDepositRedirect={handleDepositRedirect} affiliateLink={affiliateLink} />;
  }
  
  return (
    <div className="w-full max-w-md h-[90vh] max-h-[700px] flex flex-col p-6 card-bg rounded-2xl relative">
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
      {showAdminModal && <AdminAuthModal onSuccess={handleAdminSuccess} onClose={handleAdminClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        playerId={user.playerId}
        onProfilePictureChange={handleProfilePictureChange}
        isAdminFeatureEnabled={isAdminFeatureEnabled}
        onTestPostbackClick={handleTestPostbackClick}
      />
      {currentView === 'predictor' && (
        <PredictorView 
            user={user}
            profilePic={profilePic}
            currentTime={currentTime}
            predictionsLeft={predictionsLeft}
            displayValue={displayValue}
            prediction={prediction}
            accuracy={accuracy}
            isPredicting={isPredicting}
            isRoundComplete={isRoundComplete}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onGetSignal={handleGetSignal}
            onNextRound={handleNextRound}
        />
      )}
      {currentView === 'testPostback' && <TestPostbackScreen onBack={handleBackToPredictor} />}
    </div>
  );
};

export default React.memo(PredictorScreen);