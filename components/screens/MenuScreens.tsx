
import React, { useState, useEffect, useMemo } from 'react';
import { NeoButton, NeoCard, BORDER_STYLE, NeoInput } from '../UI';
import { Profile, Level, Language, Theme, ScreenState } from '../../types';
import { MOCK_LEVELS, QUOTES } from '../../constants';
import { Trash2, Plus, Terminal, ArrowLeft, Download, Upload, Monitor, Settings, ShieldCheck, Lock, Sparkles, Code, Zap, AlertCircle } from 'lucide-react';

// --- Configuration / Theme Selection ---
export const ConfigurationScreen: React.FC<{ 
  currentTheme: Theme, 
  onThemeChange: (t: Theme) => void, 
  onBack: () => void,
  maxLevelsCleared: number,
  redTeamRevealed?: boolean,
  isRedTeamMode?: boolean,
  onRedTeamToggle?: () => void
}> = ({ currentTheme, onThemeChange, onBack, maxLevelsCleared, redTeamRevealed, isRedTeamMode, onRedTeamToggle }) => {
  const themes = [
    { 
      id: Theme.TERMINAL, 
      name: 'Retro Terminal', 
      desc: 'Classic hacker aesthetic. High contrast, green phosphor.',
      unlocked: true,
      icon: <Terminal size={24} />
    },
    { 
      id: Theme.FRUTIGER, 
      name: 'Frutiger Aero', 
      desc: 'Glossy gradients. Unlocked after 2 levels.',
      unlocked: maxLevelsCleared >= 2,
      icon: <Sparkles size={24} />
    },
    { 
      id: Theme.IDE, 
      name: 'Monokai IDE', 
      desc: 'Optimized for long hours. Unlocked after Chapter 1.',
      unlocked: maxLevelsCleared >= 4,
      icon: <Code size={24} />
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start lg:justify-center h-full w-full p-4 lg:p-8 bg-[var(--bg-color)] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6 lg:mb-10">
        <Settings className="text-[var(--primary)]" size={24} />
        <h2 className="text-lg md:text-3xl font-bold tracking-widest uppercase text-[var(--primary)] text-center">System Configuration</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-8 max-w-6xl w-full">
        {themes.map(t => (
          <NeoCard 
            key={t.id} 
            title={t.name} 
            className={`transition-all ${currentTheme === t.id ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]' : t.unlocked ? 'opacity-80' : 'opacity-40'}`}
          >
            <div className="p-4 lg:p-6 flex flex-col items-center text-center gap-3 lg:gap-4">
              <div className={`p-3 lg:p-4 rounded-full ${t.unlocked ? 'bg-[var(--primary)] text-black' : 'bg-gray-800 text-gray-400'}`}>
                {t.unlocked ? t.icon : <Lock size={20} />}
              </div>
              <p className="text-[10px] lg:text-sm font-mono leading-tight h-8 line-clamp-2">{t.desc}</p>
              
              {t.unlocked ? (
                <NeoButton 
                  onClick={() => onThemeChange(t.id)} 
                  variant={currentTheme === t.id ? 'success' : 'primary'}
                  className="w-full text-[10px] lg:text-sm py-2"
                >
                  {currentTheme === t.id ? 'ACTIVE' : 'SELECT'}
                </NeoButton>
              ) : (
                <div className="w-full py-2 bg-gray-900 text-gray-500 border border-gray-700 text-[10px] font-bold">
                  [ ENCRYPTED ]
                </div>
              )}
            </div>
          </NeoCard>
        ))}
      </div>

      {redTeamRevealed && (
        <div className="max-w-md w-full mb-8 lg:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <NeoCard title="UNAUTHORIZED_ACCESS" className="border-[#ff4141] bg-[#1a0000]">
              <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                 <div className="flex items-center gap-3 text-[#ff4141]">
                    <AlertCircle size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Red Team Protocols</span>
                 </div>
                 <p className="text-[9px] lg:text-[10px] text-[#ff4141] opacity-80 uppercase leading-relaxed font-mono">
                    Enabling "Red Team Mode" bypasses native Anti-Cheat subroutines. 
                    Clipboard buffer injection (Paste) permitted.
                 </p>
                 <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-[#3b0000]">
                    <span className="text-[9px] lg:text-xs font-bold text-[#ff4141] uppercase">Status: {isRedTeamMode ? 'BYPASS_ON' : 'LOCKED'}</span>
                    <button 
                       onClick={onRedTeamToggle}
                       className={`w-12 h-6 lg:w-14 lg:h-7 rounded-full p-1 transition-colors ${isRedTeamMode ? 'bg-[#ff4141]' : 'bg-[#3b0000]'}`}
                    >
                       <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-white transition-transform ${isRedTeamMode ? 'translate-x-6 lg:translate-x-7' : 'translate-x-0'}`} />
                    </button>
                 </div>
              </div>
           </NeoCard>
        </div>
      )}

      <NeoButton onClick={onBack} variant="secondary" className="w-full sm:w-auto text-xs py-3 lg:py-2">Return to Kernel</NeoButton>
    </div>
  );
};

// --- Main Menu ---
export const MainMenu: React.FC<{ 
  onStart: () => void, 
  onProfiles: () => void,
  onConfiguration: () => void
}> = ({ onStart, onProfiles, onConfiguration }) => {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[var(--bg-color)] p-4 lg:p-12 overflow-hidden">
       <div className="absolute inset-0 opacity-10 pointer-events-none bg-checkered"></div>
       
       <div className="text-[var(--primary)] font-mono whitespace-pre mb-6 lg:mb-12 text-[7px] sm:text-xs md:text-sm lg:text-base leading-none text-center drop-shadow-[0_0_10px_var(--primary)]">
{`
  _____ _   _  ____  ____  _____ _____ 
 | ____| \\ | |/ ___|/ __ \\|  _  \\ ____|
 |  _| |  \\| | |   | |  | | | | |  _|  
 | |___| |\\  | |___| |__| | |_| | |___ 
 |_____|_| \\_|\\____|\\____/|____/|_____|
      - PROJECT ENCODE TERMINAL V2.5 -
`}
       </div>

       <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[280px] sm:max-w-sm relative z-10">
          <NeoButton onClick={onStart} className="w-full py-4 lg:py-3">Initialize</NeoButton>
          <NeoButton onClick={onProfiles} className="w-full py-4 lg:py-3">User Profiles</NeoButton>
          <NeoButton onClick={onConfiguration} className="w-full py-4 lg:py-3">Config</NeoButton>
          <NeoButton variant="secondary" className="w-full py-4 lg:py-3">Terminate</NeoButton>
       </div>

       <div className="mt-8 lg:mt-12 text-center max-w-2xl border-t border-[var(--dim)] pt-6 opacity-40 hidden sm:block">
          <p className="text-[var(--primary)] italic font-mono text-xs">
             "{quote}"
          </p>
       </div>
       
       <div className="absolute bottom-2 right-4 text-[7px] lg:text-[10px] text-[var(--dim)] font-mono">
          CPU_LOAD: {Math.floor(Math.random() * 20)}% | RAM: 512MB
       </div>
    </div>
  );
};

// --- Profile Selection ---
interface ProfileSelectProps {
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  onSelect: (p: Profile) => void;
  onBack: () => void;
}

export const ProfileSelect: React.FC<ProfileSelectProps> = ({ profiles, setProfiles, onSelect, onBack }) => {
  const createProfile = () => {
    if (profiles.length >= 6) return;
    const newProfile: Profile = {
       id: Date.now().toString(),
       name: `USR_${profiles.length + 1}`,
       levelsCompleted: 0,
       errorsMade: 0,
       accuracyRate: 0,
       fastestClear: '--:--',
       retentionBest: 0,
       created: Date.now()
    };
    setProfiles([...profiles, newProfile]);
  };

  const deleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (id === 'sys_architect_001') {
      alert("SYSTEM ERROR: CANNOT DELETE ARCHITECT ENTITY.");
      return;
    }
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-4 lg:p-8 bg-[var(--bg-color)] overflow-y-auto">
       <div className="flex items-center gap-3 mb-6 lg:mb-10">
          <Monitor className="text-[var(--primary)]" size={24} />
          <h2 className="text-lg md:text-3xl font-bold tracking-widest uppercase text-[var(--primary)]">User Registry</h2>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-8 max-w-5xl w-full">
          {profiles.map(profile => (
             <NeoCard key={profile.id} className="cursor-pointer hover:bg-[var(--hover-bg)] group" title={profile.name}>
                <div className="p-3 lg:p-4" onClick={() => onSelect(profile)}>
                   <div className="text-[9px] lg:text-xs space-y-1 mb-4 opacity-80 text-[var(--text-color)]">
                      <p className="flex justify-between">COMPLETED: <span className="text-[var(--primary)]">{profile.levelsCompleted}</span></p>
                      <p className="flex justify-between">ACCURACY: <span className="text-[var(--primary)]">{profile.accuracyRate}%</span></p>
                      <p className="flex justify-between">RETENTION: <span className="text-yellow-400 font-bold">{profile.retentionBest}</span></p>
                   </div>
                   {profile.id !== 'sys_architect_001' ? (
                     <NeoButton 
                       variant="danger" 
                       className="w-full text-[9px] py-1.5"
                       onClick={(e) => deleteProfile(e, profile.id)}
                     >
                       WIPE
                     </NeoButton>
                   ) : (
                     <div className="flex items-center justify-center gap-2 py-1.5 text-[#ff4141] font-bold text-[9px] border border-[#ff4141]">
                        <ShieldCheck size={12} /> ADMIN
                     </div>
                   )}
                </div>
             </NeoCard>
          ))}
          
          {profiles.length < 6 && (
            <NeoCard className="border-dashed cursor-pointer hover:bg-[var(--hover-bg)]" title="NEW_REGISTRY">
               <div className="h-24 lg:h-32 flex flex-col items-center justify-center text-[var(--dim)] hover:text-[var(--primary)]" onClick={createProfile}>
                  <Plus size={32} />
                  <p className="text-[10px] font-bold uppercase mt-2">Initialize</p>
               </div>
            </NeoCard>
          )}
       </div>

       <div className="mt-auto sm:mt-0 pb-6 w-full max-w-[200px]">
          <NeoButton onClick={onBack} variant="secondary" className="w-full text-xs">Exit</NeoButton>
       </div>
    </div>
  );
};

// --- Level Select ---
export const LevelSelect: React.FC<{ 
  profile: Profile, 
  onLevelSelect: (l: Level) => void, 
  onRetentionStart: () => void,
  onBack: () => void 
}> = ({ profile, onLevelSelect, onRetentionStart, onBack }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-2 lg:p-8 gap-2 lg:gap-4 bg-[var(--bg-color)] overflow-hidden">
       <div className="flex items-center justify-between gap-2 border-b-2 border-[var(--primary)] pb-2 lg:pb-4 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4 truncate">
             <NeoButton variant="secondary" onClick={onBack} className="px-2 py-1.5 lg:px-3 lg:py-1 text-[8px] lg:text-xs whitespace-nowrap">
                {"<"} LOGOUT
             </NeoButton>
             <h1 className="text-sm lg:text-2xl font-black uppercase tracking-tighter text-[var(--primary)] truncate">Control // {profile.name}</h1>
          </div>
          <div className="text-[8px] lg:text-xs opacity-50 font-mono text-[var(--primary)] text-right shrink-0">
             LVL: {profile.levelsCompleted}
          </div>
       </div>
       
       <div className="flex flex-1 flex-col lg:flex-row gap-2 lg:gap-8 overflow-hidden pt-2">
        {/* Left: Mission Directory */}
        <div className="flex-1 overflow-y-auto space-y-2 lg:space-y-4 pr-1 lg:pr-4 pb-12 lg:pb-20 no-scrollbar">
            {/* Retention Mode Promo Card */}
            <div 
              className="bg-yellow-400/5 border-2 border-yellow-400 p-3 lg:p-4 cursor-pointer hover:bg-yellow-400/10 transition-all flex flex-col sm:flex-row justify-between items-center group shrink-0"
              onClick={onRetentionStart}
            >
               <div className="text-center sm:text-left">
                  <h3 className="text-base lg:text-xl font-black text-yellow-400 flex items-center gap-2 justify-center sm:justify-start">
                     <Zap className="fill-yellow-400" size={16} /> RETENTION_MODE
                  </h3>
                  <p className="text-[8px] lg:text-[10px] text-yellow-400/60 uppercase font-bold">High pressure neural stabilization.</p>
               </div>
               <div className="text-center sm:text-right mt-2 sm:mt-0">
                  <p className="text-[8px] lg:text-[10px] text-yellow-400/40 uppercase">Best Session</p>
                  <p className="text-lg lg:text-2xl font-black text-yellow-400">{profile.retentionBest} NODES</p>
               </div>
            </div>

            {MOCK_LEVELS.map((level) => (
              <div key={level.id} className="group relative">
                  <div 
                    className={`bg-[var(--card-bg)] border-2 border-[var(--primary)] hover:bg-[var(--hover-bg)] p-2.5 lg:p-4 cursor-pointer transition-colors flex justify-between items-center`}
                    onClick={() => onLevelSelect(level)}
                  >
                    <div className="flex-1 mr-2 truncate">
                       <span className="text-[var(--primary)] font-bold text-[8px] lg:text-sm block">NODE_{level.chapter}_{level.subChapter}:</span>
                       <h3 className="text-sm lg:text-xl font-bold uppercase tracking-widest text-[var(--text-color)] truncate">{level.title}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                       <p className="text-[8px] lg:text-[10px] opacity-60 mb-0.5 text-[var(--text-color)] truncate">{level.language}</p>
                       <span className={`text-[7px] lg:text-[10px] font-bold uppercase px-1.5 py-0.5 border ${
                         level.difficulty === 'Easy' ? 'border-[var(--primary)] text-[var(--primary)]' :
                         level.difficulty === 'Medium' ? 'border-yellow-400 text-yellow-400' : 'border-red-500 text-red-500'
                       }`}>
                         {level.difficulty}
                       </span>
                    </div>
                  </div>
              </div>
            ))}
        </div>

        {/* Right: Subsystem Status (Only Desktop) */}
        <div className="hidden lg:flex w-80 flex-col gap-4">
            <NeoCard title="NODE_STATISTICS">
              <div className="p-4 space-y-2 text-[10px] font-mono uppercase text-[var(--text-color)]">
                  <p>ACCURACY_COEFF: {profile.accuracyRate}</p>
                  <p>FAST_TIME: {profile.fastestClear}</p>
                  <p>RETENTION_MAX: {profile.retentionBest}</p>
                  <p className="pt-2 border-t border-[var(--dim)] text-red-500">THREAT_LEVEL: OMEGA</p>
              </div>
            </NeoCard>

            <NeoCard title="SUBSYSTEMS" className="bg-[var(--hover-bg)]">
               <div className="p-4 space-y-3 text-[var(--text-color)]">
                  <div className="flex justify-between items-center text-[10px]">
                     <span>NEURAL_LINK</span>
                     <span className="text-green-400">[ONLINE]</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span>COMPILER</span>
                     <span className="text-green-400">[ONLINE]</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span>RETENTION_ENGINE</span>
                     <span className="text-yellow-400">[READY]</span>
                  </div>
               </div>
            </NeoCard>
        </div>
       </div>
    </div>
  );
};
