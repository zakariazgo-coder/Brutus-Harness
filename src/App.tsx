import React, { useState, useEffect } from 'react';
import {
  INITIAL_AGENTS,
  INITIAL_EDGES,
  INITIAL_MISSION,
} from './data/initialData';
import { AgentNode, ConnectionEdge, FileChange, MissionData, PaletteItem, MissionItem } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { MissionHeader } from './components/MissionHeader';
import { AgentCanvas } from './components/AgentCanvas';
import { RightInspector } from './components/RightInspector';
import { BottomSummaryBar } from './components/BottomSummaryBar';
import { DiffModal } from './components/DiffModal';
import { CostModal } from './components/CostModal';
import { VpsModal } from './components/VpsModal';
import { NewAgentModal } from './components/NewAgentModal';
import { SettingsModal } from './components/SettingsModal';

import { OverviewView } from './views/OverviewView';
import { MissionsView } from './views/MissionsView';
import { ExecutionsView } from './views/ExecutionsView';
import { FilesView } from './views/FilesView';
import { CostsView } from './views/CostsView';
import { SettingsView } from './views/SettingsView';

import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function DashboardApp() {
  const { isDark } = useTheme();

  // Navigation & View state (Default to 'overview')
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Mission & Nodes state
  const [mission, setMission] = useState<MissionData>(INITIAL_MISSION);
  const [agents, setAgents] = useState<AgentNode[]>(INITIAL_AGENTS);
  const [edges, setEdges] = useState<ConnectionEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('codex');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(INITIAL_MISSION.durationSeconds);

  // Modals state
  const [diffModalOpen, setDiffModalOpen] = useState<boolean>(false);
  const [selectedDiffFile, setSelectedDiffFile] = useState<FileChange | null>(null);
  const [costModalOpen, setCostModalOpen] = useState<boolean>(false);
  const [vpsModalOpen, setVpsModalOpen] = useState<boolean>(false);
  const [newAgentModalOpen, setNewAgentModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  // Toast Notification state
  const [toast, setToast] = useState<{
    id: string;
    type: 'success' | 'info' | 'warn';
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ id: Date.now().toString(), type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Live timer tick
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Periodic random live log stream on active nodes (e.g. Codex) to simulate real activity
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === 'codex' && agent.status === 'working') {
            const newTokens = agent.tokens + Math.floor(Math.random() * 120) + 30;
            const newCost = agent.cost + 0.002;
            return {
              ...agent,
              tokens: newTokens,
              cost: Number(newCost.toFixed(2)),
            };
          }
          return agent;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Selected Node getter
  const selectedNode = agents.find((a) => a.id === selectedNodeId) || agents[0];

  // Handler: Select Node
  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
  };

  // Handler: Move Node on Canvas
  const handleMoveNode = (id: string, newPos: { x: number; y: number }) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, x: newPos.x, y: newPos.y } : a))
    );
  };

  // Handler: Approve Node (e.g. Prime Agent)
  const handleApproveNode = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const timeStr = new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return {
            ...a,
            status: 'working',
            statusLabel: 'En cours',
            isBlocked: false,
            requiresApproval: false,
            progress: 68,
            logs: [
              {
                id: `log-${Date.now()}`,
                timestamp: timeStr,
                level: 'success',
                message: 'Approbation architecte reçue : Signature RSA 4096 autorisée',
                source: 'SecurityGuard',
              },
              ...a.logs,
            ],
            activities: [
              {
                id: `act-${Date.now()}`,
                timestamp: timeStr,
                type: 'approval',
                description: 'Approbation manuelle validée par Alexandre V.',
                status: 'success',
              },
              ...a.activities,
            ],
          };
        }
        return a;
      })
    );

    // Update connection edge from blocked to active
    setEdges((prev) =>
      prev.map((e) =>
        e.to === id
          ? {
              ...e,
              type: 'active_stream',
              label: 'Sécurité validée',
              particleColor: '#10b981',
              dashed: false,
            }
          : e
      )
    );

    showToast('Action de sécurité approuvée pour Prime Worker !', 'success');
  };

  // Handler: Toggle Pause for single node
  const handleToggleNodePause = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'paused' ? 'working' : 'paused';
          const nextLabel = nextStatus === 'paused' ? 'En pause' : 'En cours';
          return {
            ...a,
            status: nextStatus,
            statusLabel: nextLabel,
          };
        }
        return a;
      })
    );
    showToast(`Statut de l'agent mis à jour.`, 'info');
  };

  // Handler: Toggle Mission Pause
  const handleToggleMissionPause = () => {
    setIsPaused((prev) => !prev);
    showToast(isPaused ? 'Mission reprise.' : 'Mission mise en pause.', 'info');
  };

  // Handler: Stop Mission
  const handleStopMission = () => {
    setIsPaused(true);
    showToast('Mission interrompue par l’opérateur.', 'warn');
  };

  // Handler: Send Custom Instruction to Agent
  const handleSendInstruction = (nodeId: string, instruction: string) => {
    const timeStr = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === nodeId) {
          return {
            ...a,
            status: 'working',
            statusLabel: 'En cours',
            currentInstruction: instruction,
            tokens: a.tokens + 1250,
            cost: Number((a.cost + 0.02).toFixed(2)),
            logs: [
              {
                id: `log-${Date.now()}`,
                timestamp: timeStr,
                level: 'info',
                message: `Nouvelle consigne reçue : "${instruction}"`,
                source: 'UserPrompt',
              },
              ...a.logs,
            ],
            activities: [
              {
                id: `act-${Date.now()}`,
                timestamp: timeStr,
                type: 'code',
                description: `Instruction injectée : "${instruction.slice(0, 45)}..."`,
                status: 'success',
              },
              ...a.activities,
            ],
          };
        }
        return a;
      })
    );

    // Update global mission tokens and cost
    setMission((prev) => ({
      ...prev,
      totalTokens: prev.totalTokens + 1250,
      totalCost: Number((prev.totalCost + 0.02).toFixed(2)),
    }));

    showToast(`Instruction transmise à ${selectedNode.shortName}.`, 'success');
  };

  // Handler: Add Agent from Palette or Modal
  const handleAddAgent = (
    paletteItem: PaletteItem | { name: string; role: any; model: string; task: string },
    pos: { x: number; y: number }
  ) => {
    const id = `agent-${Date.now()}`;
    const agentTask = 'task' in paletteItem ? paletteItem.task : paletteItem.description;
    const agentModel = 'defaultModel' in paletteItem ? paletteItem.defaultModel : paletteItem.model;

    const newAgent: AgentNode = {
      id,
      name: paletteItem.name,
      shortName: paletteItem.name.split(' ')[0],
      role: paletteItem.role,
      status: 'working',
      statusLabel: 'En cours',
      task: agentTask || 'Exécution de sous-tâche',
      currentInstruction: `Démarrage de l'agent ${paletteItem.name}...`,
      progress: 15,
      tokens: 4500,
      cost: 0.08,
      contextWindow: '128k',
      model: agentModel || 'Claude 3.5 Sonnet',
      x: pos.x,
      y: pos.y,
      color: 'cyan',
      modifiedFiles: 1,
      testsPassing: { passed: 2, total: 2 },
      branch: 'feat/sub-agent-branch',
      logs: [
        {
          id: `log-init-${id}`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          level: 'info',
          message: `Agent ${paletteItem.name} connecté au graphe BRUTUS`,
          source: 'Orchestrator',
        },
      ],
      activities: [
        {
          id: `act-init-${id}`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'sync',
          description: `Sous-agent instancié avec succès`,
          status: 'success',
        },
      ],
      files: [
        {
          id: `file-init-${id}`,
          path: 'agent-config.ts',
          directory: 'config/',
          status: 'added',
          linesAdded: 24,
          linesRemoved: 0,
          size: '640 o',
        },
      ],
    };

    setAgents((prev) => [...prev, newAgent]);
    // Do NOT automatically create an edge to orchestrator so user can connect manually
    setMission((prev) => ({ ...prev, activeAgentsCount: prev.activeAgentsCount + 1 }));
    setSelectedNodeId(id);

    showToast(`Agent ${newAgent.shortName} ajouté (utilisez les points pour le relier) !`, 'success');
  };

  // Handle delete/detach rope completely
  const handleDeleteEdge = (edgeId: string) => {
    const edgeToDelete = edges.find((e) => e.id === edgeId);
    if (!edgeToDelete) return;
    const targetNode = agents.find((a) => a.id === edgeToDelete.to);
    const sourceNode = agents.find((a) => a.id === edgeToDelete.from);
    const targetName = targetNode?.shortName || targetNode?.name || 'Agent';
    const sourceName = sourceNode?.shortName || sourceNode?.name || 'Agent';

    setEdges((prevEdges) => prevEdges.filter((e) => e.id !== edgeId));
    showToast(`Liaison détachée et supprimée entre ${sourceName} et ${targetName}`, 'warn');
  };

  // Handle creating a new connection rope between 2 agents
  const handleConnectNodes = (
    fromId: string,
    toId: string,
    fromPort?: 'top' | 'right' | 'bottom' | 'left',
    toPort?: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    // Check if already connected
    const exists = edges.some(
      (e) => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );
    if (exists) {
      showToast('Une liaison existe déjà entre ces deux agents.', 'info');
      return;
    }

    const fromNode = agents.find((a) => a.id === fromId);
    const toNode = agents.find((a) => a.id === toId);
    const isOrchestratorConnection = fromId === 'brutus' || toId === 'brutus';

    const newEdge: ConnectionEdge = {
      id: `edge-${Date.now()}`,
      from: fromId,
      to: toId,
      fromPort: fromPort || 'right',
      toPort: toPort || 'left',
      type: isOrchestratorConnection ? 'active_stream' : 'dependency',
      label: isOrchestratorConnection ? 'Flux Brutus' : 'Liaison Directe',
      particleColor: isOrchestratorConnection ? '#10b981' : '#a855f7',
      statusText: isOrchestratorConnection ? 'Orchestration active' : 'Canal Inter-Agents',
    };

    setEdges((prev) => [...prev, newEdge]);
    showToast(
      `Nouvelle corde attachée entre ${fromNode?.shortName || 'Agent'} et ${toNode?.shortName || 'Agent'} !`,
      'success'
    );
  };

  const handleLaunchMission = (newMission: Partial<MissionItem>) => {
    if (newMission.title) {
      setMission((prev) => ({
        ...prev,
        title: newMission.title!,
        progress: 10,
      }));
    }
    showToast(`Nouvelle mission lancée : ${newMission.title}`, 'success');
    setCurrentTab('canvas');
  };

  // Collect all files from all agents for global diff view
  const allModifiedFiles: FileChange[] = agents.flatMap((a) => a.files);

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#f8fafc] text-slate-800'
      }`}
    >
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg font-mono text-xs ${
              isDark
                ? toast.type === 'success'
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30 shadow-emerald-500/10'
                  : toast.type === 'warn'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/30 shadow-amber-500/10'
                  : 'bg-slate-800 text-emerald-300 border border-emerald-500/30 shadow-emerald-500/10'
                : toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-emerald-500/10'
                : toast.type === 'warn'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-amber-500/10'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-emerald-500/10'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {toast.type === 'warn' && <AlertCircle className="w-4 h-4 text-amber-500" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-emerald-500" />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenCosts={() => setCurrentTab('costs')}
        onOpenFiles={() => setCurrentTab('files')}
        onOpenSettings={() => setCurrentTab('settings')}
        onOpenVpsModal={() => setVpsModalOpen(true)}
      />

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* 2. Top Mission Header (always visible with theme toggle button in top right) */}
        <MissionHeader
          mission={mission}
          isPaused={isPaused}
          onTogglePause={handleToggleMissionPause}
          onStopMission={handleStopMission}
          onOpenNewAgent={() => setNewAgentModalOpen(true)}
          onOpenDiff={() => setCurrentTab('files')}
          onOpenMenu={() => setCurrentTab('settings')}
          elapsedSeconds={elapsedSeconds}
        />

        {/* 3. Conditional Page View Rendering based on currentTab */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {currentTab === 'overview' && (
            <OverviewView
              mission={mission}
              agents={agents}
              elapsedSeconds={elapsedSeconds}
              onNavigateToTab={setCurrentTab}
              onSelectAgent={setSelectedNodeId}
              onApproveAgent={handleApproveNode}
              onToggleAgentPause={handleToggleNodePause}
              onOpenNewAgentModal={() => setNewAgentModalOpen(true)}
              onOpenFileDiff={(file) => {
                setSelectedDiffFile(file);
                setCurrentTab('files');
              }}
            />
          )}

          {currentTab === 'missions' && (
            <MissionsView
              currentMission={mission}
              elapsedSeconds={elapsedSeconds}
              onNavigateToTab={setCurrentTab}
              onLaunchMission={handleLaunchMission}
            />
          )}

          {currentTab === 'canvas' && (
            <div className="flex-1 flex h-full min-w-0 overflow-hidden">
              <main className="flex-1 relative overflow-hidden">
                <AgentCanvas
                  nodes={agents}
                  edges={edges}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={handleSelectNode}
                  onApproveNode={handleApproveNode}
                  onAddAgent={handleAddAgent}
                  onMoveNode={handleMoveNode}
                  onDeleteEdge={handleDeleteEdge}
                  onConnectNodes={handleConnectNodes}
                />
              </main>

              {/* Right Inspector Panel in Canvas view */}
              {selectedNode && (
                <RightInspector
                  node={selectedNode}
                  onClose={() => {}}
                  onOpenDiffForFile={(file) => {
                    setSelectedDiffFile(file);
                    setCurrentTab('files');
                  }}
                  onOpenGlobalDiff={() => {
                    setSelectedDiffFile(null);
                    setCurrentTab('files');
                  }}
                  onApproveNode={handleApproveNode}
                  onToggleNodePause={handleToggleNodePause}
                  onSendInstruction={handleSendInstruction}
                />
              )}
            </div>
          )}

          {currentTab === 'executions' && (
            <ExecutionsView
              mission={mission}
              elapsedSeconds={elapsedSeconds}
              onNavigateToTab={setCurrentTab}
              onApproveStep={(_stepId) => {
                handleApproveNode('prime');
                showToast(`Étape approuvée avec succès.`, 'success');
              }}
            />
          )}

          {currentTab === 'files' && (
            <FilesView
              mission={mission}
              agents={agents}
              onNavigateToTab={setCurrentTab}
              onApproveAllChanges={() => {
                showToast('Pull Request créée avec succès sur feat/auth-jwt-system !', 'success');
              }}
            />
          )}

          {currentTab === 'costs' && (
            <CostsView
              mission={mission}
              agents={agents}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              mission={mission}
              onNavigateToTab={setCurrentTab}
            />
          )}
        </div>

        {/* 5. Bottom Summary Bar */}
        <BottomSummaryBar
          mission={mission}
          elapsedSeconds={elapsedSeconds}
          onOpenCosts={() => setCurrentTab('costs')}
          onOpenDiff={() => setCurrentTab('files')}
          onOpenVpsModal={() => setVpsModalOpen(true)}
        />
      </div>

      {/* Modals for quick overlay actions */}
      {diffModalOpen && (
        <DiffModal
          files={allModifiedFiles}
          selectedFile={selectedDiffFile}
          onClose={() => setDiffModalOpen(false)}
          onApproveDiff={() => {
            showToast('Changements git validés avec succès !', 'success');
          }}
        />
      )}

      {costModalOpen && (
        <CostModal
          mission={mission}
          agents={agents}
          onClose={() => setCostModalOpen(false)}
        />
      )}

      {vpsModalOpen && (
        <VpsModal
          mission={mission}
          onClose={() => setVpsModalOpen(false)}
        />
      )}

      {newAgentModalOpen && (
        <NewAgentModal
          onClose={() => setNewAgentModalOpen(false)}
          onDeployAgent={(data) => {
            handleAddAgent(data, {
              x: 500 + (Math.random() * 120 - 60),
              y: 320 + (Math.random() * 120 - 60),
            });
          }}
        />
      )}

      {settingsModalOpen && (
        <SettingsModal onClose={() => setSettingsModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardApp />
    </ThemeProvider>
  );
}
