import React, { useState } from 'react';
import {
  Brain,
  Code2,
  ShieldAlert,
  Workflow,
  CheckCircle2,
  Atom,
  GripVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PALETTE_ITEMS } from '../data/initialData';
import { PaletteItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AgentPaletteProps {
  onAddAgentFromPalette: (item: PaletteItem) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-4 h-4 text-indigo-500" />,
  Code2: <Code2 className="w-4 h-4 text-emerald-500" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4 text-amber-500" />,
  Workflow: <Workflow className="w-4 h-4 text-violet-500" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4 text-teal-500" />,
  Atom: <Atom className="w-4 h-4 text-purple-500" />,
};

export const AgentPalette: React.FC<AgentPaletteProps> = ({ onAddAgentFromPalette }) => {
  const { isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`absolute top-5 left-5 z-20 transition-all duration-300 select-none ${
        collapsed ? 'w-10' : 'w-64'
      }`}
    >
      <div className={`rounded-xl shadow-lg overflow-hidden transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-3 py-2 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Palette d'Agents
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1 rounded transition-colors ml-auto cursor-pointer ${
              isDark
                ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title={collapsed ? 'Déplier la palette' : 'Replier la palette'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Content list */}
        {!collapsed && (
          <div className="p-2 space-y-1.5 max-h-[calc(100vh-250px)] overflow-y-auto">
            <p className={`text-[10px] px-1 py-0.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Glissez un agent pour le déployer sur le canvas :
            </p>
            {PALETTE_ITEMS.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(item));
                }}
                onClick={() => onAddAgentFromPalette(item)}
                className={`group flex items-start gap-2.5 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all shadow-2xs ${
                  isDark
                    ? 'bg-slate-900/60 hover:bg-slate-700/50'
                    : 'bg-slate-50 hover:bg-emerald-50'
                }`}
              >
                <div className={`mt-0.5 p-1 rounded shadow-2xs ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  {iconMap[item.icon] || <Sparkles className="w-4 h-4 text-emerald-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isDark ? 'text-slate-200 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-700'}`}>
                      {item.name}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className={`text-[10px] line-clamp-1 mt-0.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono shadow-2xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'}`}>
                      {item.defaultModel.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300 mt-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
