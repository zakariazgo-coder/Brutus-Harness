import React from 'react';
import {
  Play,
  Pause,
  Square,
  MoreVertical,
  Clock,
  GitPullRequest,
  Plus,
  Sun,
  Moon,
} from 'lucide-react';
import { MissionData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MissionHeaderProps {
  mission: MissionData;
  isPaused: boolean;
  onTogglePause: () => void;
  onStopMission: () => void;
  onOpenNewAgent: () => void;
  onOpenDiff: () => void;
  onOpenMenu: () => void;
  elapsedSeconds: number;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({
  mission,
  isPaused,
  onTogglePause,
  onStopMission,
  onOpenNewAgent,
  onOpenDiff,
  onOpenMenu,
  elapsedSeconds,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins} min ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <header
      className={`h-14 px-5 flex items-center justify-between shrink-0 select-none z-20 font-sans shadow-xs transition-colors duration-200 ${
        isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
      }`}
    >
      {/* Left info: Title, Badge, Progress */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            MISSION <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>#042</span>
          </span>
          <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
          <h1 className={`text-xs md:text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>{mission.title}</span>
          </h1>

          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isPaused
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-amber-100 text-amber-900'
                : isDark
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused
                  ? 'bg-amber-500'
                  : isDark
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-emerald-600 animate-pulse'
              }`}
            />
            <span>{isPaused ? 'EN PAUSE' : 'EN COURS'}</span>
          </div>

          <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} hidden md:inline`}>•</span>

          <div className={`hidden md:flex items-center gap-1 text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Right controls: Theme Toggle, Pause, Stop, Global Diff, New Agent, Menu */}
      <div className="flex items-center gap-2">
        {/* Diff preview button */}
        <button
          onClick={onOpenDiff}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title="Voir les diffs cumulés de la mission"
        >
          <GitPullRequest className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span className="hidden sm:inline">Diff</span>
          <span
            className={`px-1 py-0.2 rounded text-[9px] font-bold ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            +18
          </span>
        </button>

        {/* Deploy New Agent trigger */}
        <button
          onClick={onOpenNewAgent}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono text-white transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span className="font-semibold hidden md:inline">Ajouter un agent</span>
        </button>

        {/* Pause / Resume */}
        <button
          onClick={onTogglePause}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
            isPaused
              ? isDark
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
              : isDark
              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
          title={isPaused ? 'Reprendre l’orchestration' : 'Mettre en pause'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isPaused ? 'Reprendre' : 'Pause'}</span>
        </button>

        {/* Stop mission */}
        <button
          onClick={onStopMission}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
            isDark
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300'
              : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
          }`}
          title="Arrêter la mission"
        >
          <Square className="w-3 h-3 fill-current" />
          <span className="hidden sm:inline">Arrêter</span>
        </button>

        {/* THEME TOGGLE BUTTON (Dark / Light) in top right */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
            isDark
              ? 'bg-slate-700/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
          }`}
          title={isDark ? 'Passer en mode clair (Light)' : 'Passer en mode sombre (Dark)'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
              <span className="text-[11px] font-mono font-bold text-amber-200 hidden lg:inline">Clair</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
              <span className="text-[11px] font-mono font-bold text-slate-700 hidden lg:inline">Sombre</span>
            </>
          )}
        </button>

        {/* Extra Settings/Menu */}
        <button
          onClick={onOpenMenu}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Options de la mission"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
