import React, { useState } from 'react';
import {
  KeyRound,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Tag
} from 'lucide-react';
import { GitHubRepo, GitHubUser } from '../types/github';

interface NavbarProps {
  repo: GitHubRepo | null;
  repoOwner: string;
  repoName: string;
  onChangeRepo: (newRepo: string) => void;
  user: GitHubUser | null;
  hasToken: boolean;
  onOpenTokenModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isRepoCollapsed?: boolean;
  onToggleCollapseRepo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  repo,
  repoOwner,
  repoName,
  onChangeRepo,
  user,
  hasToken,
  onOpenTokenModal,
  onRefresh,
  isRefreshing,
  isRepoCollapsed = false,
  onToggleCollapseRepo,
}) => {
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const availableRepos = [
    'OfertasProgramacionIII',
    'ProgramacionIII',
  ];

  const handleSelect = (r: string) => {
    onChangeRepo(r);
    setShowRepoSelector(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onChangeRepo(customInput.trim());
      setCustomInput('');
      setShowRepoSelector(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Tag className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
                Cazador de Descuentos
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Online & Delivery
              </span>
            </div>

            {/* Repo info link / Switcher */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Repo:</span>
              <button
                onClick={() => setShowRepoSelector(!showRepoSelector)}
                className="font-mono text-slate-300 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                title="Cambiar repositorio activo"
              >
                <span>{repoOwner}/{repoName}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
            </div>

            {/* Dropdown Menu for repo switcher */}
            {showRepoSelector && (
              <div className="absolute left-4 top-16 mt-1 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Repositorios en GitHub:
                </p>
                <div className="space-y-1">
                  {availableRepos.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleSelect(r)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between font-mono transition-all ${
                        repoName === r
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{r}</span>
                      {repoName === r && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 block px-1">Otro repositorio:</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Nombre del repositorio..."
                      className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Ir
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Collapse/Expand Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Collapse / Expand Repo Bar Button */}
          {onToggleCollapseRepo && (
            <button
              onClick={onToggleCollapseRepo}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isRepoCollapsed
                  ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={
                isRepoCollapsed
                  ? 'Mostrar panel del repositorio GitHub y herramientas'
                  : 'Contraer panel del repositorio para ver solo la app web'
              }
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isRepoCollapsed ? 'Mostrar Panel Repo' : 'Contraer Panel Repo'}
              </span>
              {isRepoCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Recargar datos de GitHub"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <a
            href={`https://github.com/${repoOwner}/${repoName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-lg transition-all"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Token Status / Connect Button */}
          <button
            onClick={onOpenTokenModal}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              hasToken
                ? 'bg-slate-800/90 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60 shadow-sm'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-md shadow-indigo-600/30'
            }`}
          >
            {hasToken ? (
              <>
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-4 h-4 rounded-full border border-emerald-400"
                  />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="hidden sm:inline">Token Conectado</span>
                <span className="sm:hidden">Token OK</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">Conectar GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
