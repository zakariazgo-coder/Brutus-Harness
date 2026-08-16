import React, { useState } from 'react';
import { X, Settings, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const [autoApproval, setAutoApproval] = useState(false);
  const [maxConcurrency, setMaxConcurrency] = useState(8);
  const [telemetryStream, setTelemetryStream] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden font-mono transition-colors ${
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
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Paramètres BRUTUS Control Room
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Configuration de l'instance locale et des sécurités
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${
            isDark ? 'bg-slate-900/60' : 'bg-slate-50'
          }`}>
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Garde-fous de sécurité humaine (HITL)</p>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Interrompre les agents lors d'opérations sensibles
              </p>
            </div>
            <input
              type="checkbox"
              checked={!autoApproval}
              onChange={() => setAutoApproval(!autoApproval)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${
            isDark ? 'bg-slate-900/60' : 'bg-slate-50'
          }`}>
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Télémétrie en temps réel & WebSockets</p>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Streamer les logs et particules sans mise en mémoire tampon
              </p>
            </div>
            <input
              type="checkbox"
              checked={telemetryStream}
              onChange={() => setTelemetryStream(!telemetryStream)}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className={`p-3.5 rounded-xl space-y-2 transition-colors ${
            isDark ? 'bg-slate-900/60' : 'bg-slate-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Agents simultanés max</span>
              <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{maxConcurrency} agents</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              value={maxConcurrency}
              onChange={(e) => setMaxConcurrency(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono cursor-pointer transition-colors shadow-xs"
            >
              {saved ? <Check className="w-4 h-4 stroke-[3]" /> : null}
              <span>{saved ? 'Enregistré !' : 'Enregistrer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
