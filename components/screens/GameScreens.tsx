
import React, { useState, useEffect, useRef } from 'react';
import { Level, GameSession, Language } from '../../types';
import { NeoButton, NeoCard, BORDER_STYLE } from '../UI';
import { evaluateCodeSubmission, EvaluationResult } from '../../services/geminiService';
import { ArrowLeft, Play, Code2, Send, LogOut, Terminal as TermIcon, FileCode, Eye, Monitor, Timer, AlertTriangle, Zap } from 'lucide-react';
import { MOCK_LEVELS } from '../../constants';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';

// --- Level Briefing Screen ---
interface BriefingProps {
  level: Level;
  onStart: () => void;
  onBack: () => void;
}

export const LevelBriefing: React.FC<BriefingProps> = ({ level, onStart, onBack }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 gap-4 bg-black overflow-y-auto lg:overflow-hidden">
      <div className={`w-full border-2 border-[var(--primary)] bg-[var(--hover-bg)] p-4 text-center`}>
         <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest">MISSION BRIEFING: {level.title}</h1>
      </div>
      
      <div className="flex-1 flex flex-col md:grid md:grid-cols-3 gap-6">
        <NeoCard title="CLIENT_METADATA" className="md:col-span-1">
          <div className="p-4 space-y-4 text-xs">
            <div className="border border-[var(--dim)] p-3">
              <p className="font-bold text-[var(--primary)]">SENDER: {level.chapter === 0 ? 'ROOT_ADMIN' : 'ANONYMOUS_SOURCE'}</p>
              <p className="opacity-60">CLASS: {level.difficulty === 'Hard' ? 'ULTRA_PRIORITY' : 'HIGH_PRIORITY'}</p>
            </div>
            <div className="border border-[var(--dim)] p-3 opacity-20 hidden md:block">
               <p>REDACTED</p>
            </div>
          </div>
        </NeoCard>

        <NeoCard title="MISSION_OBJECTIVES" className="md:col-span-2">
          <div className="p-6 flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono uppercase mb-6">
                {level.description}
              </p>
              <div className="p-4 bg-[var(--hover-bg)] border border-dashed border-[var(--primary)]">
                <p className="font-bold text-xs uppercase text-[var(--primary)] mb-1">REQ_LOGIC:</p>
                <p className="text-xs">{level.objective}</p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="text-center sm:text-left">
                  <p className="text-xs font-bold">DIFF: {level.difficulty}</p>
                  <p className="text-[10px] opacity-40 uppercase">Expected Cycles: 3200ms</p>
               </div>
               <NeoButton 
                  onClick={onStart}
                  variant="success"
                  className="w-full sm:w-auto px-10 py-4 text-2xl"
               >
                  EXECUTE
               </NeoButton>
            </div>
          </div>
        </NeoCard>
      </div>
       <div className="w-full mt-auto">
         <NeoButton variant="secondary" onClick={onBack} className="text-xs w-full sm:w-auto">{"<"} RETURN_TO_MAP</NeoButton>
      </div>
    </div>
  );
};

// --- Gameplay Utility ---
const highlightCode = (code: string, language: Language) => {
  let grammar = Prism.languages.javascript;
  if (language === Language.HTML) grammar = Prism.languages.markup || Prism.languages.html;
  if (language === Language.CSS) grammar = Prism.languages.css;
  if (language === Language.CPP || language === Language.JAVA) grammar = Prism.languages.clike;
  if (!grammar) return code;
  return Prism.highlight(code, grammar, language.toLowerCase());
}

// --- Gameplay Editor Screen ---
interface GameplayProps {
  level: Level;
  onFinish: (session: GameSession) => void;
  onExit: () => void;
  isAntiCheatEnabled: boolean;
}

export const Gameplay: React.FC<GameplayProps> = ({ level, onFinish, onExit, isAntiCheatEnabled }) => {
  const [code, setCode] = useState<string>(level.language === Language.HTML ? '<h1>Hello World</h1>' : '// USER CODE HERE\n');
  const [output, setOutput] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  
  // Mobile UI View State
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (showComparison) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [showComparison]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleCompile = () => {
    if (level.language === Language.HTML || level.language === Language.CSS) {
       setOutput(code);
    } else {
       setOutput(`[SYSTEM] COMPILING ${level.language}...\n[SYSTEM] SYMBOL TABLE GENERATED.\n[SYSTEM] CODE BLOCK EXECUTED SUCCESSFULLY.\n[STDOUT] Logic analysis required for verification.`);
    }
    if (window.innerWidth < 1024) {
      setActiveTab('preview');
    }
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);
    setShowComparison(true);
    const result = await evaluateCodeSubmission(level.objective, code, level.language);
    setEvalResult(result);
    setIsEvaluating(false);
  };

  const finalizeLevel = () => {
    if (!evalResult) return;
    let grade: GameSession['grade'] = 'F';
    if (evalResult.score >= 95) grade = 'S';
    else if (evalResult.score >= 85) grade = 'A';
    else if (evalResult.score >= 70) grade = 'B';
    else if (evalResult.score >= 50) grade = 'C';
    else grade = 'D';

    onFinish({
      levelId: level.id,
      startTime: Date.now() - (timer * 1000),
      attempts: 1,
      code,
      accuracy: evalResult.score,
      timeElapsed: formatTime(timer),
      grade
    });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isAntiCheatEnabled) {
      e.preventDefault();
      alert("ANTI_CHEAT: PASTE_COMMAND_INTERCEPTED. MANUAL_INPUT_MANDATORY.");
    }
  };

  if (showComparison) {
    return (
      <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 items-center justify-center gap-4 lg:gap-8 bg-black overflow-y-auto">
         <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-center items-center">
            <NeoCard title="ACTUAL_BYTE_STREAM" className="w-full lg:w-1/3 h-[200px] lg:h-[500px]">
               <div className="p-4 h-full overflow-auto text-[10px] font-mono">
                  {level.language === Language.HTML || level.language === Language.CSS ? (
                    <div dangerouslySetInnerHTML={{ __html: code }} className="bg-white p-2 rounded scale-75 origin-top" />
                  ) : (
                    <pre className="text-[var(--primary)]">{code}</pre>
                  )}
               </div>
            </NeoCard>

            <div className="flex flex-col items-center gap-4 lg:gap-6 w-full lg:w-auto">
               {isEvaluating ? (
                 <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-[var(--primary)] border-[var(--dim)] rounded-full animate-spin mb-4"></div>
                    <p className="font-bold uppercase animate-pulse">Analyzing Pattern...</p>
                 </div>
               ) : (
                 <>
                    <div className="text-center">
                       <p className="text-xs uppercase opacity-60">Similarity Index</p>
                       <p className="text-5xl lg:text-7xl font-black">{evalResult?.score}%</p>
                    </div>
                    <div className="w-full lg:w-64 text-center text-[10px] bg-[var(--hover-bg)] p-4 border border-[var(--primary)] font-mono uppercase">
                       {evalResult?.feedback}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                       <NeoButton variant="success" onClick={finalizeLevel}>COMMIT_RESULT</NeoButton>
                       <NeoButton variant="secondary" onClick={() => setShowComparison(false)}>EDIT_BUFFER</NeoButton>
                    </div>
                 </>
               )}
            </div>

            <NeoCard title="REFERENCE_PATTERN" className="w-full lg:w-1/3 h-[150px] lg:h-[500px]">
                <div className="p-6 text-center text-xs uppercase opacity-80 flex items-center justify-center h-full italic">
                   {level.targetOutput}
                </div>
            </NeoCard>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1920px] mx-auto p-2 lg:p-4 gap-2 lg:gap-4 bg-black overflow-hidden">
      <div className="flex lg:hidden w-full gap-2 border-b border-[var(--dim)] pb-2">
         <button onClick={() => setActiveTab('editor')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-tighter flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'editor' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--dim)]'}`}>
           <FileCode size={14} /> Code
         </button>
         <button onClick={() => setActiveTab('preview')} className={`flex-1 py-2 text-xs font-bold uppercase tracking-tighter flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'preview' ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--dim)]'}`}>
           <Eye size={14} /> Preview
         </button>
      </div>

      <div className={`flex flex-col w-full lg:w-1/2 gap-4 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
        <div className={`flex-1 bg-black border-2 border-[var(--primary)] p-2 lg:p-4 flex flex-col overflow-hidden`}>
           <div className="flex justify-between items-center mb-2 pb-2 border-b border-[var(--dim)]">
              <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[var(--primary)] truncate mr-2">
                 <FileCode size={14} className="flex-shrink-0" /> /USR/BIN/{level.title.replace(/\s+/g, '_').toUpperCase()}.{level.language.toLowerCase()}
              </div>
              <button onClick={onExit} className="text-[var(--dim)] hover:text-[#ff4141] flex items-center gap-1 text-[10px] font-bold flex-shrink-0">
                 <LogOut size={12} /> ABORT
              </button>
           </div>
           
           <div className="flex-1 overflow-auto font-mono text-sm prism-editor custom-scroll">
             <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlightCode(code, level.language)}
                padding={10}
                className="font-mono min-h-full"
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, backgroundColor: 'transparent', color: 'var(--primary)' }}
                textareaClassName="focus:outline-none"
                onPaste={handlePaste}
              />
           </div>
        </div>
      </div>

      <div className={`flex flex-col w-full lg:w-1/2 gap-4 ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
         <NeoCard title="REALTIME_EMULATOR" className="flex-1">
            <div className="flex-1 p-2 lg:p-4 overflow-auto bg-[#050505] h-full flex flex-col">
                {(level.language === Language.HTML || level.language === Language.CSS) ? (
                  <iframe 
                    srcDoc={`<style>body{color:lime;font-family:monospace;background:#050505;margin:0;padding:10px;}</style>${output}`} 
                    className="w-full h-full border-none bg-[#050505]"
                    title="preview"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="w-full h-full bg-[#050505] text-[var(--primary)] font-mono text-[10px] lg:text-xs p-2 whitespace-pre-wrap">
                    {output || "> SYSTEM IDLE..."}
                  </div>
                )}
            </div>
         </NeoCard>

         <div className="h-32 lg:h-40 grid grid-cols-2 gap-2 lg:gap-4">
            <NeoCard title="NODE_LOG">
               <div className="p-2 lg:p-4 space-y-1 text-[8px] lg:text-[10px] uppercase font-mono">
                  <p>NODE: {level.chapter}-{level.subChapter}</p>
                  <p>CLOCK: {formatTime(timer)}</p>
                  <p>STATUS: ACTIVE</p>
               </div>
            </NeoCard>

            <div className="flex flex-col gap-2">
               <NeoButton variant="primary" onClick={handleCompile} className="flex-1 text-[10px] lg:text-sm py-1">
                  RUN_PROGRAM
               </NeoButton>
               <NeoButton variant="danger" onClick={handleSubmit} className="flex-1 text-[10px] lg:text-sm py-1">
                  SUBMIT_BUFFER
               </NeoButton>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Retention Mode Gameplay ---
export const RetentionGameplay: React.FC<{ onFinish: (s: GameSession) => void, onExit: () => void, isAntiCheatEnabled: boolean }> = ({ onFinish, onExit, isAntiCheatEnabled }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [nodesCleared, setNodesCleared] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(MOCK_LEVELS[Math.floor(Math.random() * MOCK_LEVELS.length)]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{msg: string, penalty: boolean} | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setCode(currentLevel.language === Language.HTML ? '<h1></h1>' : '// START CODING\n');
  }, [currentLevel]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [nodesCleared]);

  const handleTimeUp = () => {
    onFinish({
      levelId: 'RETENTION',
      startTime: Date.now(),
      attempts: nodesCleared,
      code: 'RETENTION_MODE_COMPLETED',
      accuracy: 0,
      timeElapsed: '00:00',
      grade: nodesCleared > 5 ? 'S' : nodesCleared > 3 ? 'A' : 'B',
      isRetention: true,
      score: nodesCleared
    });
  };

  const handleCompile = () => {
    if (currentLevel.language === Language.HTML || currentLevel.language === Language.CSS) {
      setOutput(code);
    } else {
      setOutput(`[STDOUT] Logic analysis required...`);
    }
    if (window.innerWidth < 1024) setActiveTab('preview');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isAntiCheatEnabled) {
      e.preventDefault();
      alert("ANTI_CHEAT: PASTE_COMMAND_INTERCEPTED. MANUAL_INPUT_MANDATORY.");
    }
  };

  const handleSubmit = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setLastFeedback(null);
    
    const result = await evaluateCodeSubmission(currentLevel.objective, code, currentLevel.language);
    
    if (result.score < 50) {
      setTimeLeft(prev => Math.max(0, prev - 5));
      setLastFeedback({ msg: `FAILED: -5S PENALTY! ${result.feedback}`, penalty: true });
    } else {
      setNodesCleared(prev => prev + 1);
      setTimeLeft(prev => prev + 15); // Bonus time for success
      setLastFeedback({ msg: `SUCCESS! +15S REWARD!`, penalty: false });
      
      const nextLvl = MOCK_LEVELS[Math.floor(Math.random() * MOCK_LEVELS.length)];
      setCurrentLevel(nextLvl);
    }
    setIsEvaluating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1920px] mx-auto p-2 lg:p-4 gap-2 lg:gap-4 bg-black overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-[var(--dim)]">
        <div 
          className="h-full bg-[var(--primary)] transition-all duration-1000" 
          style={{ width: `${(timeLeft / 90) * 100}%` }}
        />
      </div>

      <div className="flex flex-col w-full lg:w-2/3 gap-4 h-full">
         <div className="flex justify-between items-center bg-[var(--hover-bg)] border-2 border-[var(--primary)] p-2">
            <div className="flex items-center gap-4">
               <Timer className={timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-[var(--primary)]'} />
               <span className={`text-2xl font-black ${timeLeft < 15 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
            </div>
            <div className="text-right">
               <p className="text-[10px] opacity-60">NODES_CLEARED</p>
               <p className="text-xl font-bold text-[var(--primary)]">{nodesCleared}</p>
            </div>
         </div>

         <NeoCard title={`CURRENT_TARGET: ${currentLevel.title}`} className="flex-1 flex flex-col min-h-0">
            <div className="p-3 bg-black border-b border-[var(--dim)] text-xs font-mono">
               <p className="text-[var(--primary)] uppercase mb-1">REQ_LOGIC:</p>
               <p className="opacity-80">{currentLevel.objective}</p>
            </div>
            
            <div className="flex-1 overflow-auto bg-black p-2 custom-scroll">
               <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={c => highlightCode(c, currentLevel.language)}
                  padding={10}
                  className="font-mono text-sm min-h-full"
                  style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, backgroundColor: 'transparent', color: 'var(--primary)' }}
                  textareaClassName="focus:outline-none"
                  onPaste={handlePaste}
                />
            </div>
         </NeoCard>

         {lastFeedback && (
           <div className={`p-2 border-2 text-xs font-bold animate-bounce uppercase ${lastFeedback.penalty ? 'border-red-500 bg-red-950 text-red-500' : 'border-[var(--primary)] bg-[var(--hover-bg)] text-[var(--primary)]'}`}>
              {lastFeedback.msg}
           </div>
         )}
      </div>

      <div className="flex flex-col w-full lg:w-1/3 gap-4 h-full">
         <NeoCard title="EMULATOR" className="flex-1">
            <div className="h-full bg-[#050505] p-2">
               {(currentLevel.language === Language.HTML || currentLevel.language === Language.CSS) ? (
                  <iframe srcDoc={`<style>body{color:lime;background:#050505;margin:0;padding:10px;}</style>${output}`} className="w-full h-full border-none" />
                ) : (
                  <div className="font-mono text-xs text-[var(--primary)]">{output || "> STANDBY"}</div>
                )}
            </div>
         </NeoCard>

         <div className="grid grid-cols-2 gap-2">
            <NeoButton variant="primary" onClick={handleCompile} className="text-sm">RUN</NeoButton>
            <NeoButton 
              variant="danger" 
              onClick={handleSubmit} 
              disabled={isEvaluating} 
              className={`text-sm ${isEvaluating ? 'animate-pulse' : ''}`}
            >
               {isEvaluating ? 'EVAL...' : 'SUBMIT'}
            </NeoButton>
         </div>
         <NeoButton variant="secondary" onClick={onExit} className="text-xs">ABORT_MISSION</NeoButton>
      </div>
    </div>
  );
};

// --- Results Screen ---
interface ResultProps {
  session: GameSession;
  onNext: () => void;
  onRetry: () => void;
}

export const ResultScreen: React.FC<ResultProps> = ({ session, onNext, onRetry }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 justify-center items-center gap-4 lg:gap-8 bg-black overflow-y-auto">
       <div className="flex flex-col lg:flex-row w-full gap-4 h-auto lg:h-[500px]">
          <NeoCard title={session.isRetention ? "RETENTION_SUMMARY" : "USER_LOG_HISTORY"} className="w-full lg:w-1/2 h-40 lg:h-full">
             <div className="p-4 h-full bg-[#050505] overflow-hidden flex flex-col">
                {session.isRetention ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                     <Zap size={64} className="text-yellow-400" />
                     <h2 className="text-2xl font-black">RETENTION_RUN_ENDED</h2>
                     <p className="text-xs opacity-60">NEURAL STABILITY REACHED CRITICAL LIMITS.</p>
                  </div>
                ) : (
                  <pre className="font-mono text-[10px] overflow-auto flex-1 text-[var(--primary)] opacity-60">
                     {session.code}
                  </pre>
                )}
             </div>
          </NeoCard>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
             <div className="flex-1 flex flex-col justify-center text-center py-4">
                <h1 className="text-xl lg:text-2xl font-bold mb-2 uppercase tracking-[0.5em] lg:tracking-[1em]">
                  {session.isRetention ? "Retention results" : "Mission Complete"}
                </h1>
                <div className="flex flex-col items-center">
                   <span className="text-[10px] lg:text-xs opacity-50 uppercase mb-2">
                     {session.isRetention ? "Nodes Harvested" : "Performance Class"}
                   </span>
                   {session.isRetention ? (
                     <span className="text-7xl lg:text-9xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                        {session.score}
                     </span>
                   ) : (
                     <span className={`text-7xl lg:text-9xl font-black drop-shadow-[0_0_10px_currentColor] ${
                       session.grade === 'S' ? 'text-yellow-400' :
                       session.grade === 'A' ? 'text-green-500' :
                       session.grade === 'B' ? 'text-blue-500' : 'text-gray-600'
                     }`}>
                        {session.grade}
                     </span>
                   )}
                </div>
             </div>
             
             <NeoCard title="SESSION_METADATA">
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-4 p-4 text-center uppercase text-[8px] lg:text-[10px]">
                   {session.isRetention ? (
                      <>
                        <div className="col-span-2">
                           <p className="opacity-40">TOTAL_CYCLES</p>
                           <p className="font-black text-sm lg:text-base">{session.score} NODES</p>
                        </div>
                      </>
                   ) : (
                     <>
                        <div>
                           <p className="opacity-40">ACCURACY</p>
                           <p className="font-black text-sm lg:text-base">{session.accuracy}%</p>
                        </div>
                        <div>
                           <p className="opacity-40">ELAPSED</p>
                           <p className="font-black text-sm lg:text-base">{session.timeElapsed}</p>
                        </div>
                     </>
                   )}
                   <div className="hidden lg:block">
                      <p className="opacity-40">SESSION_ID</p>
                      <p className="font-black text-base">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                   </div>
                   <div className="hidden lg:block">
                      <p className="opacity-40">PARITY</p>
                      <p className="font-black text-base">PASSED</p>
                   </div>
                </div>
             </NeoCard>
          </div>
       </div>

       <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <NeoButton variant="primary" onClick={onRetry} className="flex-1 w-full">RETRY_SESSION</NeoButton>
          <NeoButton variant="primary" onClick={onNext} className="flex-1 w-full">CONTINUE</NeoButton>
       </div>
    </div>
  );
};
