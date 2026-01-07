
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
  isSimpleMode?: boolean;
}

export const LevelBriefing: React.FC<BriefingProps> = ({ level, onStart, onBack, isSimpleMode }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 gap-4 bg-black overflow-y-auto">
      <div className={`w-full border-2 border-[var(--primary)] bg-[var(--hover-bg)] p-4 text-center`}>
         <h1 className="text-lg md:text-2xl font-black uppercase tracking-widest">{isSimpleMode ? `Level Info: ${level.title}` : `MISSION BRIEFING: ${level.title}`}</h1>
      </div>
      
      <div className="flex-1 flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
        <NeoCard title={isSimpleMode ? "Details" : "CLIENT_METADATA"} className="shrink-0">
          <div className="p-4 space-y-4 text-xs">
            <div className="border border-[var(--dim)] p-3">
              <p className="font-bold text-[var(--primary)]">{isSimpleMode ? 'Sender: System' : `SENDER: ${level.chapter === 0 ? 'ROOT_ADMIN' : 'ANONYMOUS_SOURCE'}`}</p>
              <p className="opacity-60">{isSimpleMode ? `Difficulty: ${level.difficulty}` : `CLASS: ${level.difficulty === 'Hard' ? 'ULTRA_PRIORITY' : 'HIGH_PRIORITY'}`}</p>
            </div>
          </div>
        </NeoCard>

        <NeoCard title={isSimpleMode ? "Instructions" : "MISSION_OBJECTIVES"} className="md:col-span-2">
          <div className="p-4 sm:p-6 flex flex-col justify-between h-full min-h-[200px]">
            <div>
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono uppercase mb-4 sm:mb-6">
                {isSimpleMode ? level.simpleDescription : level.description}
              </p>
              <div className="p-3 sm:p-4 bg-[var(--hover-bg)] border border-dashed border-[var(--primary)]">
                <p className="font-bold text-[10px] sm:text-xs uppercase text-[var(--primary)] mb-1">{isSimpleMode ? "Your Task:" : "REQ_LOGIC:"}</p>
                <p className="text-[10px] sm:text-xs">{isSimpleMode ? level.simpleObjective : level.objective}</p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs font-bold">{isSimpleMode ? "Difficulty Level" : "THREAT_INDEX"}: {level.difficulty}</p>
               </div>
               <NeoButton 
                  onClick={onStart}
                  variant="success"
                  className="w-full sm:w-auto px-10 py-4 text-xl sm:text-2xl"
               >
                  {isSimpleMode ? "Start" : "EXECUTE"}
               </NeoButton>
            </div>
          </div>
        </NeoCard>
      </div>
       <div className="w-full mt-4 sm:mt-auto">
         <NeoButton variant="secondary" onClick={onBack} className="text-[10px] sm:text-xs w-full sm:w-auto">{"<"} {isSimpleMode ? "Go Back" : "RETURN_TO_MAP"}</NeoButton>
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
  isSimpleMode?: boolean;
}

export const Gameplay: React.FC<GameplayProps> = ({ level, onFinish, onExit, isAntiCheatEnabled, isSimpleMode }) => {
  const [code, setCode] = useState<string>(level.language === Language.HTML ? '<!-- Your HTML here -->\n' : '// Your code here\n');
  const [output, setOutput] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
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
       setOutput(isSimpleMode ? "[System] Running your code..." : `[SYSTEM] COMPILING ${level.language}...\n[SYSTEM] SYMBOL TABLE GENERATED.\n[SYSTEM] CODE BLOCK EXECUTED.\n[STDOUT] Result pending evaluation.`);
    }
    if (window.innerWidth < 1024) {
      setActiveTab('preview');
    }
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);
    setShowComparison(true);
    
    // Special discovery prompt for level 0.1
    const actualObjective = level.id === '0.1' 
      ? "Submit any text at all to see how the system gives you feedback. Once you submit, I will tell you the secret goal was just to learn how to click submit." 
      : level.objective;

    const result = await evaluateCodeSubmission(actualObjective, code, level.language);
    
    if (level.id === '0.1') {
      // Force discovery success for 0.1
      result.score = 100;
      result.isCorrect = true;
      result.feedback = isSimpleMode 
        ? "Perfect! You've learned how to submit your work. The secret goal was simply to test the system. Now you know how the AI evaluation works!" 
        : "EVAL_COMPLETE: Discovery parameters met. The secret objective was to verify submission functionality. Link established.";
    }

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
      alert(isSimpleMode ? "Paste is not allowed here. Please type manually." : "ANTI_CHEAT: PASTE_COMMAND_INTERCEPTED.");
    }
  };

  if (showComparison) {
    return (
      <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-2 sm:p-4 items-center justify-center gap-4 bg-black overflow-y-auto">
         <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 justify-center items-stretch">
            <NeoCard title={isSimpleMode ? "Your Work" : "ACTUAL_BYTE_STREAM"} className="w-full lg:w-1/3 min-h-[150px] lg:h-[500px]">
               <div className="p-3 sm:p-4 h-full overflow-auto text-[10px] font-mono">
                  {level.language === Language.HTML || level.language === Language.CSS ? (
                    <div dangerouslySetInnerHTML={{ __html: code }} className="bg-white p-2 rounded scale-90 sm:scale-75 origin-top" />
                  ) : (
                    <pre className="text-[var(--primary)] whitespace-pre-wrap">{code}</pre>
                  )}
               </div>
            </NeoCard>

            <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 w-full lg:w-auto p-4 bg-[var(--hover-bg)] border-y lg:border-none border-[var(--dim)]">
               {isEvaluating ? (
                 <div className="flex flex-col items-center py-8">
                    <div className="w-10 h-10 border-4 border-t-[var(--primary)] border-[var(--dim)] rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-xs uppercase animate-pulse">{isSimpleMode ? "Analyzing..." : "Analyzing Pattern..."}</p>
                 </div>
               ) : (
                 <>
                    <div className="text-center">
                       <p className="text-[10px] uppercase opacity-60">{isSimpleMode ? "Result Score" : "Similarity Index"}</p>
                       <p className="text-5xl lg:text-7xl font-black text-[var(--primary)]">{evalResult?.score}%</p>
                    </div>
                    <div className="w-full lg:w-64 text-center text-[10px] p-4 border border-[var(--primary)] font-mono uppercase bg-black">
                       {evalResult?.feedback}
                    </div>
                    <div className="flex flex-row lg:flex-col gap-2 w-full">
                       <NeoButton variant="success" onClick={finalizeLevel} className="flex-1 text-[10px] sm:text-sm">{isSimpleMode ? "Finish" : "COMMIT"}</NeoButton>
                       <NeoButton variant="secondary" onClick={() => setShowComparison(false)} className="flex-1 text-[10px] sm:text-sm">{isSimpleMode ? "Edit" : "EDIT"}</NeoButton>
                    </div>
                 </>
               )}
            </div>

            <NeoCard title={isSimpleMode ? "Target Answer" : "REFERENCE_PATTERN"} className="w-full lg:w-1/3 min-h-[100px] lg:h-[500px]">
                <div className="p-6 text-center text-[10px] sm:text-xs uppercase opacity-80 flex items-center justify-center h-full italic">
                   {level.id === '0.1' && !isEvaluating ? (isSimpleMode ? "Hidden Goal Found: Learn to submit work!" : "TARGET_REVEALED: DISCOVERY_TASK_ACCEPTED") : level.targetOutput}
                </div>
            </NeoCard>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1920px] mx-auto p-1 lg:p-4 gap-2 lg:gap-4 bg-black overflow-hidden">
      {/* Mobile Tabs */}
      <div className="flex lg:hidden w-full gap-1 border-b border-[var(--dim)] bg-black px-1">
         <button onClick={() => setActiveTab('editor')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'editor' ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--hover-bg)]' : 'border-transparent text-[var(--dim)]'}`}>
           <FileCode size={14} /> {isSimpleMode ? "Editor" : "Buffer"}
         </button>
         <button onClick={() => setActiveTab('preview')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'preview' ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--hover-bg)]' : 'border-transparent text-[var(--dim)]'}`}>
           <Eye size={14} /> {isSimpleMode ? "Preview" : "Output"}
         </button>
      </div>

      {/* Editor Section */}
      <div className={`flex flex-col w-full lg:w-1/2 gap-2 sm:gap-4 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'} h-full min-h-0`}>
        <div className={`flex-1 bg-black border-2 border-[var(--primary)] p-1 lg:p-4 flex flex-col overflow-hidden`}>
           <div className="flex justify-between items-center mb-1 pb-1 lg:mb-2 lg:pb-2 border-b border-[var(--dim)]">
              <div className="flex items-center gap-2 text-[8px] lg:text-xs font-bold text-[var(--primary)] truncate mr-2">
                 <FileCode size={14} className="flex-shrink-0" /> {isSimpleMode ? level.title : `/BIN/${level.title.replace(/\s+/g, '_').toUpperCase()}.${level.language.toLowerCase()}`}
              </div>
              <button onClick={onExit} className="text-[var(--dim)] hover:text-[#ff4141] flex items-center gap-1 text-[8px] font-bold flex-shrink-0">
                 <LogOut size={12} /> {isSimpleMode ? "Exit" : "ABORT"}
              </button>
           </div>
           
           <div className="flex-1 overflow-auto font-mono text-sm prism-editor custom-scroll">
             <Editor
                value={code}
                onValueChange={setCode}
                highlight={c => highlightCode(c, level.language)}
                padding={10}
                className="font-mono min-h-full"
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, backgroundColor: 'transparent', color: 'var(--primary)' }}
                textareaClassName="focus:outline-none"
                onPaste={handlePaste}
              />
           </div>
        </div>
      </div>

      {/* Preview/Utility Section */}
      <div className={`flex flex-col w-full lg:w-1/2 gap-2 sm:gap-4 ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'} h-full min-h-0`}>
         <NeoCard title={isSimpleMode ? "Visual Preview" : "EMULATOR_VIEWPORT"} className="flex-1">
            <div className="flex-1 p-1 lg:p-4 overflow-auto bg-[#050505] h-full flex flex-col">
                {(level.language === Language.HTML || level.language === Language.CSS) ? (
                  <iframe 
                    srcDoc={`<style>body{color:lime;font-family:monospace;background:#050505;margin:0;padding:10px;}*{max-width:100%;word-wrap:break-word;}</style>${output}`} 
                    className="w-full h-full border-none bg-[#050505]"
                    title="preview"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="w-full h-full bg-[#050505] text-[var(--primary)] font-mono text-[10px] lg:text-xs p-2 whitespace-pre-wrap break-all">
                    {output || (isSimpleMode ? "> Ready..." : "> SYSTEM IDLE...")}
                  </div>
                )}
            </div>
         </NeoCard>

         <div className="h-28 lg:h-40 grid grid-cols-2 gap-2 lg:gap-4 shrink-0">
            <NeoCard title={isSimpleMode ? "Status" : "SESSION_LOG"}>
               <div className="p-2 lg:p-4 space-y-1 text-[8px] lg:text-[10px] uppercase font-mono">
                  <p className="truncate">LEVEL: {level.id}</p>
                  <p>{isSimpleMode ? "Time" : "CLOCK"}: {formatTime(timer)}</p>
                  <p className="text-[var(--primary)]">{isSimpleMode ? "Running" : "STATUS: ACTIVE"}</p>
               </div>
            </NeoCard>

            <div className="flex flex-col gap-1 lg:gap-2">
               <NeoButton variant="primary" onClick={handleCompile} className="flex-1 text-[9px] lg:text-sm py-0 h-full">
                  {isSimpleMode ? "Run" : "RUN"}
               </NeoButton>
               <NeoButton variant="danger" onClick={handleSubmit} className="flex-1 text-[9px] lg:text-sm py-0 h-full">
                  {isSimpleMode ? "Check" : "SUBMIT"}
               </NeoButton>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Retention Mode Gameplay ---
export const RetentionGameplay: React.FC<{ onFinish: (s: GameSession) => void, onExit: () => void, isAntiCheatEnabled: boolean, isSimpleMode?: boolean }> = ({ onFinish, onExit, isAntiCheatEnabled, isSimpleMode }) => {
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
      setOutput(isSimpleMode ? "[System] Running code..." : `[STDOUT] Result pending...`);
    }
    if (window.innerWidth < 1024) setActiveTab('preview');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isAntiCheatEnabled) {
      e.preventDefault();
      alert(isSimpleMode ? "Paste is not allowed here." : "ANTI_CHEAT: PASTE_BLOCKED.");
    }
  };

  const handleSubmit = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setLastFeedback(null);
    
    const result = await evaluateCodeSubmission(currentLevel.objective, code, currentLevel.language);
    
    if (result.score < 50) {
      setTimeLeft(prev => Math.max(0, prev - 5));
      setLastFeedback({ msg: isSimpleMode ? `Incorrect! -5s` : `FAILED: -5S PENALTY!`, penalty: true });
    } else {
      setNodesCleared(prev => prev + 1);
      setTimeLeft(prev => prev + 15);
      setLastFeedback({ msg: isSimpleMode ? `Great! +15s` : `SUCCESS! +15S!`, penalty: false });
      
      const nextLvl = MOCK_LEVELS[Math.floor(Math.random() * MOCK_LEVELS.length)];
      setCurrentLevel(nextLvl);
    }
    setIsEvaluating(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-[1920px] mx-auto p-1 lg:p-4 gap-2 lg:gap-4 bg-black overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-[var(--dim)]">
        <div 
          className="h-full bg-[var(--primary)] transition-all duration-1000" 
          style={{ width: `${(timeLeft / 90) * 100}%` }}
        />
      </div>

      <div className={`flex flex-col w-full lg:w-2/3 gap-2 sm:gap-4 h-full ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
         <div className="flex justify-between items-center bg-[var(--hover-bg)] border-2 border-[var(--primary)] p-2">
            <div className="flex items-center gap-3">
               <Timer size={18} className={timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-[var(--primary)]'} />
               <span className={`text-lg sm:text-2xl font-black ${timeLeft < 15 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
            </div>
            <div className="text-right">
               <p className="text-[8px] opacity-60">{isSimpleMode ? "Points" : "CLEARED"}</p>
               <p className="text-lg sm:text-xl font-bold text-[var(--primary)]">{nodesCleared}</p>
            </div>
         </div>

         <NeoCard title={`${isSimpleMode ? "Goal" : "TARGET"}: ${currentLevel.title}`} className="flex-1 flex flex-col min-h-0">
            <div className="p-2 bg-black border-b border-[var(--dim)] text-[10px] font-mono">
               <p className="text-[var(--primary)] uppercase mb-0.5">{isSimpleMode ? "Task" : "REQ_LOGIC:"}</p>
               <p className="opacity-80 line-clamp-2">{isSimpleMode ? currentLevel.simpleObjective : currentLevel.objective}</p>
            </div>
            
            <div className="flex-1 overflow-auto bg-black p-1 custom-scroll">
               <Editor
                  value={code}
                  onValueChange={setCode}
                  highlight={c => highlightCode(c, currentLevel.language)}
                  padding={10}
                  className="font-mono text-xs sm:text-sm min-h-full"
                  style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, backgroundColor: 'transparent', color: 'var(--primary)' }}
                  textareaClassName="focus:outline-none"
                  onPaste={handlePaste}
                />
            </div>
         </NeoCard>

         {lastFeedback && (
           <div className={`p-2 border-2 text-[10px] font-bold animate-bounce uppercase text-center ${lastFeedback.penalty ? 'border-red-500 bg-red-950 text-red-500' : 'border-[var(--primary)] bg-[var(--hover-bg)] text-[var(--primary)]'}`}>
              {lastFeedback.msg}
           </div>
         )}
      </div>

      <div className={`flex flex-col w-full lg:w-1/3 gap-2 sm:gap-4 h-full ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
         <NeoCard title={isSimpleMode ? "Output" : "EMULATOR"} className="flex-1">
            <div className="h-full bg-[#050505] p-2">
               {(currentLevel.language === Language.HTML || currentLevel.language === Language.CSS) ? (
                  <iframe srcDoc={`<style>body{color:lime;background:#050505;margin:0;padding:10px;}*{max-width:100%;}</style>${output}`} className="w-full h-full border-none" />
                ) : (
                  <div className="font-mono text-[10px] text-[var(--primary)] break-all">{output || (isSimpleMode ? "> Ready" : "> STANDBY")}</div>
                )}
            </div>
         </NeoCard>

         <div className="grid grid-cols-2 gap-2 shrink-0">
            <NeoButton variant="primary" onClick={handleCompile} className="text-xs py-2">{isSimpleMode ? "Run" : "RUN"}</NeoButton>
            <NeoButton 
              variant="danger" 
              onClick={handleSubmit} 
              disabled={isEvaluating} 
              className={`text-xs py-2 ${isEvaluating ? 'animate-pulse' : ''}`}
            >
               {isEvaluating ? '...' : (isSimpleMode ? "Check" : "SUBMIT")}
            </NeoButton>
         </div>
         <NeoButton variant="secondary" onClick={onExit} className="text-[10px] py-1">{isSimpleMode ? "Quit" : "ABORT"}</NeoButton>
      </div>

      {/* Mobile Tab Toggle for Retention */}
      <div className="lg:hidden absolute bottom-20 right-4 flex flex-col gap-2 z-50">
          <button 
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className="w-12 h-12 rounded-full bg-[var(--primary)] text-black flex items-center justify-center shadow-lg active:scale-95"
          >
             {activeTab === 'editor' ? <Eye size={24} /> : <FileCode size={24} />}
          </button>
      </div>
    </div>
  );
};

// --- Results Screen ---
interface ResultProps {
  session: GameSession;
  onNext: () => void;
  onRetry: () => void;
  isSimpleMode?: boolean;
}

export const ResultScreen: React.FC<ResultProps> = ({ session, onNext, onRetry, isSimpleMode }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 justify-center items-center gap-4 lg:gap-8 bg-black overflow-y-auto">
       <div className="flex flex-col lg:flex-row w-full gap-4 lg:h-[500px]">
          <NeoCard title={session.isRetention ? (isSimpleMode ? "Recap" : "SUMMARY") : (isSimpleMode ? "History" : "SESSION_HISTORY")} className="w-full lg:w-1/2 min-h-[150px] lg:h-full order-2 lg:order-1">
             <div className="p-4 h-full bg-[#050505] overflow-hidden flex flex-col">
                {session.isRetention ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
                     <Zap size={48} className="text-yellow-400" />
                     <h2 className="text-xl font-black">{isSimpleMode ? "Finished" : "NEURAL LIMIT REACHED"}</h2>
                     <p className="text-[10px] opacity-60 uppercase">{isSimpleMode ? "You completed the challenge. Check your score." : "Session cycles complete. Metric evaluation is finalized."}</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto">
                    <pre className="font-mono text-[9px] text-[var(--primary)] opacity-60 whitespace-pre-wrap">{session.code}</pre>
                  </div>
                )}
             </div>
          </NeoCard>
          <div className="w-full lg:w-1/2 flex flex-col gap-4 order-1 lg:order-2">
             <div className="flex-1 flex flex-col justify-center text-center py-4 sm:py-8">
                <h1 className="text-lg lg:text-2xl font-bold mb-2 uppercase tracking-[0.3em] lg:tracking-[1em] text-[var(--primary)]">
                  {session.isRetention ? (isSimpleMode ? "Round Ended" : "Cycles Complete") : (isSimpleMode ? "Success!" : "Mission Success")}
                </h1>
                <div className="flex flex-col items-center">
                   <span className="text-[10px] lg:text-xs opacity-50 uppercase mb-2">
                     {session.isRetention ? (isSimpleMode ? "Final Score" : "Nodes Harvested") : (isSimpleMode ? "Grade" : "Performance Rating")}
                   </span>
                   {session.isRetention ? (
                     <span className="text-6xl lg:text-9xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">{session.score}</span>
                   ) : (
                     <span className={`text-7xl lg:text-9xl font-black drop-shadow-[0_0_10px_currentColor] ${
                       session.grade === 'S' ? 'text-yellow-400' :
                       session.grade === 'A' ? 'text-green-500' :
                       session.grade === 'B' ? 'text-blue-500' : 'text-gray-600'
                     }`}>{session.grade}</span>
                   )}
                </div>
             </div>
             <NeoCard title={isSimpleMode ? "Stats" : "SESSION_METRICS"}>
                <div className="grid grid-cols-2 gap-2 lg:gap-4 p-4 text-center uppercase text-[9px] lg:text-[10px]">
                   {session.isRetention ? (
                      <div className="col-span-2">
                         <p className="opacity-40">{isSimpleMode ? "Total Points" : "TOTAL_ACCESS"}</p>
                         <p className="font-black text-sm lg:text-lg">{session.score} {isSimpleMode ? "Points" : "NODES"}</p>
                      </div>
                   ) : (
                     <>
                        <div>
                           <p className="opacity-40">{isSimpleMode ? "Accuracy" : "ACCURACY"}</p>
                           <p className="font-black text-sm lg:text-lg">{session.accuracy}%</p>
                        </div>
                        <div>
                           <p className="opacity-40">{isSimpleMode ? "Time" : "TIME"}</p>
                           <p className="font-black text-sm lg:text-lg">{session.timeElapsed}</p>
                        </div>
                     </>
                   )}
                </div>
             </NeoCard>
          </div>
       </div>
       <div className="flex flex-col sm:flex-row gap-3 w-full max-md mt-4">
          <NeoButton variant="primary" onClick={onRetry} className="flex-1 w-full text-xs sm:text-sm">{isSimpleMode ? "Retry" : "RETRY"}</NeoButton>
          <NeoButton variant="success" onClick={onNext} className="flex-1 w-full text-xs sm:text-sm">{isSimpleMode ? "Continue" : "CONTINUE"}</NeoButton>
       </div>
    </div>
  );
};
