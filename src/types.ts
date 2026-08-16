export type AgentStatus = 'working' | 'complete' | 'waiting' | 'blocked' | 'idle' | 'paused' | 'error';

export type AgentRole = 
  | 'orchestrator'
  | 'planner'
  | 'builder'
  | 'worker'
  | 'coordinator'
  | 'qa'
  | 'researcher';

export interface LogMessage {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'debug';
  message: string;
  command?: string;
  source?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'code' | 'test' | 'approval' | 'dependency' | 'error' | 'sync' | 'warning';
  description: string;
  file?: string;
  status: 'success' | 'pending' | 'warning' | 'error';
}

export interface FileChange {
  id: string;
  path: string;
  directory: string;
  status: 'modified' | 'added' | 'deleted';
  linesAdded: number;
  linesRemoved: number;
  size: string;
  diffCode?: {
    original: string;
    modified: string;
  };
}

export interface AgentNode {
  id: string;
  name: string;
  shortName: string;
  role: AgentRole;
  status: AgentStatus;
  statusLabel: string;
  task: string;
  currentInstruction: string;
  progress: number;
  tokens: number;
  cost: number;
  contextWindow: string;
  model: string;
  x: number;
  y: number;
  color: 'cyan' | 'violet' | 'amber' | 'emerald' | 'blue' | 'rose';
  modifiedFiles: number;
  testsPassing: { passed: number; total: number };
  isBlocked?: boolean;
  requiresApproval?: boolean;
  blockReason?: string;
  branch?: string;
  logs: LogMessage[];
  activities: ActivityItem[];
  files: FileChange[];
}

export interface ConnectionEdge {
  id: string;
  from: string;
  to: string;
  type: 'active_stream' | 'dependency' | 'completed' | 'blocked' | 'idle';
  label?: string;
  particleColor?: string;
  dashed?: boolean;
  statusText?: string;
  fromPort?: 'top' | 'right' | 'bottom' | 'left';
  toPort?: 'top' | 'right' | 'bottom' | 'left';
}

export interface MissionData {
  id: string;
  title: string;
  badge: string;
  progress: number;
  durationSeconds: number;
  activeAgentsCount: number;
  totalCost: number;
  totalTokens: number;
  modifiedFilesCount: number;
  testsSummary: { passed: number; total: number };
  systemHealth: 'Stable' | 'Surveillance' | 'Critique';
  vps: {
    host: string;
    uptime: string;
    cpuUsage: string;
    ramUsage: string;
    dockerStatus: string;
    gpuStatus: string;
  };
}

export interface PaletteItem {
  id: string;
  name: string;
  role: AgentRole;
  defaultModel: string;
  description: string;
  color: 'cyan' | 'violet' | 'amber' | 'emerald' | 'blue' | 'rose';
  icon: string;
}

export interface MissionItem {
  id: string;
  title: string;
  description: string;
  status: 'in_progress' | 'completed' | 'queued' | 'failed';
  statusLabel: string;
  progress: number;
  priority: 'CRITIQUE' | 'HAUTE' | 'MOYENNE' | 'BASSE';
  assignedAgents: string[];
  branch: string;
  createdAt: string;
  completedAt?: string;
  duration: string;
  tokens: number;
  cost: number;
  filesModified: number;
  testsPassing: { passed: number; total: number };
  milestones: {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending';
  }[];
}

export interface ExecutionStep {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: AgentRole;
  model: string;
  taskTitle: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'blocked';
  startTime: string;
  duration: string;
  tokens: number;
  cost: number;
  outputSummary: string;
  logs: LogMessage[];
  filesTouched: string[];
}
