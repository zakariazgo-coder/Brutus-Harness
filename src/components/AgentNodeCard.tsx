import React from 'react';
import { AgentNode } from '../types';
import {
  Brain,
  Code2,
  ShieldAlert,
  Workflow,
  CheckCircle2,
  Atom,
  Check,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type PortPosition = 'top' | 'right' | 'bottom' | 'left';

interface AgentNodeCardProps {
  node: AgentNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onApprove?: (id: string) => void;
  onToggleNodePause?: (id: string) => void;
  onPortMouseDown?: (nodeId: string, port: PortPosition, e: React.MouseEvent) => void;
  onPortMouseUp?: (nodeId: string, port: PortPosition, e: React.MouseEvent) => void;
  isConnecting?: boolean;
}

export const AgentNodeCard: React.FC<AgentNodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onApprove,
  onPortMouseDown,
  onPortMouseUp,
  isConnecting = false,
}) => {
  const { isDark } = useTheme();
  const isCentral = node.id === 'brutus';

  const getRoleIcon = () => {
    switch (node.role) {
      case 'orchestrator':
        return (
          <svg viewBox="0 0 40 40" className="w-10 h-10 text-emerald-500">
            <polygon points="20,4 36,14 36,28 20,38 4,28 4,14" fill="rgba(16,185,129,0.15)" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="20,4 28,21 20,38 12,21" fill="rgba(16,185,129,0.25)" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="21" r="3" fill="#10b981" className="animate-pulse" />
          </svg>
        );
      case 'planner':
        return <Brain className="w-5 h-5 text-indigo-500" />;
      case 'builder':
        return <Code2 className="w-5 h-5 text-emerald-500" />;
      case 'worker':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'coordinator':
        return <Workflow className="w-5 h-5 text-violet-500" />;
      case 'qa':
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      case 'researcher':
        return <Atom className="w-5 h-5 text-purple-500" />;
      default:
        return <Zap className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getStatusBadge = () => {
    if (node.isBlocked || node.status === 'blocked') {
      return {
        bg: isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-900',
        dot: 'bg-amber-500',
        label: 'Bloqué',
      };
    }
    if (node.status === 'working') {
      return {
        bg: isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-900',
        dot: 'bg-emerald-500 animate-pulse',
        label: 'En cours',
      };
    }
    if (node.status === 'complete') {
      return {
        bg: isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-900',
        dot: 'bg-teal-500',
        label: 'Terminé',
      };
    }
    if (node.status === 'waiting') {
      return {
        bg: isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700',
        dot: isDark ? 'bg-slate-400' : 'bg-slate-500',
        label: 'En attente',
      };
    }
    return {
      bg: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-900',
      dot: 'bg-purple-500',
      label: 'En veille',
    };
  };

  const badge = getStatusBadge();

  // Helper render 4 Connection Anchor Ports
  const renderPorts = () => {
    const ports: { pos: PortPosition; classNames: string }[] = [
      { pos: 'top', classNames: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
      { pos: 'right', classNames: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
      { pos: 'bottom', classNames: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
      { pos: 'left', classNames: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
    ];

    return (
      <>
        {ports.map(({ pos, classNames }) => (
          <div
            key={`port-${node.id}-${pos}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (onPortMouseDown) onPortMouseDown(node.id, pos, e);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              if (onPortMouseUp) onPortMouseUp(node.id, pos, e);
            }}
            title="Tirer une corde / Relier à un agent"
            className={`absolute z-30 ${classNames} w-4 h-4 rounded-full flex items-center justify-center cursor-crosshair group/port transition-all duration-150 ${
              isConnecting ? 'scale-125' : 'hover:scale-125'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                isCentral
                  ? 'bg-emerald-400 border-slate-900 group-hover/port:bg-emerald-300 group-hover/port:ring-4 group-hover/port:ring-emerald-500/40'
                  : 'bg-teal-400 border-slate-900 group-hover/port:bg-teal-300 group-hover/port:ring-4 group-hover/port:ring-teal-500/40'
              } ${isConnecting ? 'ring-2 ring-emerald-400 animate-pulse' : ''}`}
            />
          </div>
        ))}
      </>
    );
  };

  if (isCentral) {
    // Large circular central Brutus Orchestrator
    return (
      <div
        onClick={() => onSelect(node.id)}
        className={`relative group cursor-pointer transition-all duration-300 select-none ${
          isSelected ? 'scale-105 z-30' : 'hover:scale-102 z-20'
        }`}
        style={{ width: '240px' }}
      >
        {/* Connection Ports on 4 cardinal directions */}
        {renderPorts()}

        {/* Central Card Shell */}
        <div
          className={`relative rounded-full p-6 ${
            isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
          } ${
            isSelected
              ? 'shadow-xl ring-4 ring-emerald-500/30'
              : 'hover:shadow-lg shadow-md'
          } flex flex-col items-center text-center justify-center aspect-square transition-all`}
        >
          {/* Icon Orb */}
          <div className={`relative mb-2 p-2.5 rounded-full ${isDark ? 'bg-slate-900/80' : 'bg-emerald-50'}`}>
            {getRoleIcon()}
          </div>

          <h2 className={`text-sm font-extrabold tracking-widest font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {node.shortName}
          </h2>

          <div className="flex items-center gap-2 mt-1 mb-2">
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${badge.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
              <span>{badge.label}</span>
            </span>
            <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {node.progress}%
            </span>
          </div>

          <p className={`text-[11px] line-clamp-2 px-2 leading-tight font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {node.task}
          </p>

          <div className={`mt-2 pt-2 flex items-center justify-center gap-2 text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>{Math.round(node.tokens / 1000)}k tokens</span>
            <span>•</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{node.cost.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    );
  }

  // Peripheral Node Design
  const isPrimeBlocked = node.id === 'prime' && (node.isBlocked || node.requiresApproval);

  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`relative group cursor-pointer transition-all duration-200 select-none ${
        isSelected ? 'scale-105 z-30' : 'hover:scale-102 z-10'
      }`}
      style={{ width: '220px' }}
    >
      {/* 4 Connection Anchor Ports on Border */}
      {renderPorts()}

      {/* Card Body */}
      <div
        className={`relative rounded-xl p-3.5 ${
          isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
        } ${
          isSelected ? 'shadow-lg ring-2 ring-emerald-500' : 'shadow-md hover:shadow-lg'
        } transition-all`}
      >
        {/* Top bar: Icon, Name, Status Pill */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isPrimeBlocked
                ? isDark
                  ? 'bg-amber-500/20'
                  : 'bg-amber-50'
                : isDark
                ? 'bg-slate-900/60'
                : 'bg-slate-100'
            }`}
          >
            {getRoleIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold truncate font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {node.shortName}
              </h3>
              <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {node.progress}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-medium ${badge.bg}`}
              >
                <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                <span>{badge.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Task description */}
        <p className={`text-[10px] line-clamp-2 mt-2 leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {node.task}
        </p>

        {/* Approval banner for Prime Worker */}
        {isPrimeBlocked && (
          <div className="mt-2.5 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onApprove) onApprove(node.id);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] font-mono transition-all cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Approuver</span>
            </button>
          </div>
        )}

        {/* Footer Metrics */}
        <div className={`mt-2.5 pt-2 flex items-center justify-between text-[9px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{Math.round(node.tokens / 1000)}k tokens</span>
          <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{node.cost.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

