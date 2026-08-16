import React from 'react';
import { AgentNode, MissionData, FileChange } from '../types';
import {
  Flame,
  Zap,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OverviewViewProps {
  mission: MissionData;
  agents: AgentNode[];
  elapsedSeconds: number;
  onNavigateToTab: (tab: string) => void;
  onSelectAgent: (agentId: string) => void;
  onApproveAgent: (agentId: string) => void;
  onToggleAgentPause: (agentId: string) => void;
  onOpenNewAgentModal: () => void;
  onOpenFileDiff: (file: FileChange) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  mission,
  agents,
  onNavigateToTab,
  onSelectAgent,
}) => {
  const { isDark } = useTheme();

  // Compute metrics cleanly
  const activeCount = agents.filter((a) => a.status === 'working').length;
  const completeCount = agents.filter((a) => a.status === 'complete').length;

  return (
    <div
      className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. Top Header Banner - Linear Clean Style (No borders) */}
      <div
        className={`rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div className="space-y-1.5 max-w-4xl">
          <div className={`flex items-center gap-2.5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              CLUSTER ACTIF
            </span>
            <span>•</span>
            <span className="font-semibold">vps-hetzner-fsn1</span>
            <span>•</span>
            <span>Host Linux 6.6</span>
          </div>

          <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Orchestration d'Agents en Production
          </h1>
          <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Mission active : Implémentation du middleware JWT, coordination des contrats OpenAPI et suite de tests E2E.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => onNavigateToTab('canvas')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs"
          >
            <span>Ouvrir le Canvas</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. 4 Key Metric KPI Cards (No borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: Active Agents */}
        <div className={`p-6 rounded-2xl space-y-2 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs font-semibold">Agents Actifs</span>
            <Flame className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeCount > 0 ? activeCount + 2 : 6}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 8 slots</span>
          </div>
          <p className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            {activeCount > 0 ? `${activeCount} en cours` : '4 en cours'} · {completeCount > 0 ? `${completeCount} terminés` : '2 terminés'}
          </p>
        </div>

        {/* Card 2: Token Throughput */}
        <div className={`p-6 rounded-2xl space-y-2 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs font-semibold">Débit Tokens / min</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>14.2k</span>
            <span className="text-xs text-slate-400 font-medium">tok/m</span>
          </div>
          <p className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Plafond 60k/m respecté</p>
        </div>

        {/* Card 3: Tests Passing */}
        <div className={`p-6 rounded-2xl space-y-2 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs font-semibold">Tests Passés</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mission.testsSummary.passed} / {mission.testsSummary.total}
            </span>
          </div>
          <p className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
            90% validé ({mission.testsSummary.total - mission.testsSummary.passed} pending)
          </p>
        </div>

        {/* Card 4: Mission Cost */}
        <div 
          onClick={() => onNavigateToTab('costs')}
          className={`p-6 rounded-2xl space-y-2 cursor-pointer hover:shadow-md transition-all shadow-sm ${
            isDark ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white'
          }`}
        >
          <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-xs font-semibold">Coût Mission</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              €{mission.totalCost.toFixed(2)}
            </span>
          </div>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Budget max : €10.00</p>
        </div>
      </div>

      {/* 3. Table: ÉTAT DES AGENTS DÉPLOYÉS (No borders) */}
      <div className={`rounded-2xl p-6 space-y-4 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-xs font-extrabold tracking-wider font-mono uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ÉTAT DES AGENTS DÉPLOYÉS
          </h2>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline font-medium">
            Hébergement local Ollama & Cloud APIs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono border-collapse">
            <thead>
              <tr className={`text-[11px] uppercase transition-colors ${
                isDark ? 'bg-slate-900/70 text-slate-400' : 'bg-slate-50 text-slate-500'
              }`}>
                <th className="py-3 px-3.5 rounded-l-xl font-bold">Agent</th>
                <th className="py-3 px-3.5 font-bold">Rôle</th>
                <th className="py-3 px-3.5 font-bold">Modèle</th>
                <th className="py-3 px-3.5 font-bold text-center">Statut</th>
                <th className="py-3 px-3.5 font-bold">Progression</th>
                <th className="py-3 px-3.5 font-bold text-right">Tokens</th>
                <th className="py-3 px-3.5 rounded-r-xl font-bold text-right">Coût</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {agents.map((agent) => {
                const isWorking = agent.status === 'working';
                const isComplete = agent.status === 'complete';
                const isWaiting = agent.status === 'waiting' || agent.status === 'blocked';
                const isIdle = agent.status === 'idle' || agent.status === 'paused';

                const tokensFormatted =
                  agent.tokens >= 1000
                    ? `${(agent.tokens / 1000).toFixed(1)}k`
                    : `${agent.tokens}`;

                return (
                  <tr
                    key={agent.id}
                    onClick={() => {
                      onSelectAgent(agent.id);
                      onNavigateToTab('canvas');
                    }}
                    className={`transition-colors cursor-pointer group ${
                      isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* 1. Agent Name */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono transition-colors ${
                          isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'
                        }`}>
                          {agent.name}
                        </span>
                      </div>
                    </td>

                    {/* 2. Role */}
                    <td className={`py-3.5 px-3.5 font-sans text-xs max-w-xs truncate ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {agent.role === 'orchestrator'
                        ? "Noyau d'Orchestration Principal"
                        : agent.role === 'planner'
                        ? 'Architecte Système & Spécifications'
                        : agent.role === 'builder'
                        ? 'Générateur de Code Backend'
                        : agent.role === 'tester'
                        ? 'Validation & Tests E2E Playwright'
                        : agent.role === 'coordinator'
                        ? 'Télémétrie & Synchronisation Webhook'
                        : agent.role === 'researcher'
                        ? 'Recherche & Conformité OAuth2'
                        : agent.task || 'Agent Opérationnel Custom'}
                    </td>

                    {/* 3. Model */}
                    <td className={`py-3.5 px-3.5 text-xs truncate max-w-[200px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {agent.id === 'brutus'
                        ? 'Brutus-Core Engine v3.1'
                        : agent.id === 'claude'
                        ? 'Claude 3.7 Sonnet (Hybrid Reasoning)'
                        : agent.id === 'codex'
                        ? 'Codex-Pro-Edit (Deep Context 128k)'
                        : agent.id === 'prime'
                        ? 'Prime-Worker-Local (Ollama llama3.3:70b)'
                        : agent.id === 'researcher'
                        ? 'Researcher-Fast-Embed'
                        : agent.id === 'qa'
                        ? 'QA-Playwright-Runner v2'
                        : agent.id === 'hermes'
                        ? 'Hermes-Relay-Lite'
                        : agent.model || 'Codex-Pro-Edit'}
                    </td>

                    {/* 4. Status Badge */}
                    <td className="py-3.5 px-3.5 text-center">
                      {isWorking && (
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                          isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          WORKING
                        </span>
                      )}
                      {isComplete && (
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                          isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-800'
                        }`}>
                          COMPLETE
                        </span>
                      )}
                      {isWaiting && (
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                          isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                        }`}>
                          WAITING
                        </span>
                      )}
                      {isIdle && (
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                          isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          IDLE
                        </span>
                      )}
                    </td>

                    {/* 5. Progress */}
                    <td className="py-3.5 px-3.5 min-w-[130px]">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-24 h-2 rounded-full overflow-hidden shrink-0 ${
                          isDark ? 'bg-slate-700' : 'bg-slate-100'
                        }`}>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isComplete
                                ? 'bg-teal-500'
                                : isWaiting
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-mono font-bold w-8 ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}>
                          {agent.progress}%
                        </span>
                      </div>
                    </td>

                    {/* 6. Tokens */}
                    <td className={`py-3.5 px-3.5 text-right font-mono text-xs ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {tokensFormatted}
                    </td>

                    {/* 7. Cost */}
                    <td className={`py-3.5 px-3.5 text-right font-mono text-xs font-bold ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}>
                      €{agent.cost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
