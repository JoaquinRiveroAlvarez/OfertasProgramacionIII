import React, { useState } from 'react';
import {
  KeyRound,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  GitBranch,
  ChevronDown,
  FolderGit2
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
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Repo Info with Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>

          <div className="relative">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-100 text-sm tracking-wide">
                {repoOwner}
              </span>
              <span className="text-slate-500 text-xs">/</span>

              {/* Repo Selector Dropdown trigger */}
              <button
                onClick={() => setShowRepoSelector(!showRepoSelector)}
                className="flex items-center gap-1.5 font-bold text-white text-base hover:text-indigo-400 bg-slate-800/60 hover:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700/60 transition-all"
                title="Cambiar repositorio"
              >
                <span>{repoName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-1">
                Público
              </span>
            </div>

            <p className="text-xs text-slate-400 hidden sm:block">
              Gestor de Issues y Sincronizador de Repositorio
            </p>

            {/* Dropdown Menu */}
            {showRepoSelector && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Tus Repositorios en GitHub:
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

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-lg transition-all"
          >
            <span>Ver en GitHub</span>
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
                <span>Token Conectado ({user?.login || 'Activo'})</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Conectar Token de GitHub</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
