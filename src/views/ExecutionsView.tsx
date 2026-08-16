import React, { useState } from 'react';
import { ExecutionStep, MissionData } from '../types';
import { INITIAL_EXECUTIONS_LIST } from '../data/initialData';
import {
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronRight,
  Search,
  Send,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ExecutionsViewProps {
  mission: MissionData;
  elapsedSeconds: number;
  onNavigateToTab: (tab: string) => void;
  onApproveStep?: (stepId: string) => void;
}

export const ExecutionsView: React.FC<ExecutionsViewProps> = ({
  mission,
  elapsedSeconds,
  onNavigateToTab,
}) => {
  const { isDark } = useTheme();
  const [steps, setSteps] = useState<ExecutionStep[]>(INITIAL_EXECUTIONS_LIST);
  const [expandedStepId, setExpandedStepId] = useState<string>('exec-03');
  const [logSearch, setLogSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'completed' | 'blocked'>('all');

  const [promptInputs, setPromptInputs] = useState<Record<string, string>>({});

  const filteredSteps = steps.filter((s) => {
    if (statusFilter === 'running' && s.status !== 'running') return false;
    if (statusFilter === 'completed' && s.status !== 'completed') return false;
    if (statusFilter === 'blocked' && s.status !== 'blocked') return false;
    return true;
  });

  const handleRerunStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? {
              ...s,
              status: 'running',
              logs: [
                {
                  id: `l-rerun-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }),
                  level: 'info',
                  message: 'Relance manuelle de l’étape demandée par l’opérateur',
                },
                ...s.logs,
              ],
            }
          : s
      )
    );
  };

  const handleSendPrompt = (stepId: string) => {
    const text = promptInputs[stepId];
    if (!text || !text.trim()) return;

    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? {
              ...s,
              status: 'running',
              tokens: s.tokens + 1100,
              cost: Number((s.cost + 0.02).toFixed(2)),
              logs: [
                {
                  id: `l-inject-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }),
                  level: 'info',
                  message: `Instruction opérateur injectée : "${text}"`,
                },
                ...s.logs,
              ],
            }
          : s
      )
    );

    setPromptInputs((prev) => ({ ...prev, [stepId]: '' }));
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. Header Banner */}
      <div className={`rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="space-y-1.5 max-w-3xl">
          <div className={`flex items-center gap-2.5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              JOURNAL DES EXÉCUTIONS
            </span>
            <span>•</span>
            <span className="font-semibold">Mission #{mission.id}</span>
          </div>
          <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Traces d'Exécution & Pipeline LLM
          </h1>
          <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Audit temps réel des appels de modèles, génération de code, exécution de commandes et logs stdout/stderr.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono ${
            isDark ? 'bg-slate-900/60' : 'bg-slate-50'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Débit :</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>142 tok/s</span>
          </div>
        </div>
      </div>

      {/* 2. Pipeline Chronology */}
      <div className={`p-6 rounded-2xl space-y-3 font-mono shadow-sm transition-colors ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between text-xs">
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chronologie des Agents (Pipeline)</span>
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Durée : {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
          </span>
        </div>

        <div className="space-y-2 text-[11px]">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';
            const isBlocked = step.status === 'blocked';

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-32 truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {step.agentName}
                </div>
                <div className={`flex-1 h-6 rounded-lg overflow-hidden relative flex items-center ${
                  isDark ? 'bg-slate-900/80' : 'bg-slate-100'
                }`}>
                  <div
                    className={`h-full rounded-lg transition-all flex items-center px-2.5 text-[10px] font-bold truncate ${
                      isCompleted
                        ? isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-800'
                        : isRunning
                        ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        : isBlocked
                        ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                        : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}
                    style={{
                      width: isCompleted ? '100%' : isRunning ? '75%' : isBlocked ? '45%' : '30%',
                    }}
                  >
                    {step.duration} • {step.model}
                  </div>
                </div>
                <div className="w-20 text-right text-[10px] font-bold">
                  {isCompleted && <span className={isDark ? 'text-teal-400' : 'text-teal-700'}>Terminé</span>}
                  {isRunning && <span className="text-emerald-500 animate-pulse">En cours</span>}
                  {isBlocked && <span className="text-amber-500">Bloqué</span>}
                  {step.status === 'paused' && <span className="text-slate-400">En pause</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'running', 'completed', 'blocked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer capitalize font-medium ${
                statusFilter === f
                  ? isDark
                    ? 'bg-slate-700 text-white font-bold'
                    : 'bg-slate-900 text-white font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {f === 'all'
                ? 'Toutes les étapes'
                : f === 'running'
                ? 'En cours'
                : f === 'completed'
                ? 'Terminées'
                : 'Bloquées'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            placeholder="Filtrer les messages..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono outline-none shadow-2xs focus:ring-1 focus:ring-emerald-500 ${
              isDark
                ? 'bg-slate-800 text-slate-100 placeholder:text-slate-500'
                : 'bg-white text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* 4. Execution Steps List */}
      <div className="space-y-3">
        {filteredSteps.map((step) => {
          const isExpanded = expandedStepId === step.id;
          const isRunning = step.status === 'running';
          const isCompleted = step.status === 'completed';
          const isBlocked = step.status === 'blocked';

          const matchingLogs = step.logs.filter((l) =>
            logSearch ? l.message.toLowerCase().includes(logSearch.toLowerCase()) : true
          );

          return (
            <div
              key={step.id}
              className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                isDark ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedStepId(isExpanded ? '' : step.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>

                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                    isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {step.agentName.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.taskTitle}</span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({step.agentName})</span>
                    </div>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Modèle : {step.model} • Début : {step.startTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block text-[11px]">
                    <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{step.duration}</span>
                    <p className={`text-[10px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      €{step.cost.toFixed(2)} ({step.tokens.toLocaleString('fr-FR')} tok)
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      isCompleted
                        ? isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-800'
                        : isRunning
                        ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        : isBlocked
                        ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                        : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {step.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-5 pt-0 space-y-3.5 font-mono text-xs">
                  {/* Summary */}
                  <div className={`p-3.5 rounded-xl space-y-1 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                    <span className={`text-[10px] uppercase font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Résumé de la génération
                    </span>
                    <p className={`font-sans text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{step.outputSummary}</p>
                  </div>

                  {/* Files Touched */}
                  {step.filesTouched.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fichiers modifiés :</span>
                      {step.filesTouched.map((f) => (
                        <span key={f} className={`px-2 py-0.5 rounded-md font-medium ${
                          isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Logs Terminal */}
                  <div className="rounded-xl bg-slate-950 p-3.5 space-y-1.5 font-mono text-[11px] max-h-56 overflow-y-auto text-slate-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                      <span>Console stdout / stderr</span>
                      <span>{matchingLogs.length} entrées</span>
                    </div>
                    {matchingLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-slate-500 select-none">{log.timestamp}</span>
                        <span
                          className={`font-bold ${
                            log.level === 'error'
                              ? 'text-rose-400'
                              : log.level === 'warn'
                              ? 'text-amber-400'
                              : log.level === 'success'
                              ? 'text-emerald-400'
                              : 'text-emerald-300'
                          }`}
                        >
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Bar / Hot Prompt Injection */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={promptInputs[step.id] || ''}
                        onChange={(e) =>
                          setPromptInputs({ ...promptInputs, [step.id]: e.target.value })
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(step.id)}
                        placeholder={`Injecter une consigne à chaud pour ${step.agentName}...`}
                        className={`w-full pl-3.5 pr-8 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono ${
                          isDark
                            ? 'bg-slate-900 text-slate-100 placeholder:text-slate-500'
                            : 'bg-slate-50 focus:bg-slate-100 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <button
                        onClick={() => handleSendPrompt(step.id)}
                        className={`absolute right-2.5 top-2.5 cursor-pointer ${
                          isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRerunStep(step.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer font-medium ${
                          isDark
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Relancer</span>
                      </button>
                      <button
                        onClick={() => onNavigateToTab('canvas')}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs transition-colors cursor-pointer font-bold shadow-xs"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Canvas</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
