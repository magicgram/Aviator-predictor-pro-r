

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languages } from '../lib/i18n';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M3 11.25V21.75a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V11.25M9 22.5h6" />
    </svg>
);

const TestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.5 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.5 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const LanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
    </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  playerId?: string;
  onProfilePictureChange?: (newPicUrl: string) => void;
  isAdminFeatureEnabled: boolean;
  onTestPostbackClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, onLogout, isLoggedIn, playerId, onProfilePictureChange, isAdminFeatureEnabled, onTestPostbackClick }) => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (playerId) {
      const storedPic = localStorage.getItem(`profile_pic_${playerId}`);
      if (storedPic) {
        setProfilePic(storedPic);
      } else {
        setProfilePic(null);
      }
    }
  }, [playerId, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && playerId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`profile_pic_${playerId}`, base64String);
        setProfilePic(base64String);
        if (onProfilePictureChange) {
          onProfilePictureChange(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicClick = () => {
    if (isLoggedIn) {
      fileInputRef.current?.click();
    }
  };
  
  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    setIsLangMenuOpen(false);
    onClose();
  };

  return (
    <>
        <div 
            className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        />
        <div className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#0a0a24] to-[#020418] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <div className="p-4 flex-shrink-0">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleProfilePicClick}
                            className="w-12 h-12 flex-shrink-0 bg-slate-800 rounded-full group relative disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={!isLoggedIn}
                            aria-label={t('changeProfilePic')}
                        >
                            {profilePic ? (
                                <img src={profilePic} alt={t('profileAlt')} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserIcon className="w-8 h-8 text-cyan-300" />
                            )}
                            {isLoggedIn && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <PencilIcon className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </button>
                        <div>
                            <p className="font-bold text-lg text-white truncate max-w-40">{playerId ? t('welcomeUser', {playerId}) : t('welcome')}</p>
                            <p className="text-sm text-slate-400">Aviator Predictor Pro</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-800/50">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
            
            <nav className="flex-grow overflow-y-auto px-4">
                <div className="flex flex-col space-y-2">
                    <button 
                        onClick={() => onNavigate('predictor')}
                        disabled={!isLoggedIn}
                        className="flex items-center gap-4 p-3 rounded-lg text-left text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:text-slate-300/50"
                    >
                        <HomeIcon className="w-6 h-6"/>
                        <span className="font-semibold">{t('predictorHome')}</span>
                    </button>
                    {isAdminFeatureEnabled && (
                      <button 
                          onClick={onTestPostbackClick}
                          className="flex items-center gap-4 p-3 rounded-lg text-left text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-300 transition-colors duration-200"
                      >
                          <TestIcon className="w-6 h-6"/>
                          <span className="font-semibold">{t('testPostback')}</span>
                      </button>
                    )}
                     <div>
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="w-full flex items-center justify-between gap-4 p-3 rounded-lg text-left text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-300 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <LanguageIcon className="w-6 h-6" />
                                <span className="font-semibold">{t('language')}</span>
                            </div>
                            <svg className={`w-5 h-5 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isLangMenuOpen && (
                            <div className="mt-2 pl-4 max-h-60 overflow-y-auto">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className={`w-full text-left p-2 rounded-md text-sm transition-colors ${language === lang.code ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-400 hover:bg-slate-700/50'}`}
                                    >
                                        {lang.flag} {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            
            <div className="p-4 border-t border-cyan-400/10 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        {isLoggedIn && (
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-4 p-3 rounded-lg text-left text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-colors duration-200"
                            >
                                <LogoutIcon className="w-6 h-6"/>
                                <span className="font-semibold">{t('logout')}</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 group">
                        <svg
                            className="w-5 h-5 nexus-logo-animation"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="nexus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M21 8.25V15.75L12 21L3 15.75V8.25L12 3L21 8.25Z"
                                stroke="url(#nexus-gradient)"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                fill="none"
                            />
                            <path
                                d="M12 12.5L3 8.25L12 3L21 8.25L12 12.5Z"
                                stroke="url(#nexus-gradient)"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                        <span className="text-sm font-bold text-nexus-gradient">NexusPlay</span>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default React.memo(Sidebar);