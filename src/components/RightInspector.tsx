import React, { useState, useRef, useEffect } from 'react';
import { AgentNode, FileChange } from '../types';
import {
  X,
  Play,
  Pause,
  GitPullRequest,
  Send,
  Terminal,
  Activity,
  ListTodo,
  FileCode2,
  Cpu,
  Copy,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RightInspectorProps {
  node: AgentNode;
  onClose: () => void;
  onOpenDiffForFile: (file: FileChange) => void;
  onOpenGlobalDiff: () => void;
  onApproveNode: (nodeId: string) => void;
  onToggleNodePause: (nodeId: string) => void;
  onSendInstruction: (nodeId: string, instruction: string) => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
  node,
  onClose,
  onOpenDiffForFile,
  onOpenGlobalDiff,
  onApproveNode,
  onToggleNodePause,
  onSendInstruction,
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'activity' | 'task' | 'files' | 'logs'>('activity');
  const [inputText, setInputText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of logs when activeTab is logs
  useEffect(() => {
    if (activeTab === 'logs' && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [node.logs, activeTab]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendInstruction(node.id, inputText.trim());
    setInputText('');
  };

  const handleCopyInstruction = () => {
    navigator.clipboard.writeText(node.currentInstruction);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isBlocked = node.isBlocked || node.status === 'blocked';
  const isWorking = node.status === 'working';

  return (
    <aside
      className={`w-96 h-screen flex flex-col justify-between shrink-0 select-none z-30 font-sans shadow-lg transition-colors duration-200 ${
        isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
      }`}
    >
      {/* Header */}
      <div className={`p-4 transition-colors ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Agent sélectionné
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agent Info Card */}
        <div className="mt-3 flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 shrink-0 shadow-xs ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <Cpu className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-bold font-mono truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {node.name}
              </h2>
              <span className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {node.progress}%
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  isBlocked
                    ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-900'
                    : isWorking
                    ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-900'
                    : isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-900'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isBlocked
                      ? 'bg-amber-500'
                      : isWorking
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-teal-500'
                  }`}
                />
                <span>{node.statusLabel}</span>
              </span>

              <span className={`text-[10px] font-mono truncate max-w-[120px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {node.model.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center gap-1 mt-4 p-1 rounded-lg text-xs font-mono ${isDark ? 'bg-slate-900/80' : 'bg-slate-200/70'}`}>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'activity'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-2xs'
                  : 'bg-white text-slate-900 font-bold shadow-2xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activité</span>
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'task'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-2xs'
                  : 'bg-white text-slate-900 font-bold shadow-2xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tâche</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'files'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-2xs'
                  : 'bg-white text-slate-900 font-bold shadow-2xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Fichiers</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-2xs'
                  : 'bg-white text-slate-900 font-bold shadow-2xs'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Logs</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB 1: ACTIVITÉ EN DIRECT */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Activité en direct
              </span>
              <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Temps réel
              </span>
            </div>

            <div className="space-y-2">
              {node.activities.length === 0 ? (
                <p className="text-slate-400 font-mono text-center py-6">Aucune activité récente</p>
              ) : (
                node.activities.map((act) => (
                  <div
                    key={act.id}
                    className={`p-2.5 rounded-xl transition-colors flex items-start gap-2.5 shadow-2xs ${
                      isDark ? 'bg-slate-900/60 hover:bg-slate-900/80' : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`text-[10px] font-mono mt-0.5 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                      {act.timestamp}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        act.status === 'success'
                          ? 'bg-emerald-500'
                          : act.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {act.description}
                      </p>
                      {act.file && (
                        <span className={`inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shadow-2xs ${
                          isDark ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-800'
                        }`}>
                          {act.file}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Current Instruction Block */}
            <div className={`mt-4 p-3 rounded-xl shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Instruction actuelle
                </span>
                <button
                  onClick={handleCopyInstruction}
                  className={`transition-colors p-1 cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-700'
                  }`}
                  title="Copier l'instruction"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className={`text-xs font-mono leading-relaxed p-2.5 rounded-lg shadow-2xs ${
                isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-800'
              }`}>
                "{node.currentInstruction}"
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: TÂCHE & PROMPT */}
        {activeTab === 'task' && (
          <div className="space-y-3 font-mono">
            <div>
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Rôle & Mission
              </span>
              <p className={`text-xs mt-1 p-2.5 rounded-lg ${isDark ? 'bg-slate-900/60 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
                {node.task}
              </p>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Modèle & Contexte
              </span>
              <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Modèle LLM</span>
                  <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{node.model}</span>
                </div>
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fenêtre Contexte</span>
                  <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>{node.contextWindow}</span>
                </div>
              </div>
            </div>

            {node.branch && (
              <div>
                <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Branche Git active
                </span>
                <p className={`text-xs mt-1 p-2 rounded-lg flex items-center gap-2 font-bold ${
                  isDark ? 'bg-slate-900/60 text-emerald-400' : 'bg-slate-50 text-emerald-700'
                }`}>
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>{node.branch}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FICHIERS MODIFIÉS & DIFF */}
        {activeTab === 'files' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Fichiers modifiés ({node.files.length})
              </span>
              <button
                onClick={onOpenGlobalDiff}
                className={`text-[10px] font-mono font-bold hover:underline cursor-pointer ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-2">
              {node.files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onOpenDiffForFile(file)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between group shadow-2xs ${
                    isDark ? 'bg-slate-900/60 hover:bg-slate-900' : 'bg-slate-50 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCode2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-xs font-mono font-bold truncate ${
                        isDark ? 'text-slate-200 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-800'
                      }`}>
                        {file.path}
                      </p>
                      <p className={`text-[10px] font-mono truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {file.status === 'added' ? 'Nouveau' : 'Modifié'} • {file.size} • {file.directory}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0 font-bold">
                    <span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>+{file.linesAdded}</span>
                    {file.linesRemoved > 0 && (
                      <span className="text-rose-500">-{file.linesRemoved}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LOGS TERMINAL EN DIRECT */}
        {activeTab === 'logs' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Terminal d'exécution
              </span>
              <span className={`text-[10px] font-mono flex items-center gap-1 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Stream
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-[11px] h-64 overflow-y-auto space-y-1.5 text-slate-100">
              {node.logs.map((log) => (
                <div key={log.id} className="leading-relaxed">
                  <span className="text-slate-400 mr-2">[{log.timestamp}]</span>
                  <span
                    className={`font-semibold mr-1.5 ${
                      log.level === 'success'
                        ? 'text-emerald-400'
                        : log.level === 'warn'
                        ? 'text-amber-400'
                        : log.level === 'error'
                        ? 'text-rose-400'
                        : 'text-cyan-300'
                    }`}
                  >
                    [{log.source || 'LOG'}]
                  </span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        )}

        {/* METRICS SUMMARY CARD */}
        <div className={`p-3.5 rounded-xl space-y-3 font-mono shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
          <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Télémétrie & Coût
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2 rounded-lg shadow-2xs ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tokens</span>
              <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {node.tokens.toLocaleString('fr-FR')}
              </span>
            </div>

            <div className={`p-2 rounded-lg shadow-2xs ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Coût</span>
              <span className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {node.cost.toFixed(2)} €
              </span>
            </div>

            <div className={`p-2 rounded-lg shadow-2xs ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fichiers</span>
              <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {node.modifiedFiles}
              </span>
            </div>
          </div>

          {/* Tests Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Tests unitaires</span>
              <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {node.testsPassing.passed} / {node.testsPassing.total} réussis (
                {Math.round((node.testsPassing.passed / node.testsPassing.total) * 100)}%)
              </span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${(node.testsPassing.passed / node.testsPassing.total) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS: Pause, View Diff, Approve */}
        <div className="flex items-center gap-2 pt-1 font-mono">
          {isBlocked && (
            <button
              onClick={() => onApproveNode(node.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Approuver</span>
            </button>
          )}

          <button
            onClick={() => onToggleNodePause(node.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {node.status === 'paused' ? (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                <span>Reprendre</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-500" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenGlobalDiff}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
            }`}
          >
            <GitPullRequest className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span>Voir diff</span>
          </button>
        </div>
      </div>

      {/* Bottom Input to inject prompt instruction into live agent loop */}
      <div className={`p-3 transition-colors ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Envoyer une instruction à ${node.shortName}…`}
            className={`w-full pl-3 pr-10 py-2.5 rounded-xl text-xs font-mono outline-none shadow-xs focus:ring-2 focus:ring-emerald-500/30 transition-all ${
              isDark
                ? 'bg-slate-800 text-slate-100 placeholder:text-slate-500'
                : 'bg-white text-slate-900 placeholder:text-slate-400'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all cursor-pointer"
            title="Envoyer (Entrée)"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};
