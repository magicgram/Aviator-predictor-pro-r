

import React, { useState } from 'react';
import * as authService from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

interface TestPostbackScreenProps {
  onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const TestPostbackScreen: React.FC<TestPostbackScreenProps> = ({ onBack }) => {
  const [userId, setUserId] = useState('testuser123');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleAction = async (action: (id: string, amount?: any) => Promise<string>, amount?: number) => {
    if (!userId) {
        setError(t('pleaseEnterUserId'));
        return;
    }
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
        const result = await action(userId, amount);
        if (result.startsWith('SUCCESS:')) {
            setMessage(result);
        } else { // It's an error from the service layer
            setError(result);
        }
    } catch(err) { // This handles network errors etc.
        setError(t('unexpectedErrorOccurred'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col text-white">
      <header className="flex items-center mb-4 flex-shrink-0">
        <div className="w-10">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-800/50" aria-label={t('goBack')}>
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gradient-cyan tracking-wide text-center flex-grow">{t('postbackTestingTool')}</h1>
        <div className="w-10"></div>
      </header>

      <div className="flex-grow overflow-y-auto px-1">
        <p className="text-center text-slate-400 text-sm mb-6">
          {t('postbackToolDescription')}
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="userIdTest" className="text-sm font-semibold text-slate-300">
              {t('userIdToTest')}
            </label>
            <input
              id="userIdTest"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="testuser123"
              className="mt-2 w-full px-4 py-3 bg-slate-900/50 border-2 border-cyan-400/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-300"
            />
          </div>
          
          {error && (
              <div className="p-3 rounded-lg text-center text-sm bg-rose-900/80 text-rose-300 border border-rose-700">
                  {error}
              </div>
          )}
          {message && (
              <div className="p-3 rounded-lg text-center text-sm bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                  {message}
              </div>
          )}

          <button
            onClick={() => handleAction(authService.testRegistration)}
            disabled={isLoading}
            className="w-full py-3 bg-sky-500 rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50 transition-all duration-300"
          >
            {t('testRegistration')}
          </button>
          <button
            onClick={() => handleAction(authService.testFirstDeposit, 10)}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-all duration-300"
          >
            {t('testFirstDeposit', { amount: '$10' })}
          </button>
          <button
            onClick={() => handleAction(authService.testFailedDeposit, 2)}
            disabled={isLoading}
            className="w-full py-3 bg-rose-600 rounded-lg font-semibold hover:bg-rose-700 disabled:opacity-50 transition-all duration-300"
          >
            {t('testFailedDeposit', { amount: '$2' })}
          </button>
          <button
            onClick={() => handleAction(authService.testReDeposit, 5)}
            disabled={isLoading}
            className="w-full py-3 bg-violet-600 rounded-lg font-semibold hover:bg-violet-700 disabled:opacity-50 transition-all duration-300"
          >
            {t('testReDeposit', { amount: '$5' })}
          </button>

          <div className="w-1/4 h-px bg-cyan-400/30 my-3 mx-auto"></div>

          <button
            onClick={() => handleAction(authService.clearUserData)}
            disabled={isLoading}
            className="w-full py-3 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 transition-all duration-300"
          >
            {t('clearUserData')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TestPostbackScreen);