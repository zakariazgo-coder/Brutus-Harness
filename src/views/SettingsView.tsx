import React, { useState } from 'react';
import { MissionData } from '../types';
import {
  Shield,
  Key,
  Server,
  GitBranch,
  Save,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsViewProps {
  mission: MissionData;
  onNavigateToTab: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<'security' | 'models' | 'vps' | 'git'>('security');
  const [isSaved, setIsSaved] = useState(false);

  // Security Toggles
  const [requireSecretApproval, setRequireSecretApproval] = useState(true);
  const [requireShellApproval, setRequireShellApproval] = useState(true);
  const [requirePkgApproval, setRequirePkgApproval] = useState(false);
  const [dockerIsolation, setDockerIsolation] = useState(true);

  // LLM Config
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-api03-••••••••••••••••••••••••');
  const [openaiKey, setOpenaiKey] = useState('sk-proj-••••••••••••••••••••••••');
  const [localOllamaUrl, setLocalOllamaUrl] = useState('http://127.0.0.1:11434/v1');
  const [defaultModel, setDefaultModel] = useState('Claude 3.7 Sonnet');

  // VPS & Git
  const [vpsHost, setVpsHost] = useState('vps-hetzner-fsn1.brutus.internal');
  const [gitRepo, setGitRepo] = useState('git@github.com:brutus-org/core-saas-platform.git');
  const [autoBranchPrefix, setAutoBranchPrefix] = useState('feat/');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* 1. Header Banner */}
      <div className={`rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="space-y-1.5 max-w-3xl">
          <div className={`flex items-center gap-2.5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
              isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              CONFIGURATION SYSTÈME
            </span>
            <span>•</span>
            <span className="font-semibold">v3.1.0-prod</span>
          </div>
          <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Réglages & Environnement
          </h1>
          <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Paramètres de sécurité Human-in-the-loop, passerelles LLM, infrastructure VPS Docker et CI/CD.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs"
          >
            {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Enregistré !' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 font-mono">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5">
          <button
            onClick={() => setActiveSection('security')}
            className={`w-full text-left p-3 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'security'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-xs ring-1 ring-emerald-500/50'
                  : 'bg-white text-slate-900 font-bold shadow-xs ring-1 ring-emerald-500/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Sécurité & HITL</span>
          </button>

          <button
            onClick={() => setActiveSection('models')}
            className={`w-full text-left p-3 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'models'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-xs ring-1 ring-emerald-500/50'
                  : 'bg-white text-slate-900 font-bold shadow-xs ring-1 ring-emerald-500/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-500" />
            <span>Modèles LLM & Clés</span>
          </button>

          <button
            onClick={() => setActiveSection('vps')}
            className={`w-full text-left p-3 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'vps'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-xs ring-1 ring-emerald-500/50'
                  : 'bg-white text-slate-900 font-bold shadow-xs ring-1 ring-emerald-500/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Server className="w-4 h-4 text-teal-500" />
            <span>Serveur VPS & Docker</span>
          </button>

          <button
            onClick={() => setActiveSection('git')}
            className={`w-full text-left p-3 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
              activeSection === 'git'
                ? isDark
                  ? 'bg-slate-800 text-white font-bold shadow-xs ring-1 ring-emerald-500/50'
                  : 'bg-white text-slate-900 font-bold shadow-xs ring-1 ring-emerald-500/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <GitBranch className="w-4 h-4 text-purple-500" />
            <span>Dépôt Git & CI/CD</span>
          </button>
        </div>

        {/* Section Content */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className={`p-6 rounded-2xl space-y-6 shadow-sm transition-colors ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* 1. Security & HITL */}
            {activeSection === 'security' && (
              <div className="space-y-4">
                <div>
                  <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>Garde-fous de Sécurité & Validation Humaine (HITL)</span>
                  </h2>
                  <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Définissez les actions sensibles qui bloquent l'exécution d'un agent jusqu'à validation manuelle.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <label className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'bg-slate-900/60 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Écriture de Clés Privées & Secrets (.env)</p>
                      <p className={`text-[10px] font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Intercepte la génération de certificats RSA, clés d'API et variables d'environnement.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={requireSecretApproval}
                      onChange={(e) => setRequireSecretApproval(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </label>

                  <label className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'bg-slate-900/60 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Commandes Shell Destructives</p>
                      <p className={`text-[10px] font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Demande confirmation pour <code>rm -rf</code>, suppressions de base SQL et migrations irréversibles.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={requireShellApproval}
                      onChange={(e) => setRequireShellApproval(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </label>

                  <label className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'bg-slate-900/60 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Installation de Nouvelles Dépendances NPM / PIP</p>
                      <p className={`text-[10px] font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Alerte l'opérateur avant d'ajouter un nouveau paquet dans le <code>package.json</code>.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={requirePkgApproval}
                      onChange={(e) => setRequirePkgApproval(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </label>

                  <label className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'bg-slate-900/60 hover:bg-slate-900' : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Isolation Stricte en Conteneur Docker Sandbox</p>
                      <p className={`text-[10px] font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Exécute chaque agent dans un container éphémère sans accès root à l'hôte VPS.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={dockerIsolation}
                      onChange={(e) => setDockerIsolation(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 2. LLM Models */}
            {activeSection === 'models' && (
              <div className="space-y-4">
                <div>
                  <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Key className="w-4 h-4 text-emerald-500" />
                    <span>Fournisseurs de Modèles d'IA & Endpoints</span>
                  </h2>
                  <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Configurez vos clés API ou les endpoints locaux (Ollama / vLLM) auto-hébergés.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Anthropic API Key (Claude 3.7 Sonnet / Opus)
                    </label>
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      OpenAI API Key (GPT-4o / Codex)
                    </label>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Endpoint LLM Local vLLM / Ollama (VPS)
                    </label>
                    <input
                      type="text"
                      value={localOllamaUrl}
                      onChange={(e) => setLocalOllamaUrl(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Modèle Planificateur par Défaut
                    </label>
                    <select
                      value={defaultModel}
                      onChange={(e) => setDefaultModel(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-medium ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    >
                      <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet (Recommandé)</option>
                      <option value="Codex-Pro-Edit">Codex-Pro-Edit (OpenAI)</option>
                      <option value="Prime-Worker-Local (Ollama)">Prime-Worker-Local (Ollama llama3.3)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. VPS & Docker */}
            {activeSection === 'vps' && (
              <div className="space-y-4">
                <div>
                  <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Server className="w-4 h-4 text-teal-500" />
                    <span>Nœud d'Exécution VPS & Daemon Docker</span>
                  </h2>
                  <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Spécifications de la machine hôte où s'exécutent les conteneurs BRUTUS.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Nom d'hôte VPS (Interne)
                    </label>
                    <input
                      type="text"
                      value={vpsHost}
                      onChange={(e) => setVpsHost(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className={`p-4 rounded-xl space-y-2 ${isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>État du cluster Docker</span>
                      <span className={`font-bold text-xs flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Opérationnel
                      </span>
                    </div>
                    <p className={`text-[11px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      6 conteneurs sandbox actifs • vCPU : 24% • RAM : 4,2 Go / 16 Go
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Git & CI/CD */}
            {activeSection === 'git' && (
              <div className="space-y-4">
                <div>
                  <h2 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <GitBranch className="w-4 h-4 text-purple-500" />
                    <span>Intégration Git & Dépôt Source</span>
                  </h2>
                  <p className={`text-xs font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Synchronisation automatique des commits, des branches et des webhooks de PR.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      URL du Dépôt Git (SSH ou HTTPS)
                    </label>
                    <input
                      type="text"
                      value={gitRepo}
                      onChange={(e) => setGitRepo(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block uppercase text-[10px] mb-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Préfixe des Branches Automatiques
                    </label>
                    <input
                      type="text"
                      value={autoBranchPrefix}
                      onChange={(e) => setAutoBranchPrefix(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono ${
                        isDark
                          ? 'bg-slate-900 text-slate-100'
                          : 'bg-slate-50 focus:bg-slate-100 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
              >
                Appliquer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
