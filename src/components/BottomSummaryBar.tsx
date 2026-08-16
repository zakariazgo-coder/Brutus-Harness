import React from 'react';
import { MissionData } from '../types';
import {
  Layers,
  Clock,
  Coins,
  FileCode2,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BottomSummaryBarProps {
  mission: MissionData;
  elapsedSeconds: number;
  onOpenCosts: () => void;
  onOpenDiff: () => void;
  onOpenVpsModal: () => void;
}

export const BottomSummaryBar: React.FC<BottomSummaryBarProps> = ({
  mission,
  elapsedSeconds,
  onOpenCosts,
  onOpenDiff,
  onOpenVpsModal,
}) => {
  const { isDark } = useTheme();

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins} min ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <footer
      className={`h-9 px-4 flex items-center justify-between shrink-0 select-none z-20 font-mono text-[11px] shadow-xs transition-colors duration-200 ${
        isDark
          ? 'bg-slate-800 text-slate-400'
          : 'bg-white text-slate-500'
      }`}
    >
      {/* Left items: Agent count, Elapsed time, Cost */}
      <div className="flex items-center gap-4">
        {/* Agent count */}
        <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <Layers className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.activeAgentsCount}</strong> agents
          </span>
        </div>

        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>

        {/* Time elapsed */}
        <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatTime(elapsedSeconds)}</strong> écoulées
          </span>
        </div>

        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>

        {/* Total Cost */}
        <button
          onClick={onOpenCosts}
          className={`flex items-center gap-1.5 transition-colors group cursor-pointer font-bold ${
            isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
          }`}
          title="Ouvrir la répartition détaillée des coûts LLM"
        >
          <Coins className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            <strong className="group-hover:underline">
              {mission.totalCost.toFixed(2)} €
            </strong>{' '}
            coût total
          </span>
        </button>

        <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden md:inline`}>|</span>

        {/* Files Modified */}
        <button
          onClick={onOpenDiff}
          className={`hidden md:flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
          }`}
          title="Voir les diffs des fichiers"
        >
          <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
          <span>
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.modifiedFilesCount}</strong> fichiers modifiés
          </span>
        </button>

        <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden lg:inline`}>|</span>

        {/* Tests Passing */}
        <div className={`hidden lg:flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mission.testsSummary.passed}/{mission.testsSummary.total}
            </strong>{' '}
            tests
          </span>
        </div>
      </div>

      {/* Right items: Cluster info & Health */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenVpsModal}
          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-3 h-3 text-slate-400" />
          <span>vps-hetzner-fsn1 (24%)</span>
        </button>
        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
        <div className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cluster Synchrone</span>
        </div>
      </div>
    </footer>
  );
};
