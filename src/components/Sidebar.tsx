import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Terminal,
  FolderGit2,
  Coins,
  Settings,
  Server,
  Cpu,
  HardDrive,
  Layers,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCosts: () => void;
  onOpenFiles: () => void;
  onOpenSettings: () => void;
  onOpenVpsModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenVpsModal,
}) => {
  const { isDark } = useTheme();

  const navItems = [
    { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard, badge: undefined },
    { id: 'missions', label: 'Missions', icon: Compass, badge: '1' },
    { id: 'canvas', label: 'Canvas des agents', icon: Layers, badge: '6 live' },
    { id: 'executions', label: 'Exécutions', icon: Terminal, badge: '42m' },
    { id: 'files', label: 'Fichiers', icon: FolderGit2, badge: '18' },
    { id: 'costs', label: 'Coûts', icon: Coins, badge: '2,31 €' },
    { id: 'settings', label: 'Réglages', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 h-screen flex flex-col justify-between shrink-0 select-none z-30 font-sans shadow-sm transition-colors duration-200 ${
        isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
      }`}
    >
      {/* Brand & Logo */}
      <div className="p-4">
        <div
          onClick={() => onTabChange('overview')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
            isDark
              ? 'bg-slate-900/60 hover:bg-slate-900/80'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center p-1 text-white shadow-sm">
            <svg viewBox="0 0 40 40" className="w-5 h-5">
              <polygon points="20,4 36,14 36,28 20,38 4,28 4,14" fill="none" stroke="currentColor" strokeWidth="2" />
              <polygon points="20,4 28,21 20,38 12,21" fill="rgba(255,255,255,0.4)" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold tracking-wide text-sm font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                BRUTUS
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                PROD
              </span>
            </div>
            <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Control Room
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'bg-emerald-50 text-emerald-900 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? isDark
                          ? 'text-emerald-400'
                          : 'text-emerald-600'
                        : isDark
                        ? 'text-slate-400 group-hover:text-slate-200'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? isDark
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : 'bg-emerald-200 text-emerald-900'
                        : isDark
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: VPS Health & User Profile */}
      <div className={`p-3 space-y-3 transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        {/* VPS Status Widget */}
        <div
          onClick={onOpenVpsModal}
          className={`p-2.5 rounded-lg cursor-pointer transition-all group ${
            isDark
              ? 'bg-slate-900/60 hover:bg-slate-900/80'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}
          title="Cliquez pour les métriques détaillées du VPS"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Server className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span
                className={`text-[11px] font-mono font-medium transition-colors ${
                  isDark
                    ? 'text-slate-200 group-hover:text-white'
                    : 'text-slate-800 group-hover:text-slate-900'
                }`}
              >
                vps-hetzner-fsn1
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span
                className={`text-[10px] font-mono font-semibold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}
              >
                99.98%
              </span>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-1.5 text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded shadow-2xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white'}`}>
              <Cpu className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              <span>4 vCPU (24%)</span>
            </div>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded shadow-2xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white'}`}>
              <HardDrive className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              <span>8.2 Go RAM</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div
          className={`flex items-center justify-between px-2.5 py-2 rounded-lg ${
            isDark ? 'bg-slate-900/60' : 'bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] font-mono ${
                  isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                AV
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ${
                  isDark ? 'ring-slate-800' : 'ring-white'
                }`}
              />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Alexandre V.
              </p>
              <p className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Architecte IA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              En ligne
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
