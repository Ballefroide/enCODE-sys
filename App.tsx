
import React, { useState, useEffect, useMemo } from 'react';
import { ScreenState, Profile, Level, GameSession, Theme } from './types';
import { MainMenu, ProfileSelect, LevelSelect, ConfigurationScreen } from './components/screens/MenuScreens';
import { LevelBriefing, Gameplay, ResultScreen, RetentionGameplay } from './components/screens/GameScreens';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.MENU);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [lastSession, setLastSession] = useState<GameSession | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('encode_theme') as Theme) || Theme.TERMINAL;
  });

  // Accessibility State: Plain Language Mode
  const [isSimpleMode, setIsSimpleMode] = useState(() => {
    return localStorage.getItem('encode_simple_mode') === 'true';
  });

  // Accessibility State: Reduced Visual Effects
  const [removeEffects, setRemoveEffects] = useState(() => {
    return localStorage.getItem('encode_remove_effects') === 'true';
  });

  // Anti-cheat / Red Team Mode State
  const [isRedTeamMode, setIsRedTeamMode] = useState(() => {
    return localStorage.getItem('encode_red_team') === 'true';
  });
  const [redTeamRevealed, setRedTeamRevealed] = useState(() => {
    return localStorage.getItem('encode_red_team_revealed') === 'true';
  });
  const [headerTapCount, setHeaderTapCount] = useState(0);

  // Centralized Profiles State
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('encode_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync profiles to localStorage
  useEffect(() => {
    localStorage.setItem('encode_profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('encode_theme', theme);
    document.documentElement.setAttribute('data-theme', theme.toLowerCase());
  }, [theme]);

  // Sync Accessibility modes
  useEffect(() => {
    localStorage.setItem('encode_simple_mode', isSimpleMode.toString());
  }, [isSimpleMode]);

  useEffect(() => {
    localStorage.setItem('encode_remove_effects', removeEffects.toString());
    if (removeEffects) {
      document.body.classList.add('effects-disabled');
    } else {
      document.body.classList.remove('effects-disabled');
    }
  }, [removeEffects]);

  // Sync Red Team mode
  useEffect(() => {
    localStorage.setItem('encode_red_team', isRedTeamMode.toString());
    localStorage.setItem('encode_red_team_revealed', redTeamRevealed.toString());
    if (isRedTeamMode) {
      document.documentElement.classList.add('red-team-active');
    } else {
      document.documentElement.classList.remove('red-team-active');
    }
  }, [isRedTeamMode, redTeamRevealed]);

  const maxLevelsCleared = useMemo(() => {
    if (profiles.length === 0) return 0;
    return Math.max(...profiles.map(p => p.levelsCompleted), 0);
  }, [profiles]);

  const currentProfile = useMemo(() => 
    profiles.find(p => p.id === currentProfileId) || null, 
  [profiles, currentProfileId]);

  const handleStart = () => setScreen(ScreenState.PROFILES);
  
  const handleProfileSelect = (p: Profile) => {
    setCurrentProfileId(p.id);
    setScreen(ScreenState.LEVEL_SELECT);
  };

  const handleMarkTutorialSeen = (profileId: string) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, hasSeenTutorialPrompt: true } : p));
  };

  const handleLevelSelect = (l: Level) => {
    setCurrentLevel(l);
    setScreen(ScreenState.BRIEFING);
  };

  const handleStartLevel = () => setScreen(ScreenState.GAMEPLAY);
  const handleStartRetention = () => setScreen(ScreenState.RETENTION_MODE);

  const handleGameFinish = (session: GameSession) => {
    setLastSession(session);
    setScreen(ScreenState.RESULT);
    
    if (currentProfileId) {
       setProfiles(prev => prev.map(p => {
         if (p.id === currentProfileId) {
            if (session.isRetention) {
              return {
                ...p,
                retentionBest: Math.max(p.retentionBest, session.score || 0)
              };
            }
            // Track level ID as a number for unlock logic
            const currentIdNum = parseInt(currentLevel?.id.replace('-', '.') || "0");
            return {
              ...p,
              levelsCompleted: Math.max(p.levelsCompleted, currentIdNum),
              accuracyRate: Math.max(p.accuracyRate, session.accuracy)
            };
         }
         return p;
       }));
    }
  };

  const handleNextLevel = () => setScreen(ScreenState.LEVEL_SELECT);
  const handleRetry = () => {
    if (lastSession?.isRetention) {
      setScreen(ScreenState.RETENTION_MODE);
    } else {
      setScreen(ScreenState.GAMEPLAY);
    }
  };

  const handleHeaderClick = () => {
    if (!currentProfileId) {
      const nextCount = headerTapCount + 1;
      setHeaderTapCount(nextCount);
      if (nextCount >= 5 && !redTeamRevealed) {
        setRedTeamRevealed(true);
        alert("CRITICAL_ERROR: Anti-Cheat sub-routines exposed. Red Team Mode Available in Configuration.");
      }
    }
  };

  return (
    <div className={`w-full h-screen bg-[var(--bg-color)] text-[var(--primary)] font-mono selection:bg-[var(--dim)] selection:text-[var(--primary)] overflow-hidden flex flex-col theme-${theme.toLowerCase()} ${isRedTeamMode ? 'red-team-active' : ''}`}>
      {!currentProfileId && (
        <div 
          onClick={handleHeaderClick}
          className={`hidden sm:block absolute top-2 right-4 text-[10px] opacity-20 z-50 font-bold uppercase tracking-widest text-[var(--primary)] cursor-pointer select-none`}
        >
           PROJECT_ENCODE_V2.5 // {theme}_ENGINE_RUNNING {isRedTeamMode ? '[RED_TEAM_ACTIVE]' : ''}
        </div>
      )}

      <main className="flex-1 w-full h-full relative">
        {screen === ScreenState.MENU && (
          <MainMenu 
            onStart={handleStart} 
            onProfiles={() => setScreen(ScreenState.PROFILES)}
            onConfiguration={() => setScreen(ScreenState.OPTIONS)}
          />
        )}
        
        {screen === ScreenState.OPTIONS && (
          <ConfigurationScreen 
             currentTheme={theme} 
             onThemeChange={setTheme} 
             onBack={() => setScreen(ScreenState.MENU)}
             maxLevelsCleared={maxLevelsCleared}
             redTeamRevealed={redTeamRevealed}
             isRedTeamMode={isRedTeamMode}
             onRedTeamToggle={() => setIsRedTeamMode(!isRedTeamMode)}
             isSimpleMode={isSimpleMode}
             onSimpleModeToggle={() => setIsSimpleMode(!isSimpleMode)}
             removeEffects={removeEffects}
             onRemoveEffectsToggle={() => setRemoveEffects(!removeEffects)}
          />
        )}

        {screen === ScreenState.PROFILES && (
          <ProfileSelect 
            profiles={profiles}
            setProfiles={setProfiles}
            onSelect={handleProfileSelect} 
            onBack={() => setScreen(ScreenState.MENU)} 
          />
        )}

        {screen === ScreenState.LEVEL_SELECT && currentProfile && (
          <LevelSelect 
            profile={currentProfile} 
            isSimpleMode={isSimpleMode}
            onLevelSelect={handleLevelSelect} 
            onRetentionStart={handleStartRetention}
            onMarkTutorialSeen={handleMarkTutorialSeen}
            onBack={() => {
              setCurrentProfileId(null);
              setScreen(ScreenState.PROFILES);
            }}
          />
        )}

        {screen === ScreenState.BRIEFING && currentLevel && (
           <LevelBriefing level={currentLevel} onStart={handleStartLevel} onBack={() => setScreen(ScreenState.LEVEL_SELECT)} isSimpleMode={isSimpleMode} />
        )}

        {screen === ScreenState.GAMEPLAY && currentLevel && (
           <Gameplay 
             level={currentLevel} 
             onFinish={handleGameFinish} 
             onExit={() => setScreen(ScreenState.LEVEL_SELECT)}
             isAntiCheatEnabled={!isRedTeamMode}
             isSimpleMode={isSimpleMode}
           />
        )}

        {screen === ScreenState.RETENTION_MODE && (
           <RetentionGameplay 
             onFinish={handleGameFinish}
             onExit={() => setScreen(ScreenState.LEVEL_SELECT)}
             isAntiCheatEnabled={!isRedTeamMode}
             isSimpleMode={isSimpleMode}
           />
        )}

        {screen === ScreenState.RESULT && lastSession && (
           <ResultScreen session={lastSession} onNext={handleNextLevel} onRetry={handleRetry} isSimpleMode={isSimpleMode} />
        )}
      </main>
    </div>
  );
};

export default App;
