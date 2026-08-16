import React, { useState } from 'react';
import { AgentRole } from '../types';
import { X, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NewAgentModalProps {
  onClose: () => void;
  onDeployAgent: (agentData: {
    name: string;
    role: AgentRole;
    model: string;
    task: string;
  }) => void;
}

export const NewAgentModal: React.FC<NewAgentModalProps> = ({ onClose, onDeployAgent }) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [role, setRole] = useState<AgentRole>('builder');
  const [model, setModel] = useState('Claude 3.7 Sonnet');
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !task.trim()) return;
    onDeployAgent({
      name: name.trim(),
      role,
      model,
      task: task.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden font-mono transition-colors ${
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
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Déployer un Nouvel Agent
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instancier un sous-agent dans le graphe d'orchestration
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className={`block uppercase text-[10px] mb-1 font-semibold font-mono ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Nom de l'agent
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Doc Generator, Rust Optimizer..."
              className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                isDark
                  ? 'bg-slate-900 text-slate-100 placeholder:text-slate-500'
                  : 'bg-slate-50 focus:bg-slate-100 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block uppercase text-[10px] mb-1 font-semibold font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Rôle fonctionnel
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AgentRole)}
                className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium ${
                  isDark
                    ? 'bg-slate-900 text-slate-100'
                    : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                }`}
              >
                <option value="builder">Builder (Codage backend/frontend)</option>
                <option value="planner">Planner (Architecture & RFC)</option>
                <option value="worker">Worker (Tâches système)</option>
                <option value="qa">QA (Tests & Playwright)</option>
                <option value="researcher">Researcher (Documentation)</option>
                <option value="coordinator">Coordinator (Webhooks & CI)</option>
              </select>
            </div>

            <div>
              <label className={`block uppercase text-[10px] mb-1 font-semibold font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Modèle LLM cible
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium ${
                  isDark
                    ? 'bg-slate-900 text-slate-100'
                    : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                }`}
              >
                <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                <option value="GPT-4o Codex">GPT-4o Codex</option>
                <option value="DeepSeek-V3 (Local)">DeepSeek-V3 Coder (Local)</option>
                <option value="Claude 3.5 Haiku">Claude 3.5 Haiku (Rapide)</option>
                <option value="Gemini 2.0 Flash">Gemini 2.0 Flash</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block uppercase text-[10px] mb-1 font-semibold font-mono ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Mission & Consigne initiale
            </label>
            <textarea
              required
              rows={3}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="ex: Générer la documentation technique OpenAPI et valider les routes d'authentification..."
              className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                isDark
                  ? 'bg-slate-900 text-slate-100 placeholder:text-slate-500'
                  : 'bg-slate-50 focus:bg-slate-100 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
            >
              Connecter l'agent au graphe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
