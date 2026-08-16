import React from 'react';
import { AgentNode } from '../types';
import { Maximize2, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MinimapProps {
  nodes: AgentNode[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  pan: { x: number; y: number };
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onCenterView: () => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  pan,
  zoom,
  canvasWidth,
  canvasHeight,
  onCenterView,
}) => {
  const { isDark } = useTheme();

  // Minimap dimensions
  const miniWidth = 180;
  const miniHeight = 120;
  
  // World bounds approximation
  const worldMinX = 0;
  const worldMaxX = 1100;
  const worldMinY = 0;
  const worldMaxY = 800;
  const worldWidth = worldMaxX - worldMinX;
  const worldHeight = worldMaxY - worldMinY;

  // Transform world coords to minimap coords
  const mapX = (x: number) => (x / worldWidth) * miniWidth;
  const mapY = (y: number) => (y / worldHeight) * miniHeight;

  // Viewport rect calculation in minimap
  const viewWorldX = -pan.x / zoom;
  const viewWorldY = -pan.y / zoom;
  const viewWorldW = canvasWidth / zoom;
  const viewWorldH = canvasHeight / zoom;

  const miniViewX = Math.max(0, Math.min(miniWidth, mapX(viewWorldX)));
  const miniViewY = Math.max(0, Math.min(miniHeight, mapY(viewWorldY)));
  const miniViewW = Math.max(16, Math.min(miniWidth, (viewWorldW / worldWidth) * miniWidth));
  const miniViewH = Math.max(12, Math.min(miniHeight, (viewWorldH / worldHeight) * miniHeight));

  const getNodeColor = (node: AgentNode) => {
    if (node.isBlocked || node.status === 'blocked') return '#f59e0b';
    if (node.status === 'working') return '#10b981';
    if (node.status === 'complete') return '#14b8a6';
    if (node.status === 'waiting') return isDark ? '#94a3b8' : '#64748b';
    return '#8b5cf6';
  };

  return (
    <div className="absolute bottom-5 right-5 z-20 select-none">
      <div className={`rounded-xl p-2 shadow-lg transition-colors ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className={`flex items-center justify-between px-1 mb-1.5 text-[10px] font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <div className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-500" />
            <span>RADAR CANVAS</span>
          </div>
          <button
            onClick={onCenterView}
            className={`transition-colors p-0.5 cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'
            }`}
            title="Recentrer le canvas"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        <div
          className={`relative rounded-lg overflow-hidden cursor-crosshair transition-colors ${
            isDark ? 'bg-slate-900' : 'bg-slate-100'
          }`}
          style={{ width: miniWidth, height: miniHeight }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            let closestNode = nodes[0];
            let minDist = Infinity;
            nodes.forEach((n) => {
              const nx = mapX(n.x);
              const ny = mapY(n.y);
              const dist = Math.hypot(nx - clickX, ny - clickY);
              if (dist < minDist) {
                minDist = dist;
                closestNode = n;
              }
            });
            if (minDist < 30) {
              onSelectNode(closestNode.id);
            }
          }}
        >
          {/* Connected lines simulation in minimap */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((n) => {
              if (n.id === 'brutus') return null;
              const bx = mapX(480);
              const by = mapY(350);
              const nx = mapX(n.x);
              const ny = mapY(n.y);
              return (
                <line
                  key={n.id}
                  x1={bx}
                  y1={by}
                  x2={nx}
                  y2={ny}
                  stroke={isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(100, 116, 139, 0.25)'}
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Node dots */}
          {nodes.map((node) => {
            const nx = mapX(node.x);
            const ny = mapY(node.y);
            const isSelected = selectedNodeId === node.id;
            const color = getNodeColor(node);

            return (
              <div
                key={node.id}
                style={{ left: `${nx}px`, top: `${ny}px` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform ${
                  isSelected ? 'scale-150 ring-2 ring-emerald-500 z-10' : 'hover:scale-125'
                }`}
                title={`${node.name} (${node.statusLabel})`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            );
          })}

          {/* Viewport rect indicator */}
          <div
            className="absolute bg-emerald-500/20 border border-emerald-500/40 pointer-events-none rounded-sm transition-all duration-75"
            style={{
              left: `${miniViewX}px`,
              top: `${miniViewY}px`,
              width: `${miniViewW}px`,
              height: `${miniViewH}px`,
            }}
          />
        </div>

        <div className={`flex items-center justify-between text-[9px] font-mono mt-1 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{Math.round(zoom * 100)}% zoom</span>
          <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{nodes.length} nœuds</span>
        </div>
      </div>
    </div>
  );
};
