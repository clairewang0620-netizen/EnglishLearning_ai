import React, { useState } from 'react';
import { COURSE_CONTENT } from './constants';
import { Lock, Crown, KeyRound, Star, Map, Zap } from 'lucide-react';

interface DashboardProps {
  onLessonSelect: (id: string) => void;
  isPremium: boolean;
  onUnlock: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLessonSelect, isPremium, onUnlock }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');

  const handleLevelClick = (levelId: string, isLocked: boolean) => {
    if (isLocked) {
      setShowUpgradeModal(true);
      setError('');
      setLicenseKey('');
    } else {
      onLessonSelect(levelId);
    }
  };

  const verifyLicense = () => {
    if (licenseKey.trim().toUpperCase() === 'ENGLISH2025') {
        onUnlock();
        setShowUpgradeModal(false);
    } else {
        setError('Invalid license key. Try "ENGLISH2025"');
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#F3F0FF]">
      {/* Modern Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-indigo-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Map size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight">Lumière</span>
        </div>
        
        {isPremium ? (
             <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm animate-pulse">
                <Crown size={14} className="text-amber-600 fill-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Pro</span>
            </div>
        ) : (
            <button 
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
            >
                <Zap size={12} fill="currentColor" />
                Upgrade
            </button>
        )}
      </header>

      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100 mb-10 border border-white">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Hello, Learner! 👋</h1>
            <p className="text-slate-500 text-sm font-medium">Ready to continue your English journey?</p>
            
            <div className="mt-6 flex gap-3">
                 <div className="flex-1 bg-indigo-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-indigo-100">
                    <span className="text-xl font-black text-indigo-600">Lvl {COURSE_CONTENT.length}</span>
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Target</span>
                 </div>
                 <div className="flex-1 bg-amber-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-amber-100">
                    <span className="text-xl font-black text-amber-600">0</span>
                    <span className="text-[10px] uppercase font-bold text-amber-400">Streak</span>
                 </div>
            </div>
        </div>

        {/* The Path UI */}
        <div className="relative space-y-12">
            {/* Central Line */}
            <div className="absolute left-1/2 top-4 bottom-0 w-2 bg-slate-200 rounded-full -ml-1 -z-10"></div>

            <div className="space-y-12">
                {COURSE_CONTENT.map((level, idx) => {
                        const isLocked = (level.isPremium && !isPremium);
                        // Calculate offset to create zig-zag path effect
                        const offsetClass = idx % 2 === 0 ? '-translate-x-12' : 'translate-x-12';
                        
                        return (
                        <div key={level.id} className={`flex flex-col items-center transform ${offsetClass}`}>
                            <button
                                onClick={() => handleLevelClick(level.id, !!isLocked)}
                                className={`
                                    relative w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-[0_8px_0_rgba(0,0,0,0.15)] transition-all active:shadow-none active:translate-y-2
                                    ${isLocked 
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                                        : 'bg-white text-indigo-600 hover:ring-4 hover:ring-indigo-200 ring-offset-4'
                                    }
                                `}
                            >
                                <span className={isLocked ? 'opacity-20' : ''}>{level.icon}</span>
                                {isLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-slate-500 p-1.5 rounded-full text-white shadow-sm">
                                            <Lock size={16} />
                                        </div>
                                    </div>
                                )}
                                {/* Stars decoration */}
                                {!isLocked && <div className="absolute -top-1 -right-1 text-amber-400"><Star size={16} fill="currentColor" /></div>}
                            </button>
                            
                            <div className="mt-3 text-center w-32 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl shadow-sm">
                                <span className="text-xs font-bold text-slate-700 leading-tight block">{level.title}</span>
                                <span className="text-[10px] text-slate-400 block">{level.subTitle}</span>
                            </div>
                        </div>
                        )
                })}
            </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-fadeIn">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amber-300 to-orange-400 opacity-20 -z-0"></div>
                
                <button 
                    onClick={() => setShowUpgradeModal(false)}
                    className="absolute top-4 right-4 bg-slate-100 rounded-full p-2 text-slate-500 hover:bg-slate-200 z-10"
                >
                    ✕
                </button>
                
                <div className="text-center pt-8 pb-6 relative z-10">
                    <div className="w-20 h-20 bg-amber-100 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white">
                        <Crown size={40} className="text-amber-500" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Unlock Pro</h2>
                    <p className="text-slate-500 text-sm px-4 font-medium">Get access to all levels including Business English.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 relative z-10">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Access Code</label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            placeholder="Enter code (e.g. ENGLISH2025)"
                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-mono font-bold text-indigo-900"
                        />
                    </div>
                    {error && <p className="text-rose-500 text-xs mt-2 font-bold flex items-center gap-1">⚠️ {error}</p>}
                </div>

                <button 
                    onClick={verifyLicense}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-300 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Unlock Forever
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;