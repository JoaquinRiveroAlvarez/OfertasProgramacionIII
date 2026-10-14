import React, { useState } from 'react';
import {
  CircleDot,
  CheckCircle2,
  Search,
  Tag,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { GitHubIssue } from '../types/github';
import { PROGRAMACION_III_TEMPLATES } from '../data/issueTemplates';
import { createIssue } from '../services/githubApi';

interface IssuesListProps {
  repoOwner: string;
  repoName: string;
  issues: GitHubIssue[];
  isLoading: boolean;
  onSelectIssue: (issue: GitHubIssue) => void;
  onOpenCreateModal: () => void;
  token: string;
  onBatchCreated: (newIssues: GitHubIssue[]) => void;
  onOpenTokenModal: () => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({
  repoOwner,
  repoName,
  issues,
  isLoading,
  onSelectIssue,
  onOpenCreateModal,
  token,
  onBatchCreated,
  onOpenTokenModal,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabelFilter, setSelectedLabelFilter] = useState<string>('all');
  const [isBatchCreating, setIsBatchCreating] = useState(false);

  // Extract all unique labels
  const allLabels = Array.from(
    new Set(
      issues.flatMap((i) =>
        i.labels.map((l) => (typeof l === 'string' ? l : l.name))
      )
    )
  );

  const filteredIssues = issues.filter((issue) => {
    if (filterState !== 'all' && issue.state !== filterState) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchBody = issue.body?.toLowerCase().includes(q) || false;
      const matchNum = `#${issue.number}`.includes(q);
      if (!matchTitle && !matchBody && !matchNum) return false;
    }

    if (selectedLabelFilter !== 'all') {
      const hasLabel = issue.labels.some((l) =>
        (typeof l === 'string' ? l : l.name) === selectedLabelFilter
      );
      if (!hasLabel) return false;
    }

    return true;
  });

  const handleCreateRecommendedIssues = async () => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setIsBatchCreating(true);
    const createdList: GitHubIssue[] = [];

    try {
      // Create TP1, TP2, and Setup Inicial
      const templatesToCreate = PROGRAMACION_III_TEMPLATES.slice(0, 3);
      for (const tpl of templatesToCreate) {
        const res = await createIssue(repoOwner, repoName, token, {
          title: tpl.defaultTitle,
          body: tpl.body,
          labels: tpl.labels,
        });
        createdList.push(res);
      }
      onBatchCreated(createdList);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear issues recomendadas');
    } finally {
      setIsBatchCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Control bar: Filters and Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* State Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterState === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({issues.length})
          </button>
          <button
            onClick={() => setFilterState('open')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterState === 'open'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Abiertas ({issues.filter((i) => i.state === 'open').length})</span>
          </button>
          <button
            onClick={() => setFilterState('closed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filterState === 'closed'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Cerradas ({issues.filter((i) => i.state === 'closed').length})</span>
          </button>
        </div>

        {/* Search & Label filter */}
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, contenido o #1..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {allLabels.length > 0 && (
            <select
              value={selectedLabelFilter}
              onChange={(e) => setSelectedLabelFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Todas las etiquetas</option>
              {allLabels.map((lbl) => (
                <option key={lbl} value={lbl}>
                  {lbl}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Create Issue Button */}
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Issue</span>
        </button>
      </div>

      {/* Issues list contents */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Cargando issues desde GitHub...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <CircleDot className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-white">
              {issues.length === 0
                ? `No hay issues creadas en ${repoName}`
                : 'No se encontraron issues con los filtros actuales'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {issues.length === 0
                ? 'Podés crear una nueva issue personalizada o autogenerar las issues recomendadas para la cursada de Programación III.'
                : 'Probá limpiando el buscador o cambiando los filtros de estado.'}
            </p>
          </div>

          {issues.length === 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Crear mi primera Issue</span>
              </button>

              <button
                onClick={handleCreateRecommendedIssues}
                disabled={isBatchCreating}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
              >
                {isBatchCreating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Creando issues recomendadas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Crear 3 Issues Recomendadas (TP1, TP2, Setup)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIssues.map((issue) => {
            const isOpen = issue.state === 'open';
            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex items-start justify-between gap-4"
              >
                {/* Left details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    {isOpen ? (
                      <CircleDot className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {issue.title}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        #{issue.number}
                      </span>
                    </div>

                    {/* Labels */}
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {issue.labels.map((lbl, idx) => {
                          const name = typeof lbl === 'string' ? lbl : lbl.name;
                          return (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                            >
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span>Abierta por @{issue.user.login}</span>
                      <span>•</span>
                      <span>{formatDate(issue.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {issue.comments > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{issue.comments}</span>
                    </div>
                  )}

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
