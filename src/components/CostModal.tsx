import React from 'react';
import { AgentNode, MissionData } from '../types';
import {
  X,
  Coins,
  TrendingDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CostModalProps {
  mission: MissionData;
  agents: AgentNode[];
  onClose: () => void;
}

export const CostModal: React.FC<CostModalProps> = ({ mission, agents, onClose }) => {
  const { isDark } = useTheme();

  const modelDistribution = [
    { name: 'Claude 3.5 Sonnet (Anthropic)', tokens: 160000, cost: 1.24, percentage: 54 },
    { name: 'GPT-4o Codex (OpenAI)', tokens: 77000, cost: 0.72, percentage: 31 },
    { name: 'DeepSeek-V3 Coder (Local VPS)', tokens: 42000, cost: 0.15, percentage: 7 },
    { name: 'Perplexity / RFC Search', tokens: 29450, cost: 0.20, percentage: 8 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden font-mono transition-colors ${
        isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between transition-colors ${
          isDark ? 'bg-slate-800/90' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Coûts & Consommation LLM en Temps Réel
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Suivi multi-modèle de la mission #{mission.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-xl shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <span className={`text-xs block mb-1 font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Coût Total Mission</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {mission.totalCost.toFixed(2)} €
                </span>
                <span className={`text-[10px] font-bold flex items-center ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <TrendingDown className="w-3 h-3 inline mr-0.5" /> -42% cache
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <span className={`text-xs block mb-1 font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tokens Consommés</span>
              <span className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {mission.totalTokens.toLocaleString('fr-FR')}
              </span>
            </div>

            <div className={`p-4 rounded-xl shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <span className={`text-xs block mb-1 font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Prompt Cache Hit</span>
              <span className={`text-2xl font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>76.4%</span>
            </div>
          </div>

          {/* Breakdown by Agent */}
          <div>
            <h3 className={`text-xs uppercase font-bold mb-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Consommation par Agent
            </h3>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-xl flex items-center justify-between text-xs shadow-2xs ${
                    isDark ? 'bg-slate-900/60' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                      isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {agent.shortName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{agent.name}</p>
                      <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{agent.model}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {agent.tokens.toLocaleString('fr-FR')} tokens
                      </span>
                    </div>
                    <div className="w-20 text-right">
                      <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        {agent.cost.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Provider Share */}
          <div>
            <h3 className={`text-xs uppercase font-bold mb-3 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Répartition par Fournisseur
            </h3>
            <div className="space-y-2">
              {modelDistribution.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className={`flex items-center justify-between text-xs font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <span>{item.name}</span>
                    <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{item.cost.toFixed(2)} € ({item.percentage}%)</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
