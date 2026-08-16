import React, { useState } from 'react';
import { MissionData, MissionItem } from '../types';
import { INITIAL_MISSIONS_LIST } from '../data/initialData';
import {
  Compass,
  Plus,
  Clock,
  Coins,
  Layers,
  FileCode2,
  GitBranch,
  Search,
  Check,
  Activity,
  X,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MissionsViewProps {
  currentMission: MissionData;
  elapsedSeconds: number;
  onNavigateToTab: (tab: string) => void;
  onLaunchMission: (newMission: Partial<MissionItem>) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  onNavigateToTab,
  onLaunchMission,
}) => {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingMission, setIsCreatingMission] = useState(false);

  // New Mission form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBranch, setNewBranch] = useState('feat/new-subsystem');
  const [newPriority, setNewPriority] = useState<'CRITIQUE' | 'HAUTE' | 'MOYENNE' | 'BASSE'>('HAUTE');

  const [missionsList, setMissionsList] = useState(INITIAL_MISSIONS_LIST);

  const filteredMissions = missionsList.filter((m) => {
    if (filter === 'in_progress' && m.status !== 'in_progress') return false;
    if (filter === 'completed' && m.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.branch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const created: MissionItem = {
      id: `mission-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: 'in_progress',
      statusLabel: 'En cours',
      progress: 5,
      priority: newPriority,
      assignedAgents: ['BRUTUS', 'Claude Planner', 'Codex Builder'],
      branch: newBranch,
      createdAt: 'À l’instant',
      duration: '1 min',
      tokens: 15000,
      cost: 0.12,
      filesModified: 1,
      testsPassing: { passed: 0, total: 2 },
      milestones: [
        { id: 'nm-1', label: 'Analyse préliminaire des besoins & RFC', status: 'current' },
        { id: 'nm-2', label: 'Architecture & Découpage en sous-agents', status: 'pending' },
        { id: 'nm-3', label: 'Génération de code & Tests unitaires', status: 'pending' },
      ],
    };

    setMissionsList([created, ...missionsList]);
    onLaunchMission(created);
    setIsCreatingMission(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. Header Banner (No borders) */}
      <div
        className={`rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div className="space-y-1.5 max-w-3xl">
          <div className={`flex items-center gap-2.5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              PIPELINE DES MISSIONS
            </span>
            <span>•</span>
            <span className="font-semibold">{missionsList.length} missions au total</span>
          </div>
          <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Gestionnaire de Missions
          </h1>
          <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pilotez, planifiez et auditez les missions de développement confiées aux agents autonomes.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setIsCreatingMission(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nouvelle Mission</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar (No borders) */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl font-mono text-xs shadow-sm transition-colors ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
              filter === 'all'
                ? isDark
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-900 text-white font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Toutes ({missionsList.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              filter === 'in_progress'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'bg-emerald-100 text-emerald-800 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>En cours ({missionsList.filter((m) => m.status === 'in_progress').length})</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              filter === 'completed'
                ? isDark
                  ? 'bg-teal-500/20 text-teal-300 font-bold'
                  : 'bg-teal-100 text-teal-800 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Terminées ({missionsList.filter((m) => m.status === 'completed').length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une mission..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-mono outline-none transition-colors ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 text-slate-100 placeholder:text-slate-500'
                : 'bg-slate-50 hover:bg-slate-100 focus:bg-slate-100 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* 3. Missions List (No borders) */}
      <div className="space-y-4">
        {filteredMissions.map((m) => {
          const isInProgress = m.status === 'in_progress';

          return (
            <div
              key={m.id}
              className={`rounded-2xl p-6 space-y-4 hover:shadow-md transition-all shadow-sm ${
                isDark ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-4xl">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold ${
                        isInProgress
                          ? isDark
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-800'
                          : isDark
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {isInProgress ? 'EN COURS' : 'TERMINÉE'}
                    </span>
                    <span className="text-slate-400 font-bold">#{m.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        m.priority === 'CRITIQUE'
                          ? isDark
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-rose-100 text-rose-700'
                          : m.priority === 'HAUTE'
                          ? isDark
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-amber-100 text-amber-800'
                          : isDark
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.priority}
                    </span>
                  </div>

                  <h2 className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {m.title}
                  </h2>
                  <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {m.description}
                  </p>
                </div>

                {/* Action button */}
                <div className="shrink-0">
                  {isInProgress ? (
                    <button
                      onClick={() => onNavigateToTab('canvas')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Ouvrir Canvas</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateToTab('executions')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer font-medium ${
                        isDark
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>Logs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Progression globale
                  </span>
                  <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.progress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <div
                    className={`h-full rounded-full transition-all ${
                      m.progress === 100 ? 'bg-teal-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Steps */}
              <div className={`p-3.5 rounded-xl space-y-2 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                <span className={`text-[10px] uppercase font-mono font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Jalons d'exécution
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs">
                  {m.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                        milestone.status === 'completed'
                          ? isDark
                            ? 'bg-slate-800 text-teal-300 shadow-2xs font-medium'
                            : 'bg-white text-teal-800 shadow-2xs font-medium'
                          : milestone.status === 'current'
                          ? isDark
                            ? 'bg-slate-800 text-emerald-300 shadow-2xs font-bold ring-1 ring-emerald-500/30'
                            : 'bg-white text-emerald-800 shadow-2xs font-bold ring-1 ring-emerald-500/20'
                          : isDark
                          ? 'bg-transparent text-slate-500'
                          : 'bg-transparent text-slate-400'
                      }`}
                    >
                      {milestone.status === 'completed' ? (
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 stroke-[3]" />
                      ) : milestone.status === 'current' ? (
                        <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                      )}
                      <span className="truncate text-[11px]">{milestone.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Metadata stats */}
              <div className={`flex flex-wrap items-center justify-between gap-4 pt-3 text-xs font-mono px-3.5 py-2.5 rounded-xl ${
                isDark ? 'bg-slate-900/60 text-slate-400' : 'bg-slate-50 text-slate-500'
              }`}>
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`flex items-center gap-1.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{m.branch}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.duration}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    <Coins className="w-3.5 h-3.5 text-emerald-500" />
                    <span>€{m.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.filesModified} fichiers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{m.testsPassing.passed}/{m.testsPassing.total} tests</span>
                  </div>
                </div>

                <div className="text-slate-400 text-[11px]">
                  Créé : {m.createdAt}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Mission Creation Modal (No borders) */}
      {isCreatingMission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden font-mono transition-colors ${
            isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'
          }`}>
            <div className={`px-6 py-4 flex items-center justify-between transition-colors ${
              isDark ? 'bg-slate-800/90' : 'bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                  <Compass className="w-4 h-4 text-emerald-500" />
                </div>
                <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Lancer une Nouvelle Mission</h2>
              </div>
              <button
                onClick={() => setIsCreatingMission(false)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Titre de la mission
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Implémenter le système de permissions RBAC"
                  className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-colors ${
                    isDark
                      ? 'bg-slate-900 text-slate-100 placeholder:text-slate-500'
                      : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-slate-100'
                  }`}
                />
              </div>

              <div>
                <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Description & Objectif technique
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="ex: Créer les tables SQL, générer les guards NestJS et tester avec Jest..."
                  className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-colors ${
                    isDark
                      ? 'bg-slate-900 text-slate-100 placeholder:text-slate-500'
                      : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-slate-100'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Branche Git cible
                  </label>
                  <input
                    type="text"
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-colors ${
                      isDark
                        ? 'bg-slate-900 text-slate-100'
                        : 'bg-slate-50 text-slate-900 focus:bg-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Priorité
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-medium transition-colors ${
                      isDark
                        ? 'bg-slate-900 text-slate-100'
                        : 'bg-slate-50 text-slate-900 focus:bg-slate-100'
                    }`}
                  >
                    <option value="CRITIQUE">CRITIQUE</option>
                    <option value="HAUTE">HAUTE</option>
                    <option value="MOYENNE">MOYENNE</option>
                    <option value="BASSE">BASSE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingMission(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Démarrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
