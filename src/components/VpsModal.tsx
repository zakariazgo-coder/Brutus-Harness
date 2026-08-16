import React from 'react';
import { MissionData } from '../types';
import {
  X,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface VpsModalProps {
  mission: MissionData;
  onClose: () => void;
}

export const VpsModal: React.FC<VpsModalProps> = ({ mission, onClose }) => {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden font-mono transition-colors ${
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
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Infrastructure VPS Auto-Hébergée
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  En ligne
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instance : {mission.vps.host} (Frankfurt, DE)
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Resource Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl space-y-1 shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  Processeur vCPU
                </span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>24%</span>
              </div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.vps.cpuUsage}</p>
              <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="h-full bg-emerald-500" style={{ width: '24%' }} />
              </div>
            </div>

            <div className={`p-3.5 rounded-xl space-y-1 shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1.5 font-medium">
                  <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                  Mémoire RAM
                </span>
                <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>26%</span>
              </div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.vps.ramUsage}</p>
              <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="h-full bg-purple-500" style={{ width: '26%' }} />
              </div>
            </div>

            <div className={`p-3.5 rounded-xl space-y-1 shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Runtime Conteneurs
                </span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Docker OK</span>
              </div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.vps.dockerStatus}</p>
            </div>

            <div className={`p-3.5 rounded-xl space-y-1 shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
              <div className={`flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Accélération GPU
                </span>
                <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>CUDA 12.4</span>
              </div>
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{mission.vps.gpuStatus}</p>
            </div>
          </div>

          {/* Docker daemons & Network status */}
          <div className={`p-3.5 rounded-xl space-y-2 shadow-2xs ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
            <span className={`text-[10px] uppercase font-bold block font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Services Système BRUTUS
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between py-1">
                <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>brutus-orchestrator-core.service</span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>● Active (running)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>brutus-ollama-local-inference.service</span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>● Active (running)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>brutus-git-sandbox-daemon.service</span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>● Active (running)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
