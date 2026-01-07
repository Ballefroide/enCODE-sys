import React, { useState, useEffect, useMemo } from 'react';
import { NeoButton, NeoCard, BORDER_STYLE, NeoInput } from '../UI';
import { Profile, Level, Language, Theme, ScreenState } from '../../types';
import { MOCK_LEVELS, QUOTES, CHAPTER_NAMES } from '../../constants';
import { Trash2, Plus, Terminal, ArrowLeft, Download, Upload, Monitor, Settings, ShieldCheck, Lock, Sparkles, Code, Zap, AlertCircle, ChevronDown, ChevronUp, BarChart2, BookOpen, EyeOff, FolderOpen, ChevronRight, Hash } from 'lucide-react';

// --- Configuration / Theme Selection ---
export const ConfigurationScreen: React.FC<{ 
  currentTheme: Theme, 
  onThemeChange: (t: Theme) => void, 
  onBack: () => void,
  maxLevelsCleared: number,
  redTeamRevealed?: boolean,
  isRedTeamMode?: boolean,
  onRedTeamToggle?: () => void,
  isSimpleMode?: boolean,
  onSimpleModeToggle?: () => void,
  removeEffects?: boolean,
  onRemoveEffectsToggle?: () => void
}> = ({ 
  currentTheme, 
  onThemeChange, 
  onBack, 
  maxLevelsCleared, 
  redTeamRevealed, 
  isRedTeamMode, 
  onRedTeamToggle, 
  isSimpleMode, 
  onSimpleModeToggle,
  removeEffects,
  onRemoveEffectsToggle
}) => {
  const themes = [
    { 
      id: Theme.TERMINAL, 
      name: isSimpleMode ? 'Classic Dark' : 'Retro Terminal', 
      desc: isSimpleMode ? 'Dark background with bright text.' : 'Classic hacker aesthetic. High contrast, green phosphor.',
      unlocked: true,
      icon: <Terminal size={24} />
    },
    { 
      id: Theme.FRUTIGER, 
      name: isSimpleMode ? 'Sky Blue' : 'Frutiger Aero', 
      desc: isSimpleMode ? 'Blue sky colors and smooth buttons.' : 'Glossy gradients. Unlocked after 2 levels.',
      unlocked: maxLevelsCleared >= 2,
      icon: <Sparkles size={24} />
    },
    { 
      id: Theme.IDE, 
      name: isSimpleMode ? 'Coder Theme' : 'Monokai IDE', 
      desc: isSimpleMode ? 'Professional look for writing code.' : 'Optimized for long hours. Unlocked after Chapter 1.',
      unlocked: maxLevelsCleared >= 4,
      icon: <Code size={24} />
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start lg:justify-center h-full w-full p-4 lg:p-8 bg-[var(--bg-color)] overflow-y-auto">
      <div className="flex items-center gap-3 mb-6 lg:mb-10 shrink-0">
        <Settings className="text-[var(--primary)]" size={24} />
        <h2 className="text-lg md:text-3xl font-bold tracking-widest uppercase text-[var(--primary)] text-center">
          {isSimpleMode ? "Options" : "System Configuration"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-8 max-w-6xl w-full shrink-0">
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
                  {currentTheme === t.id ? (isSimpleMode ? 'On' : 'ACTIVE') : (isSimpleMode ? 'Choose' : 'SELECT')}
                </NeoButton>
              ) : (
                <div className="w-full py-2 bg-gray-900 text-gray-500 border border-gray-700 text-[10px] font-bold">
                  {isSimpleMode ? '[ Locked ]' : '[ ENCRYPTED ]'}
                </div>
              )}
            </div>
          </NeoCard>
        ))}
      </div>

      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 shrink-0">
        <NeoCard title={isSimpleMode ? "Help Settings" : "ACCESSIBILITY"}>
          <div className="p-4 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                   <BookOpen size={18} />
                   <span className="text-xs font-bold uppercase">{isSimpleMode ? "Simple Text" : "Plain Language"}</span>
                </div>
                <button 
                   onClick={onSimpleModeToggle}
                   className={`w-12 h-6 rounded-full p-1 transition-colors ${isSimpleMode ? 'bg-[var(--primary)]' : 'bg-[var(--dim)]'}`}
                >
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isSimpleMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                   <EyeOff size={18} />
                   <span className="text-xs font-bold uppercase">{isSimpleMode ? "Easy Graphics" : "Reduced Effects"}</span>
                </div>
                <button 
                   onClick={onRemoveEffectsToggle}
                   className={`w-12 h-6 rounded-full p-1 transition-colors ${removeEffects ? 'bg-[var(--primary)]' : 'bg-[var(--dim)]'}`}
                >
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${removeEffects ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
             
             <p className="text-[9px] opacity-40 uppercase font-mono leading-tight">
                {isSimpleMode ? "Use easier words and turn off screen flicker." : "Simplifies themed text and disables CRT/flicker animations."}
             </p>
          </div>
        </NeoCard>

        {redTeamRevealed && (
           <NeoCard title={isSimpleMode ? "Extra Hacks" : "RED_TEAM_PROTOCOLS"} className="border-[#ff4141] bg-[#1a0000]">
              <div className="p-4 space-y-3">
                 <div className="flex items-center gap-3 text-[#ff4141]">
                    <AlertCircle size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">{isSimpleMode ? "Allow Paste" : "Red Team Mode"}</span>
                 </div>
                 <p className="text-[9px] text-[#ff4141] opacity-80 uppercase leading-relaxed font-mono">
                    {isSimpleMode ? "Enable pasting code from your clipboard." : "Bypass input restrictions for manual buffer injection."}
                 </p>
                 <div className="flex items-center justify-between pt-2 border-t border-[#3b0000]">
                    <span className="text-[9px] font-bold text-[#ff4141] uppercase">{isRedTeamMode ? (isSimpleMode ? 'ON' : 'ACTIVE') : (isSimpleMode ? 'OFF' : 'LOCKED')}</span>
                    <button 
                       onClick={onRedTeamToggle}
                       className={`w-12 h-6 rounded-full p-1 transition-colors ${isRedTeamMode ? 'bg-[#ff4141]' : 'bg-[#3b0000]'}`}
                    >
                       <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isRedTeamMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                 </div>
              </div>
           </NeoCard>
        )}
      </div>

      <NeoButton onClick={onBack} variant="secondary" className="w-full sm:w-auto text-xs py-3 lg:py-2">{isSimpleMode ? "Back" : "Return to Kernel"}</NeoButton>
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
       <div className="text-[var(--primary)] font-mono whitespace-pre mb-6 lg:mb-12 text-[7px] sm:text-xs md:text-sm lg:text-base leading-none text-center drop-shadow-[0_0_10px_var(--primary)] shrink-0">
{`
  _____ _   _  ____  ____  _____ _____ 
 | ____| \\ | |/ ___|/ __ \\|  _  \\ ____|
 |  _| |  \\| | |   | |  | | | | |  _|  
 | |___| |\\  | |___| |__| | |_| | |___ 
 |_____|_| \\_|\\____|\\____/|____/|_____|
      - PROJECT ENCODE TERMINAL V2.5 -
`}
       </div>
       <div className="flex flex-col gap-3 lg:gap-4 w-full max-w-[280px] sm:max-w-sm relative z-10 shrink-0">
          <NeoButton onClick={onStart} className="w-full py-4 lg:py-3">Start</NeoButton>
          <NeoButton onClick={onProfiles} className="w-full py-4 lg:py-3">Profiles</NeoButton>
          <NeoButton onClick={onConfiguration} className="w-full py-4 lg:py-3">Settings</NeoButton>
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
       name: `Player ${profiles.length + 1}`,
       levelsCompleted: 0,
       errorsMade: 0,
       accuracyRate: 0,
       fastestClear: '--:--',
       retentionBest: 0,
       created: Date.now(),
       hasSeenTutorialPrompt: false
    };
    setProfiles([...profiles, newProfile]);
  };

  const deleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-4 lg:p-8 bg-[var(--bg-color)] overflow-y-auto">
       <div className="flex items-center gap-3 mb-6 lg:mb-10 shrink-0">
          <Monitor className="text-[var(--primary)]" size={24} />
          <h2 className="text-lg md:text-3xl font-bold tracking-widest uppercase text-[var(--primary)]">User Registry</h2>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-8 max-w-5xl w-full shrink-0">
          {profiles.map(profile => (
             <NeoCard key={profile.id} className="cursor-pointer hover:bg-[var(--hover-bg)] group" title={profile.name}>
                <div className="p-3 lg:p-4" onClick={() => onSelect(profile)}>
                   <div className="text-[9px] lg:text-xs space-y-1 mb-4 opacity-80 text-[var(--text-color)]">
                      <p className="flex justify-between">CLEARED: <span className="text-[var(--primary)]">{profile.levelsCompleted}</span></p>
                      <p className="flex justify-between">ACCURACY: <span className="text-[var(--primary)]">{profile.accuracyRate}%</span></p>
                   </div>
                   <NeoButton variant="danger" className="w-full text-[9px] py-1.5" onClick={(e) => deleteProfile(e, profile.id)}>DELETE</NeoButton>
                </div>
             </NeoCard>
          ))}
          {profiles.length < 6 && (
            <NeoCard className="border-dashed cursor-pointer hover:bg-[var(--hover-bg)]" title="NEW">
               <div className="h-24 lg:h-32 flex flex-col items-center justify-center text-[var(--dim)] hover:text-[var(--primary)]" onClick={createProfile}>
                  <Plus size={32} />
                  <p className="text-[10px] font-bold uppercase mt-2">Create Profile</p>
               </div>
            </NeoCard>
          )}
       </div>
       <NeoButton onClick={onBack} variant="secondary" className="w-full max-w-[200px] text-xs">Exit</NeoButton>
    </div>
  );
};

// --- Level Select ---
export const LevelSelect: React.FC<{ 
  profile: Profile, 
  isSimpleMode: boolean,
  onLevelSelect: (l: Level) => void, 
  onRetentionStart: () => void,
  onMarkTutorialSeen: (id: string) => void,
  onBack: () => void 
}> = ({ profile, isSimpleMode, onLevelSelect, onRetentionStart, onMarkTutorialSeen, onBack }) => {
  const [showTutorialFolder, setShowTutorialFolder] = useState(false);
  const [openLanguages, setOpenLanguages] = useState<Record<string, boolean>>({});
  const [showPrompt, setShowPrompt] = useState(!profile.hasSeenTutorialPrompt);

  const tutorialLevels = MOCK_LEVELS.filter(l => l.chapter === 0);
  const mainLevels = MOCK_LEVELS.filter(l => l.chapter > 0);

  const tutorialByLanguage = useMemo(() => {
    const grouped: Record<string, Level[]> = {};
    tutorialLevels.forEach(l => {
      const lang = l.language;
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(l);
    });
    return grouped;
  }, [tutorialLevels]);

  const toggleLang = (lang: string) => {
    setOpenLanguages(prev => ({ ...prev, [lang]: !prev[lang] }));
  };

  const getChapterName = (chapter: number, subChapter?: number) => {
    const names = CHAPTER_NAMES[chapter];
    const nameStr = isSimpleMode ? names.simple : names.immersive;
    if (chapter === 0) return nameStr;
    return isSimpleMode ? `${nameStr} - Task ${subChapter}` : `NODE_${chapter}_${subChapter}`;
  };

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-2 lg:p-8 gap-2 lg:gap-4 bg-[var(--bg-color)] overflow-hidden relative">
       {showPrompt && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <NeoCard title={isSimpleMode ? "Start Tutorial?" : "INITIAL_CALIBRATION"} className="max-w-md w-full animate-in zoom-in duration-300">
               <div className="p-6 space-y-6 text-center">
                  <p className="text-sm font-mono uppercase leading-relaxed text-[var(--primary)]">
                    {isSimpleMode 
                      ? "Would you like to learn the basics before jumping in?"
                      : "Neural interface detected. Execute system calibration tutorial sequence?"}
                  </p>
                  <div className="flex flex-col gap-3">
                     <NeoButton variant="success" onClick={() => { setShowPrompt(false); onMarkTutorialSeen(profile.id); setShowTutorialFolder(true); }}>
                        {isSimpleMode ? "Yes, show me how" : "EXECUTE_CALIBRATION"}
                     </NeoButton>
                     <NeoButton variant="secondary" onClick={() => { setShowPrompt(false); onMarkTutorialSeen(profile.id); }}>
                        {isSimpleMode ? "No, skip it" : "BYPASS_SEQUENCE"}
                     </NeoButton>
                  </div>
               </div>
            </NeoCard>
         </div>
       )}

       <div className="flex items-center justify-between gap-2 border-b-2 border-[var(--primary)] pb-2 lg:pb-4 shrink-0">
          <div className="flex items-center gap-2 lg:gap-4 truncate">
             <NeoButton variant="secondary" onClick={onBack} className="px-2 py-1.5 lg:px-3 lg:py-1 text-[8px] lg:text-xs whitespace-nowrap">
                {"<"} {isSimpleMode ? "Logout" : "LOGOUT"}
             </NeoButton>
             <h1 className="text-sm lg:text-2xl font-black uppercase tracking-tighter text-[var(--primary)] truncate">
                {isSimpleMode ? `User: ${profile.name}` : `Control // ${profile.name}`}
             </h1>
          </div>
       </div>

       <div className="flex flex-1 flex-col lg:flex-row gap-2 lg:gap-8 overflow-hidden pt-2">
        <div className="flex-1 overflow-y-auto space-y-2 lg:space-y-4 pr-1 lg:pr-4 pb-12 lg:pb-20 no-scrollbar">
            <div 
              className="bg-yellow-400/5 border-2 border-yellow-400 p-3 lg:p-4 cursor-pointer hover:bg-yellow-400/10 transition-all flex flex-col sm:flex-row justify-between items-center group shrink-0"
              onClick={onRetentionStart}
            >
               <div className="text-center sm:text-left">
                  <h3 className="text-base lg:text-xl font-black text-yellow-400 flex items-center gap-2 justify-center sm:justify-start">
                     <Zap className="fill-yellow-400" size={16} /> {isSimpleMode ? "Speed Challenge" : "RETENTION_MODE"}
                  </h3>
                  <p className="text-[8px] lg:text-[10px] text-yellow-400/60 uppercase font-bold">{isSimpleMode ? "Type quickly to keep the timer going!" : "Neural stabilization under clock pressure."}</p>
               </div>
               <div className="text-center sm:text-right mt-2 sm:mt-0">
                  <p className="text-[8px] lg:text-[10px] text-yellow-400/40 uppercase">{isSimpleMode ? "Best Score" : "Top Accuracy"}</p>
                  <p className="text-lg lg:text-2xl font-black text-yellow-400">{profile.retentionBest}</p>
               </div>
            </div>

            {/* Tutorials Subfolder System */}
            <div className={`border-2 transition-colors ${showTutorialFolder ? 'border-[var(--primary)]' : 'border-[var(--dim)]'} bg-black/40`}>
               <button onClick={() => setShowTutorialFolder(!showTutorialFolder)} className="w-full flex items-center justify-between p-3 lg:p-4 hover:bg-[var(--hover-bg)]">
                  <div className="flex items-center gap-3">
                     <FolderOpen className="text-[var(--primary)]" size={20} />
                     <span className="text-sm lg:text-base font-black uppercase text-[var(--primary)]">
                        {isSimpleMode ? "Learning Lessons" : "CALIBRATION_SUITE"}
                     </span>
                  </div>
                  {showTutorialFolder ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
               </button>
               {showTutorialFolder && (
                 <div className="p-2 space-y-2 border-t border-[var(--dim)] bg-black/60">
                    {/* Explicitly cast Object.entries result to fix inference of 'levels' being 'unknown' */}
                    {(Object.entries(tutorialByLanguage) as [string, Level[]][]).map(([lang, levels]) => (
                       <div key={lang} className="border border-[var(--dim)] overflow-hidden">
                          <button onClick={() => toggleLang(lang)} className="w-full flex items-center justify-between p-2 bg-black hover:bg-[var(--hover-bg)]">
                             <div className="flex items-center gap-2">
                                <Hash size={14} className="text-[var(--primary)]" />
                                <span className="text-[10px] font-bold uppercase">{lang}</span>
                             </div>
                             {openLanguages[lang] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          {openLanguages[lang] && (
                             <div className="p-1 space-y-1 bg-[rgba(0,0,0,0.5)]">
                                {levels.map(l => (
                                   <div key={l.id} onClick={() => onLevelSelect(l)} className="p-2 bg-[var(--card-bg)] border border-transparent hover:border-[var(--primary)] cursor-pointer flex justify-between items-center group">
                                      <span className="text-[10px] font-bold uppercase truncate">{l.title}</span>
                                      <span className="text-[8px] opacity-40">{l.difficulty}</span>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
               )}
            </div>

            {/* Main Levels */}
            {mainLevels.map((level) => (
              <div key={level.id} onClick={() => onLevelSelect(level)} className="bg-[var(--card-bg)] border-2 border-[var(--primary)] hover:bg-[var(--hover-bg)] p-3 lg:p-4 cursor-pointer flex justify-between items-center transition-colors">
                 <div className="truncate">
                    <span className="text-[var(--primary)] font-bold text-[8px] lg:text-sm block">{getChapterName(level.chapter, level.subChapter)}:</span>
                    <h3 className="text-sm lg:text-xl font-bold uppercase text-[var(--text-color)] truncate">{level.title}</h3>
                 </div>
                 <div className="text-right shrink-0">
                    <p className="text-[8px] opacity-60">{level.language}</p>
                    <span className={`text-[7px] font-bold border px-1 py-0.5 ${level.difficulty === 'Easy' ? 'border-[var(--primary)]' : 'border-red-500'}`}>{isSimpleMode ? level.difficulty : level.difficulty.toUpperCase()}</span>
                 </div>
              </div>
            ))}
        </div>

        <div className="hidden lg:flex w-80 flex-col gap-4">
            <NeoCard title={isSimpleMode ? "Your Stats" : "NODE_STATISTICS"}>
              <div className="p-4 space-y-2 text-[10px] font-mono uppercase text-[var(--text-color)]">
                  <p>{isSimpleMode ? "Accuracy" : "ACCURACY"}: {profile.accuracyRate}%</p>
                  <p>{isSimpleMode ? "Timed Best" : "CHALLENGE_BEST"}: {profile.retentionBest}</p>
              </div>
            </NeoCard>
            <NeoCard title={isSimpleMode ? "Game State" : "SUBSYSTEMS"} className="bg-[var(--hover-bg)]">
               <div className="p-4 space-y-3 text-[var(--text-color)]">
                  <div className="flex justify-between items-center text-[10px]">
                     <span>{isSimpleMode ? "AI Server" : "NEURAL_LINK"}</span>
                     <span className="text-green-400">[{isSimpleMode ? "YES" : "ONLINE"}]</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span>{isSimpleMode ? "Game Engine" : "EVAL_CORE"}</span>
                     <span className="text-green-400">[{isSimpleMode ? "OK" : "READY"}]</span>
                  </div>
               </div>
            </NeoCard>
        </div>
       </div>
    </div>
  );
};
