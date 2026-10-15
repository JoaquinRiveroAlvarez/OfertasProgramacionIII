import React, { useState } from 'react';
import {
  GitBranch,
  Copy,
  Check,
  PlusCircle,
  UploadCloud,
  FolderGit2,
  ExternalLink,
  CircleDot,
  Terminal,
  Sparkles,
  ChevronUp,
  Tag
} from 'lucide-react';
import { GitHubRepo } from '../types/github';

interface RepoHeaderProps {
  repo: GitHubRepo | null;
  repoOwner: string;
  repoName: string;
  issuesCount: number;
  commitsCount: number;
  hasToken: boolean;
  onOpenCreateIssue: () => void;
  onOpenTokenModal: () => void;
  onOpenCliGuide: () => void;
  activeTab: 'preview-feed' | 'preview-api' | 'mvp-issues' | 'solution' | 'issues' | 'sync' | 'commits';
  setActiveTab: (tab: 'preview-feed' | 'preview-api' | 'mvp-issues' | 'solution' | 'issues' | 'sync' | 'commits') => void;
  isEmptyRepo: boolean;
  onToggleCollapse?: () => void;
}

export const RepoHeader: React.FC<RepoHeaderProps> = ({
  repo,
  repoOwner,
  repoName,
  issuesCount,
  commitsCount,
  hasToken,
  onOpenCreateIssue,
  onOpenTokenModal,
  onOpenCliGuide,
  activeTab,
  setActiveTab,
  isEmptyRepo,
  onToggleCollapse,
}) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const cloneUrl = `https://github.com/${repoOwner}/${repoName}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneUrl);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Empty repo alert / Welcome notice */}
      {isEmptyRepo && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  ¡Repositorio listo para sincronizar!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  El repositorio <span className="text-indigo-300 font-mono">{repoName}</span> está conectado.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => setActiveTab('sync')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Inicializar Repositorio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main repository banner card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                Repositorio en GitHub
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Público
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                Branch: <strong className="text-slate-200 font-mono">main</strong>
              </span>

              {/* Collapse trigger right in the metadata row */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ml-auto sm:ml-0"
                  title="Ocultar este panel del repositorio para ver solo la app web"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Contraer este panel</span>
                </button>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{repoOwner}</span>
                <span className="text-slate-600">/</span>
                <span className="text-indigo-400">{repoName}</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Espacio de desarrollo, gestión de issues en GitHub y backend C# / MySQL para la app Cazador de Descuentos.
              </p>
            </div>

            {/* Git Clone Bar */}
            <div className="flex items-center gap-2 pt-1 max-w-xl">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto select-all">
                <span className="text-slate-500 select-none">$</span>
                <span className="truncate">git clone {cloneUrl}</span>
              </div>
              <button
                onClick={handleCopyClone}
                title="Copiar comando git clone"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedClone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all shadow-sm"
              >
                <ChevronUp className="w-4 h-4 text-slate-400" />
                <span>Ocultar Panel de Repositorio</span>
              </button>
            )}

            <button
              onClick={onOpenCreateIssue}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Crear Nueva Issue</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCliGuide}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Comandos Git CLI</span>
              </button>

              <a
                href={`https://github.com/${repoOwner}/${repoName}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2 bg-slate-800/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 rounded-xl transition-colors"
                title="Ver issues en GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('preview-feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview-feed'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                : 'text-emerald-300 hover:text-white hover:bg-slate-800/80 bg-emerald-950/30 border border-emerald-500/30'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>🏷️ Cazador de Descuentos (App Online)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview-api')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'preview-api'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-300 hover:text-white hover:bg-slate-800/80 bg-indigo-950/30 border border-indigo-500/20'
            }`}
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>💻 Swagger / API</span>
          </button>

          <button
            onClick={() => setActiveTab('mvp-issues')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'mvp-issues'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <CircleDot className="w-4 h-4 text-amber-400" />
            <span>📋 Issues en GitHub ({issuesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('solution')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'solution'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span>🛠️ Solución C# + MySQL</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'sync'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Subir Código / Commit</span>
          </button>

          <button
            onClick={() => setActiveTab('commits')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'commits'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Commits ({commitsCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
