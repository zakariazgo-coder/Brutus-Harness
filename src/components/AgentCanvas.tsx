import React, { useState, useRef, useEffect } from 'react';
import { AgentNode, ConnectionEdge, PaletteItem } from '../types';
import { AgentNodeCard, PortPosition } from './AgentNodeCard';
import { AgentPalette } from './AgentPalette';
import { Minimap } from './Minimap';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AgentCanvasProps {
  nodes: AgentNode[];
  edges: ConnectionEdge[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  onApproveNode: (id: string) => void;
  onAddAgent: (paletteItem: PaletteItem, position: { x: number; y: number }) => void;
  onMoveNode: (id: string, newPos: { x: number; y: number }) => void;
  onDeleteEdge?: (edgeId: string) => void;
  onConnectNodes?: (fromId: string, toId: string, fromPort?: PortPosition, toPort?: PortPosition) => void;
}

export const AgentCanvas: React.FC<AgentCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onApproveNode,
  onAddAgent,
  onMoveNode,
  onDeleteEdge,
  onConnectNodes,
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan & Zoom state
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: -40, y: -20 });
  const [zoom, setZoom] = useState<number>(0.92);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Node Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Cable Pulling / Connecting State
  const [connectingSource, setConnectingSource] = useState<{
    nodeId: string;
    port: PortPosition;
  } | null>(null);
  const [mouseWorldPos, setMouseWorldPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Container dimensions
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1000,
    height: 700,
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2.2));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCenterOnBrutus = () => {
    const brutusNode = nodes.find((n) => n.id === 'brutus');
    if (brutusNode && containerRef.current) {
      const centerX = containerRef.current.clientWidth / 2;
      const centerY = containerRef.current.clientHeight / 2;
      setPan({
        x: centerX - (brutusNode.x + 120) * zoom,
        y: centerY - (brutusNode.y + 120) * zoom,
      });
    }
  };

  // Canvas Pan (Drag Background)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('.canvas-node') ||
      target.closest('.canvas-control') ||
      target.closest('.canvas-palette') ||
      target.closest('.canvas-minimap')
    ) {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update mouse world position for live cable pulling
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const currentMouseX = (e.clientX - rect.left - pan.x) / zoom;
      const currentMouseY = (e.clientY - rect.top - pan.y) / zoom;
      setMouseWorldPos({ x: currentMouseX, y: currentMouseY });
    }

    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    } else if (draggingNodeId) {
      const mouseWorldX = (e.clientX - (rect?.left || 0) - pan.x) / zoom;
      const mouseWorldY = (e.clientY - (rect?.top || 0) - pan.y) / zoom;
      const newX = Math.round(mouseWorldX - dragOffset.x);
      const newY = Math.round(mouseWorldY - dragOffset.y);
      onMoveNode(draggingNodeId, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    if (connectingSource) {
      // Released in empty space -> cancel connection
      setConnectingSource(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? -0.05 : 0.05;
    handleZoom(zoomFactor);
  };

  // Node Drag start
  const handleNodeMouseDown = (e: React.MouseEvent, node: AgentNode) => {
    e.stopPropagation();
    onSelectNode(node.id);
    const rect = containerRef.current?.getBoundingClientRect();
    const mouseWorldX = (e.clientX - (rect?.left || 0) - pan.x) / zoom;
    const mouseWorldY = (e.clientY - (rect?.top || 0) - pan.y) / zoom;
    setDraggingNodeId(node.id);
    setDragOffset({
      x: mouseWorldX - node.x,
      y: mouseWorldY - node.y,
    });
  };

  // Port Cable Pulling Handlers
  const handlePortMouseDown = (nodeId: string, port: PortPosition, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    const currentMouseX = (e.clientX - (rect?.left || 0) - pan.x) / zoom;
    const currentMouseY = (e.clientY - (rect?.top || 0) - pan.y) / zoom;
    setMouseWorldPos({ x: currentMouseX, y: currentMouseY });
    setConnectingSource({ nodeId, port });
  };

  const handlePortMouseUp = (targetNodeId: string, targetPort: PortPosition, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectingSource && connectingSource.nodeId !== targetNodeId) {
      if (onConnectNodes) {
        onConnectNodes(connectingSource.nodeId, targetNodeId, connectingSource.port, targetPort);
      }
    }
    setConnectingSource(null);
  };

  // Drag and Drop from Palette
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) return;
    try {
      const item = JSON.parse(dataStr) as PaletteItem;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dropWorldX = (e.clientX - rect.left - pan.x) / zoom - 100;
      const dropWorldY = (e.clientY - rect.top - pan.y) / zoom - 50;
      onAddAgent(item, { x: Math.max(50, dropWorldX), y: Math.max(50, dropWorldY) });
    } catch (err) {
      console.error('Error adding agent from palette:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Node Center & Port position helper for SVG connections
  const getNodePortPos = (nodeId: string, port?: PortPosition) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    if (node.id === 'brutus') {
      const cx = node.x + 120;
      const cy = node.y + 120;
      const r = 120;
      switch (port) {
        case 'top': return { x: cx, y: cy - r };
        case 'right': return { x: cx + r, y: cy };
        case 'bottom': return { x: cx, y: cy + r };
        case 'left': return { x: cx - r, y: cy };
        default: return { x: cx, y: cy };
      }
    }

    const width = 220;
    const height = 110;
    switch (port) {
      case 'top': return { x: node.x + width / 2, y: node.y };
      case 'right': return { x: node.x + width, y: node.y + height / 2 };
      case 'bottom': return { x: node.x + width / 2, y: node.y + height };
      case 'left': return { x: node.x, y: node.y + height / 2 };
      default: return { x: node.x + width / 2, y: node.y + height / 2 };
    }
  };

  // Generate SVG Bezier Path between 2 points or 2 nodes
  const getCurvePath = (edge: ConnectionEdge) => {
    const fromPos = getNodePortPos(edge.from, edge.fromPort || 'right');
    const toPos = getNodePortPos(edge.to, edge.toPort || 'left');

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const cx1 = fromPos.x + dx * 0.45;
    const cy1 = fromPos.y;
    const cx2 = fromPos.x + dx * 0.55;
    const cy2 = toPos.y;

    return `M ${fromPos.x} ${fromPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toPos.x} ${toPos.y}`;
  };

  // Helper live path when user is dragging a new cable
  const getLivePullingPath = () => {
    if (!connectingSource) return '';
    const fromPos = getNodePortPos(connectingSource.nodeId, connectingSource.port);
    const toPos = mouseWorldPos;
    const dx = toPos.x - fromPos.x;
    const cx1 = fromPos.x + dx * 0.45;
    const cy1 = fromPos.y;
    const cx2 = fromPos.x + dx * 0.55;
    const cy2 = toPos.y;
    return `M ${fromPos.x} ${fromPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toPos.x} ${toPos.y}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-slate-900' : 'bg-[#f1f5f9]'
      } ${isPanning ? 'cursor-grabbing' : connectingSource ? 'cursor-crosshair' : 'cursor-grab'}`}
    >
      {/* Background Grid */}
      {showGrid && (
        <div
          className={`absolute inset-0 ${isDark ? 'tech-grid-bg-dark' : 'tech-grid-bg'} opacity-70 pointer-events-none`}
          style={{
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            backgroundSize: `${32 * zoom}px ${32 * zoom}px, ${128 * zoom}px ${128 * zoom}px`,
          }}
        />
      )}

      {/* Floating Canvas Toolbar Controls */}
      <div
        className={`absolute top-5 right-5 z-20 flex items-center gap-1.5 p-1.5 rounded-xl shadow-md canvas-control transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <button
          onClick={() => handleZoom(0.1)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Zoom avant (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Zoom arrière (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className={`text-[10px] font-mono px-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleResetZoom}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Réinitialiser le zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleCenterOnBrutus}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-700/60 hover:bg-slate-700 text-emerald-400'
              : 'bg-slate-50 hover:bg-slate-100 text-emerald-600'
          }`}
          title="Centrer sur BRUTUS"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showGrid
              ? isDark
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-emerald-100 text-emerald-800'
              : isDark
              ? 'bg-slate-700/60 text-slate-500 hover:text-slate-300'
              : 'bg-slate-50 text-slate-400 hover:text-slate-600'
          }`}
          title="Basculer la grille"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Draggable Agent Palette */}
      <AgentPalette
        onAddAgentFromPalette={(item) =>
          onAddAgent(item, { x: 500 + Math.random() * 80, y: 300 + Math.random() * 80 })
        }
      />

      {/* Minimap Widget */}
      <Minimap
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={onSelectNode}
        pan={pan}
        zoom={zoom}
        canvasWidth={dimensions.width}
        canvasHeight={dimensions.height}
        onCenterView={handleCenterOnBrutus}
      />

      {/* World Plane (Transformed) */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '3000px',
          height: '2000px',
        }}
      >
        {/* SVG Bezier Lines Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-violet" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad-orchestrator" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="grad-peer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Render Active Connection Edges */}
          {edges.map((edge) => {
            const pathD = getCurvePath(edge);
            const isConnectedToOrchestrator = edge.from === 'brutus' || edge.to === 'brutus';
            const isBlocked = edge.type === 'blocked' || edge.dashed;
            const fromPos = getNodePortPos(edge.from, edge.fromPort || 'right');
            const toPos = getNodePortPos(edge.to, edge.toPort || 'left');
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={edge.id} className="transition-all duration-300">
                {/* Background Shadow line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={
                    isConnectedToOrchestrator
                      ? isDark ? 'rgba(16, 185, 129, 0.18)' : 'rgba(16, 185, 129, 0.15)'
                      : isDark ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.12)'
                  }
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Main Visible Path (2 Distinct Rope Styles) */}
                {isConnectedToOrchestrator ? (
                  // STYLE 1: Corde Normale Orchestrateur (Ligne continue vive émeraude avec flux de données)
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#grad-orchestrator)"
                    strokeWidth={edge.type === 'active_stream' ? '2.5' : '2'}
                    strokeDasharray={isBlocked ? '6 6' : undefined}
                    strokeOpacity={0.95}
                    filter="url(#glow-emerald)"
                  />
                ) : (
                  // STYLE 2: Corde Inter-Agents (Pointillés indigo/violet stylisés avec flux peer-to-peer)
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#grad-peer)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeOpacity={0.9}
                    filter="url(#glow-violet)"
                  />
                )}

                {/* Animated Particles flowing along the connection */}
                {isConnectedToOrchestrator ? (
                  <>
                    <circle r="4" fill="#10b981" filter="url(#glow-emerald)">
                      <animateMotion
                        dur="2.2s"
                        repeatCount="indefinite"
                        path={pathD}
                        rotate="auto"
                      />
                    </circle>
                    <circle r="3" fill="#34d399" filter="url(#glow-emerald)">
                      <animateMotion
                        dur="2.2s"
                        begin="1.1s"
                        repeatCount="indefinite"
                        path={pathD}
                        rotate="auto"
                      />
                    </circle>
                  </>
                ) : (
                  <circle r="3" fill="#a855f7" filter="url(#glow-violet)">
                    <animateMotion
                      dur="2.5s"
                      repeatCount="indefinite"
                      path={pathD}
                      rotate="auto"
                    />
                  </circle>
                )}

                {/* Interactive Edge Label Pill: CLICK DETACHES/REMOVES THE ROPE */}
                <foreignObject
                  x={midX - 55}
                  y={midY - 13}
                  width="110"
                  height="26"
                  className="overflow-visible pointer-events-auto"
                >
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteEdge) {
                          onDeleteEdge(edge.id);
                        }
                      }}
                      title="Cliquer pour détacher et supprimer cette corde"
                      className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full shadow-md font-bold flex items-center gap-1 cursor-pointer transition-all duration-150 transform hover:scale-105 select-none ${
                        isConnectedToOrchestrator
                          ? isDark
                            ? 'bg-emerald-950/90 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-rose-900 hover:text-rose-200 hover:ring-rose-500'
                            : 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300 hover:bg-rose-100 hover:text-rose-800 hover:ring-rose-400'
                          : isDark
                          ? 'bg-indigo-950/90 text-indigo-300 ring-1 ring-indigo-500/30 hover:bg-rose-900 hover:text-rose-200 hover:ring-rose-500'
                          : 'bg-indigo-100 text-indigo-900 ring-1 ring-indigo-300 hover:bg-rose-100 hover:text-rose-800 hover:ring-rose-400'
                      }`}
                    >
                      <Trash2 className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                      <span>{edge.label || (isConnectedToOrchestrator ? 'CORE SYNC' : 'PEER LINK')}</span>
                    </button>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Live Dragging Cable (When user is pulling a rope from any of the 4 ports) */}
          {connectingSource && (
            <g className="pointer-events-none animate-in fade-in duration-150">
              <path
                d={getLivePullingPath()}
                fill="none"
                stroke={connectingSource.nodeId === 'brutus' ? '#10b981' : '#8b5cf6'}
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeOpacity={0.9}
              />
              <circle
                cx={mouseWorldPos.x}
                cy={mouseWorldPos.y}
                r="5"
                fill={connectingSource.nodeId === 'brutus' ? '#10b981' : '#8b5cf6'}
                className="animate-pulse"
              />
            </g>
          )}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              className="canvas-node pointer-events-auto cursor-grab active:cursor-grabbing"
            >
              <AgentNodeCard
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={onSelectNode}
                onApprove={onApproveNode}
                onPortMouseDown={handlePortMouseDown}
                onPortMouseUp={handlePortMouseUp}
                isConnecting={Boolean(connectingSource)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
