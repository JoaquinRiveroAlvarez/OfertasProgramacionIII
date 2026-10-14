import React from 'react';
import { GitCommit, ExternalLink, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { GitHubCommit } from '../types/github';

interface CommitsListProps {
  commits: GitHubCommit[];
  isLoading: boolean;
  onOpenSyncTab: () => void;
  isEmptyRepo: boolean;
}

export const CommitsList: React.FC<CommitsListProps> = ({
  commits,
  isLoading,
  onOpenSyncTab,
  isEmptyRepo,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-400" />
            <span>Historial de Commits en GitHub</span>
          </h3>
          <p className="text-xs text-slate-400">
            Rama principal: <span className="text-indigo-400 font-mono">main</span>
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Cargando commits...</p>
        </div>
      ) : commits.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <GitCommit className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Todavía no hay commits en el repositorio</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            El repositorio fue creado recién y está vacío. Podés subir el primer archivo desde la pestaña "Subir Código / Sincronizar".
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenSyncTab}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              Hacer el Primer Commit Ahora
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {commits.map((c) => (
            <div
              key={c.sha}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                  <GitCommit className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {c.commit.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      {c.author?.avatar_url && (
                        <img
                          src={c.author.avatar_url}
                          alt=""
                          className="w-3.5 h-3.5 rounded-full"
                        />
                      )}
                      <span>{c.author?.login || c.commit.author.name}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                      sha: {c.sha.slice(0, 7)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatDate(c.commit.author.date)}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                title="Ver commit en GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
