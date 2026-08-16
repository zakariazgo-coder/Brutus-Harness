import React, { useState } from 'react';
import { AgentNode, MissionData } from '../types';
import {
  TrendingDown,
  Download,
  Sliders,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CostsViewProps {
  mission: MissionData;
  agents: AgentNode[];
  onNavigateToTab: (tab: string) => void;
}

export const CostsView: React.FC<CostsViewProps> = ({
  mission,
  agents,
}) => {
  const { isDark } = useTheme();
  const [budgetLimit] = useState(50.0);
  const [downloaded, setDownloaded] = useState(false);

  const modelDistribution = [
    { name: 'Claude 3.7 Sonnet (Anthropic)', tokens: 160000, cost: 1.24, percentage: 54, color: 'bg-emerald-500' },
    { name: 'Codex-Pro-Edit (OpenAI)', tokens: 77000, cost: 0.72, percentage: 31, color: 'bg-teal-500' },
    { name: 'Researcher-Fast-Embed', tokens: 29450, cost: 0.20, percentage: 8, color: 'bg-amber-500' },
    { name: 'Prime-Worker-Local (Ollama)', tokens: 42000, cost: 0.15, percentage: 7, color: isDark ? 'bg-slate-600' : 'bg-slate-400' },
  ];

  const handleExportCsv = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const currentSpend = mission.totalCost;
  const budgetUsagePercent = Math.min(100, Math.round((currentSpend / budgetLimit) * 100));

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
              OPTIMISATION FINANCIÈRE
            </span>
            <span>•</span>
            <span className="font-semibold">Budget Actif</span>
          </div>
          <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analyse des Coûts & Consommation LLM
          </h1>
          <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Suivi financier en temps réel multi-modèle, optimisation du prompt caching et allocation par agent.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleExportCsv}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer font-medium ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>{downloaded ? 'Rapport CSV exporté !' : 'Exporter CSV'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        {/* Card 1: Total Cost */}
        <div className={`p-6 rounded-2xl space-y-2 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <span className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Coût Total Mission #{mission.id}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              €{mission.totalCost.toFixed(2)}
            </span>
            <span className={`text-xs font-bold flex items-center ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              <TrendingDown className="w-3 h-3 mr-0.5" /> -42% cache
            </span>
          </div>
          <p className={`text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Économie de ~3,40 € via le prompt caching.
          </p>
        </div>

        {/* Card 2: Total Tokens */}
        <div className={`p-6 rounded-2xl space-y-2 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <span className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Volume de Tokens Traités
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mission.totalTokens.toLocaleString('fr-FR')}
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>142 tok/s</span>
          </div>
          <p className={`text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            235k entrée • 73k sortie générés.
          </p>
        </div>

        {/* Card 3: Cache Hit Rate */}
        <div className={`p-6 rounded-2xl space-y-2 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <span className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Efficacité Prompt Cache
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>76.4%</span>
            <span className={`text-xs font-bold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>Optimal</span>
          </div>
          <p className={`text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Contexte et AST partagés entre agents.
          </p>
        </div>
      </div>

      {/* 3. Budget Guardrail Bar */}
      <div className={`p-6 rounded-2xl space-y-3 font-mono shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Plafond Budgétaire Mensuel</span>
          </div>
          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Utilisé : <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>€{currentSpend.toFixed(2)}</strong> / €{budgetLimit.toFixed(2)} ({budgetUsagePercent}%)
          </span>
        </div>

        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${budgetUsagePercent}%` }}
          />
        </div>
      </div>

      {/* 4. Two columns breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        {/* Model Distribution */}
        <div className={`p-6 rounded-2xl space-y-4 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <PieChart className="w-3.5 h-3.5 text-emerald-500" />
            <h2 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Répartition par Modèle</h2>
          </div>

          <div className="space-y-3">
            {modelDistribution.map((item) => (
              <div key={item.name} className={`p-3.5 rounded-xl space-y-2 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{item.name}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{item.tokens.toLocaleString('fr-FR')} tok</span>
                    <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>€{item.cost.toFixed(2)} ({item.percentage}%)</span>
                  </div>
                </div>

                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Agent */}
        <div className={`p-6 rounded-2xl space-y-4 shadow-sm transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              <h2 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Consommation par Agent</h2>
            </div>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{agents.length} agents</span>
          </div>

          <div className="space-y-2.5">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                  isDark
                    ? 'bg-slate-900/60 hover:bg-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                    isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {agent.shortName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-bold text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{agent.name}</p>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{agent.model}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span className={`hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {agent.tokens.toLocaleString('fr-FR')} tok
                  </span>
                  <span className={`font-bold w-12 text-right ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    €{agent.cost.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
