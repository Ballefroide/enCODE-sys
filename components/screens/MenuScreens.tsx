
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
      desc: 'Glossy gradients and sky-blue dreams. Unlocked after 2 levels.',
      unlocked: maxLevelsCleared >= 2,
      icon: <Sparkles size={24} />
    },
    { 
      id: Theme.IDE, 
      name: 'Monokai IDE', 
      desc: 'Professional environment. Optimized for long hours. Unlocked after Chapter 1 (4 Levels).',
      unlocked: maxLevelsCleared >= 4,
      icon: <Code size={24} />
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 lg:p-8 bg-[var(--bg-color)] overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <Settings className="text-[var(--primary)]" size={32} />
        <h2 className="text-xl md:text-3xl font-bold tracking-widest uppercase text-[var(--primary)] text-center">System Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl w-full">
        {themes.map(t => (
          <NeoCard 
            key={t.id} 
            title={t.name} 
            className={`transition-all ${currentTheme === t.id ? 'scale-105 border-[var(--primary)] ring-2 ring-[var(--primary)]' : t.unlocked ? 'opacity-80' : 'opacity-40'}`}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className={`p-4 rounded-full ${t.unlocked ? 'bg-[var(--primary)] text-black' : 'bg-gray-800 text-gray-400'}`}>
                {t.unlocked ? t.icon : <Lock size={24} />}
              </div>
              <p className="text-sm font-mono leading-tight">{t.desc}</p>
              
              {t.unlocked ? (
                <NeoButton 
                  onClick={() => onThemeChange(t.id)} 
                  variant={currentTheme === t.id ? 'success' : 'primary'}
                  className="w-full text-sm"
                >
                  {currentTheme === t.id ? 'ACTIVE' : 'SELECT_THEME'}
                </NeoButton>
              ) : (
                <div className="w-full py-2 bg-gray-900 text-gray-500 border border-gray-700 text-xs font-bold">
                  [ ENCRYPTED ]
                </div>
              )}
            </div>
          </NeoCard>
        ))}
      </div>

      {redTeamRevealed && (
        <div className="max-w-md w-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <NeoCard title="UNAUTHORIZED_ACCESS" className="border-[#ff4141] bg-[#1a0000]">
              <div className="p-6 space-y-4">
                 <div className="flex items-center gap-3 text-[#ff4141]">
                    <AlertCircle size={20} />
                    <span className="text-sm font-black uppercase tracking-widest">Red Team Protocols</span>
                 </div>
                 <p className="text-[10px] text-[#ff4141] opacity-80 uppercase leading-relaxed font-mono">
                    Enabling "Red Team Mode" bypasses native Anti-Cheat subroutines. 
                    Warning: User integrity checks will be disabled. 
                    Clipboard buffer injection (Paste) will be permitted.
                 </p>
                 <div className="flex items-center justify-between pt-4 border-t border-[#3b0000]">
                    <span className="text-xs font-bold text-[#ff4141] uppercase">Status: {isRedTeamMode ? 'BYPASS_ACTIVE' : 'LOCKED'}</span>
                    <button 
                       onClick={onRedTeamToggle}
                       className={`w-14 h-7 rounded-full p-1 transition-colors ${isRedTeamMode ? 'bg-[#ff4141]' : 'bg-[#3b0000]'}`}
                    >
                       <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isRedTeamMode ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                 </div>
              </div>
           </NeoCard>
        </div>
      )}

      <NeoButton onClick={onBack} variant="secondary" className="w-full sm:w-auto">Return to Kernel</NeoButton>
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
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[var(--bg-color)] p-6 lg:p-12 overflow-hidden">
       {/* Visual decoration for themes */}
       <div className="absolute inset-0 opacity-10 pointer-events-none bg-checkered"></div>
       
       <div className="text-[var(--primary)] font-mono whitespace-pre mb-8 lg:mb-12 text-[8px] sm:text-xs md:text-sm lg:text-base leading-none text-center drop-shadow-[0_0_10px_var(--primary)]">
{`
  _____ _   _  ____  ____  _____ _____ 
 | ____| \\ | |/ ___|/ __ \\|  _  \\ ____|
 |  _| |  \\| | |   | |  | | | | |  _|  
 | |___| |\\  | |___| |__| | |_| | |___ 
 |_____|_| \\_|\\____|\\____/|____/|_____|
      - PROJECT ENCODE TERMINAL V2.5 -
`}
       </div>

       <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-sm relative z-10">
          <NeoButton onClick={onStart} className="w-full py-3 lg:py-2">Initialize System</NeoButton>
          <NeoButton onClick={onProfiles} className="w-full py-3 lg:py-2">User Profiles</NeoButton>
          <NeoButton onClick={onConfiguration} className="w-full py-3 lg:py-2">Configuration</NeoButton>
          <NeoButton variant="secondary" className="w-full py-3 lg:py-2">Terminate</NeoButton>
       </div>

       <div className="mt-8 lg:mt-12 text-center max-w-2xl border-t border-[var(--dim)] pt-6 opacity-60 hidden sm:block">
          <p className="text-[var(--primary)] italic font-mono text-xs lg:text-sm">
             "{quote}"
          </p>
       </div>
       
       <div className="absolute bottom-4 right-4 text-[8px] lg:text-[10px] text-[var(--dim)] font-mono">
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
    <div className="flex flex-col items-center justify-center h-full w-full p-4 lg:p-8 bg-[var(--bg-color)] overflow-y-auto">
       <div className="flex items-center gap-4 mb-8">
          <Monitor className="text-[var(--primary)]" size={32} />
          <h2 className="text-xl md:text-3xl font-bold tracking-widest uppercase text-[var(--primary)]">User Registry</h2>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12 max-w-5xl w-full">
          {profiles.map(profile => (
             <NeoCard key={profile.id} className="cursor-pointer hover:bg-[var(--hover-bg)] group" title={profile.name}>
                <div className="p-4" onClick={() => onSelect(profile)}>
                   <div className="text-xs space-y-1 mb-4 opacity-80 text-[var(--text-color)]">
                      <p className="flex justify-between">COMPLETED: <span className="text-[var(--primary)]">{profile.levelsCompleted}</span></p>
                      <p className="flex justify-between">ACCURACY: <span className="text-[var(--primary)]">{profile.accuracyRate}%</span></p>
                      <p className="flex justify-between">BEST_TIME: <span className="text-[var(--primary)]">{profile.fastestClear}</span></p>
                      <p className="flex justify-between">RETENTION: <span className="text-yellow-400 font-bold">{profile.retentionBest} NODES</span></p>
                   </div>
                   {profile.id !== 'sys_architect_001' && (
                     <NeoButton 
                       variant="danger" 
                       className="w-full text-xs py-1"
                       onClick={(e) => deleteProfile(e, profile.id)}
                     >
                       WIPE_USER
                     </NeoButton>
                   )}
                   {profile.id === 'sys_architect_001' && (
                     <div className="flex items-center justify-center gap-2 py-2 text-[#ff4141] font-bold text-xs border border-[#ff4141]">
                        <ShieldCheck size={14} /> SYSTEM ADMIN
                     </div>
                   )}
                </div>
             </NeoCard>
          ))}
          
          {profiles.length < 6 && (
            <NeoCard className="border-dashed cursor-pointer hover:bg-[var(--hover-bg)]" title="NEW_REGISTRY">
               <div className="h-32 flex flex-col items-center justify-center text-[var(--dim)] hover:text-[var(--primary)]" onClick={createProfile}>
                  <Plus size={48} />
                  <p className="text-sm font-bold uppercase mt-2">Initialize User</p>
               </div>
            </NeoCard>
          )}
       </div>

       <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl w-full">
          <NeoButton onClick={onBack} variant="secondary" className="w-full sm:w-auto">Exit to BIOS</NeoButton>
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
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 lg:p-8 gap-4 bg-[var(--bg-color)] overflow-hidden">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[var(--primary)] pb-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <NeoButton variant="secondary" onClick={onBack} className="px-3 py-1 text-xs whitespace-nowrap">
                {"<"} LOGOUT
             </NeoButton>
             <h1 className="text-lg lg:text-2xl font-black uppercase tracking-tighter text-[var(--primary)] truncate">Control // {profile.name}</h1>
          </div>
          <div className="text-[10px] lg:text-xs opacity-50 font-mono text-[var(--primary)] w-full sm:w-auto text-center sm:text-right">
             LVL_COMP: {profile.levelsCompleted} | ERR_RATE: {(profile.errorsMade / 100).toFixed(2)}%
          </div>
       </div>
       
       <div className="flex flex-1 flex-col lg:flex-row gap-4 lg:gap-8 overflow-hidden pt-4">
        {/* Left: Mission Directory */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-0 lg:pr-4 pb-10 lg:pb-20 no-scrollbar">
            {/* Retention Mode Promo Card */}
            <div 
              className="bg-yellow-400/5 border-2 border-yellow-400 p-4 cursor-pointer hover:bg-yellow-400/10 transition-all flex flex-col sm:flex-row justify-between items-center group mb-4"
              onClick={onRetentionStart}
            >
               <div>
                  <h3 className="text-xl font-black text-yellow-400 flex items-center gap-2">
                     <Zap className="fill-yellow-400" /> RETENTION_MODE_v1.0
                  </h3>
                  <p className="text-[10px] text-yellow-400/60 uppercase font-bold">Limited uplink time. Random nodes. Survival logic.</p>
               </div>
               <div className="text-right mt-4 sm:mt-0">
                  <p className="text-[10px] text-yellow-400/40 uppercase">Best Session</p>
                  <p className="text-2xl font-black text-yellow-400">{profile.retentionBest} NODES</p>
               </div>
            </div>

            {MOCK_LEVELS.map((level) => (
              <div key={level.id} className="group relative">
                  <div 
                    className={`bg-[var(--card-bg)] border-2 border-[var(--primary)] hover:bg-[var(--hover-bg)] p-3 lg:p-4 cursor-pointer transition-colors flex justify-between items-center`}
                    onClick={() => onLevelSelect(level)}
                  >
                    <div className="flex-1 mr-2">
                       <span className="text-[var(--primary)] font-bold text-[10px] lg:text-sm block">NODE_{level.chapter}_{level.subChapter}:</span>
                       <h3 className="text-base lg:text-xl font-bold uppercase tracking-widest text-[var(--text-color)] truncate">{level.title}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                       <p className="text-[10px] opacity-60 mb-1 text-[var(--text-color)]">{level.language}</p>
                       <span className={`text-[8px] lg:text-[10px] font-bold uppercase px-2 py-0.5 border ${
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

        {/* Right: Subsystem Status */}
        <div className="w-full lg:w-80 flex flex-col gap-4 mt-auto lg:mt-0">
            <NeoCard title="NODE_STATISTICS" className="hidden sm:block">
              <div className="p-4 space-y-2 text-[10px] font-mono uppercase text-[var(--text-color)]">
                  <p>ACCURACY_COEFF: {profile.accuracyRate}</p>
                  <p>FAST_TIME: {profile.fastestClear}</p>
                  <p>RETENTION_MAX: {profile.retentionBest}</p>
                  <p className="pt-2 border-t border-[var(--dim)] text-red-500">THREAT_LEVEL: OMEGA</p>
              </div>
            </NeoCard>

            <NeoCard title="SUBSYSTEMS" className="bg-[var(--hover-bg)] hidden lg:block">
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
