import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  CircleDot,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  KeyRound,
  RefreshCw,
  FileCheck,
  CheckSquare,
  Square,
  Terminal,
  Copy,
  Check,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { MVP_ISSUES, MvpIssueItem } from '../data/issueTemplates';
import { createIssue, updateIssue } from '../services/githubApi';
import { GitHubIssue } from '../types/github';

interface MvpIssuesManagerProps {
  repoOwner: string;
  repoName: string;
  token: string;
  onOpenTokenModal: () => void;
  onIssuePublished: (created: GitHubIssue) => void;
  onBatchPublished: (createdList: GitHubIssue[]) => void;
  existingIssues: GitHubIssue[];
  onRefreshRepo: () => void;
}

export const MvpIssuesManager: React.FC<MvpIssuesManagerProps> = ({
  repoOwner,
  repoName,
  token,
  onOpenTokenModal,
  onIssuePublished,
  onBatchPublished,
  existingIssues,
  onRefreshRepo,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(MVP_ISSUES[0].id);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [togglingStateId, setTogglingStateId] = useState<string | null>(null);
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{ current: number; total: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterView, setFilterView] = useState<'all' | 'pending' | 'completed'>('all');
  const [showCliScript, setShowCliScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Local checklist storage for task checkboxes
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`mvp_tasks_${repoName}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`mvp_tasks_${repoName}`, JSON.stringify(checkedTasks));
    } catch {
      // Ignore
    }
  }, [checkedTasks, repoName]);

  const toggleTask = (taskKey: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  // Find matching GitHub issue by title
  const getMatchingGhIssue = (mvpTitle: string): GitHubIssue | undefined => {
    return existingIssues.find((i) => i.title.toLowerCase().trim() === mvpTitle.toLowerCase().trim());
  };

  const isIssueCompleted = (issueItem: MvpIssueItem) => {
    const ghIssue = getMatchingGhIssue(issueItem.title);
    if (ghIssue) {
      return ghIssue.state === 'closed';
    }
    // If not published, check if all tasks were marked checked locally
    const totalTasks = issueItem.criteriosAceptacion.length;
    const completedTasks = issueItem.criteriosAceptacion.filter(
      (_, idx) => checkedTasks[`${issueItem.id}_${idx}`]
    ).length;
    return completedTasks === totalTasks && totalTasks > 0;
  };

  const handlePublishSingle = async (issueItem: MvpIssueItem) => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setPublishingId(issueItem.id);
    setStatusMessage(null);

    try {
      const created = await createIssue(repoOwner, repoName, token, {
        title: issueItem.title,
        body: issueItem.body,
        labels: issueItem.labels,
      });

      onIssuePublished(created);
      setStatusMessage({
        type: 'success',
        text: `¡Issue #${created.number} "${issueItem.title}" publicada en ${repoOwner}/${repoName}!`,
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al publicar la issue en GitHub',
      });
    } finally {
      setPublishingId(null);
    }
  };

  const handleToggleGhState = async (issueItem: MvpIssueItem, ghIssue: GitHubIssue) => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setTogglingStateId(issueItem.id);
    setStatusMessage(null);

    const newState = ghIssue.state === 'open' ? 'closed' : 'open';

    try {
      const updated = await updateIssue(repoOwner, repoName, token, ghIssue.number, {
        state: newState,
      });
      onIssuePublished(updated);
      setStatusMessage({
        type: 'success',
        text: `Issue #${ghIssue.number} marcada como ${newState === 'closed' ? 'COMPLETADA' : 'REABIERTA'} en GitHub.`,
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al cambiar estado en GitHub',
      });
    } finally {
      setTogglingStateId(null);
    }
  };

  const handlePublishAll = async () => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setIsPublishingAll(true);
    setStatusMessage(null);

    const pendingToPublish = MVP_ISSUES.filter((item) => !getMatchingGhIssue(item.title));

    if (pendingToPublish.length === 0) {
      setStatusMessage({
        type: 'success',
        text: `¡Todas las 9 issues del MVP ya fueron publicadas en ${repoOwner}/${repoName}!`,
      });
      setIsPublishingAll(false);
      return;
    }

    setPublishProgress({ current: 0, total: pendingToPublish.length });
    const newlyCreated: GitHubIssue[] = [];

    try {
      for (let i = 0; i < pendingToPublish.length; i++) {
        const item = pendingToPublish[i];
        setPublishProgress({ current: i + 1, total: pendingToPublish.length });

        const created = await createIssue(repoOwner, repoName, token, {
          title: item.title,
          body: item.body,
          labels: item.labels,
        });

        newlyCreated.push(created);
        await new Promise((r) => setTimeout(r, 600));
      }

      onBatchPublished(newlyCreated);
      setStatusMessage({
        type: 'success',
        text: `¡Éxito! Se subieron ${newlyCreated.length} issues a ${repoOwner}/${repoName}.`,
      });
    } catch (err: unknown) {
      if (newlyCreated.length > 0) {
        onBatchPublished(newlyCreated);
      }
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error durante la subida masiva de issues',
      });
    } finally {
      setIsPublishingAll(false);
      setPublishProgress(null);
    }
  };

  const completedIssuesCount = MVP_ISSUES.filter(isIssueCompleted).length;
  const progressPercent = Math.round((completedIssuesCount / MVP_ISSUES.length) * 100);

  const filteredIssues = MVP_ISSUES.filter((issue) => {
    const isCompleted = isIssueCompleted(issue);
    if (filterView === 'pending') return !isCompleted;
    if (filterView === 'completed') return isCompleted;
    return true;
  });

  const cliScriptSnippet = `GITHUB_TOKEN="TU_TOKEN_AQUI" node scripts/upload_issues_to_github.js ${repoName}`;

  const copyCliScript = () => {
    navigator.clipboard.writeText(cliScriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Progress & Batch Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>MVP Tracker</span>
              </span>
              <span className="text-xs text-slate-400">
                Repositorio activo:{' '}
                <strong className="text-indigo-300 font-mono">{repoOwner}/{repoName}</strong>
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Gestor y Seguimiento de Issues del MVP
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Subí las 9 issues a GitHub con 1 clic y hacé el seguimiento marcándolas como completadas a medida que vayas implementando cada módulo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 self-stretch lg:self-auto">
            <button
              onClick={() => setShowCliScript(!showCliScript)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Script Terminal</span>
            </button>

            {!token ? (
              <button
                onClick={onOpenTokenModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>Conectar Token para Subir</span>
              </button>
            ) : (
              <button
                onClick={handlePublishAll}
                disabled={isPublishingAll}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                {isPublishingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      Subiendo {publishProgress ? `${publishProgress.current}/${publishProgress.total}` : '...'}
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Subir Todas las Issues a {repoName}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Progreso del MVP: {completedIssuesCount} de {MVP_ISSUES.length} completadas
            </span>
            <span className="font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* CLI Script Expandable */}
        {showCliScript && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Comando para subir por terminal (Node.js script incluido):</span>
              </span>
              <button
                onClick={copyCliScript}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-white"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? '¡Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto select-all">
              {cliScriptSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 shadow-md ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterView === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({MVP_ISSUES.length})
          </button>
          <button
            onClick={() => setFilterView('pending')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterView === 'pending'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pendientes ({MVP_ISSUES.length - completedIssuesCount})
          </button>
          <button
            onClick={() => setFilterView('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterView === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completadas ({completedIssuesCount})
          </button>
        </div>

        <button
          onClick={onRefreshRepo}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sincronizar con GitHub</span>
        </button>
      </div>

      {/* Issues Accordion List */}
      <div className="space-y-3">
        {filteredIssues.map((issue) => {
          const isExpanded = expandedId === issue.id;
          const ghIssue = getMatchingGhIssue(issue.title);
          const isPublished = Boolean(ghIssue);
          const isCompleted = isIssueCompleted(issue);
          const isPublishing = publishingId === issue.id;
          const isToggling = togglingStateId === issue.id;

          const totalTasks = issue.criteriosAceptacion.length;
          const completedTasks = issue.criteriosAceptacion.filter(
            (_, idx) => checkedTasks[`${issue.id}_${idx}`]
          ).length;

          const moduleBadgeColor =
            issue.module === 'Backend & Datos'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : issue.module === 'Frontend & Cliente'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-purple-500/10 text-purple-400 border-purple-500/20';

          return (
            <div
              key={issue.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCompleted
                  ? 'bg-slate-950/80 border-emerald-500/30'
                  : isExpanded
                  ? 'bg-slate-900 border-indigo-500/50 shadow-xl'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isPublished
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    #{issue.number}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${moduleBadgeColor}`}>
                        {issue.module}
                      </span>

                      {/* State badge */}
                      {isCompleted ? (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Completada
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CircleDot className="w-3 h-3" />
                          Pendiente
                        </span>
                      )}

                      {/* GitHub Link & Number if published */}
                      {ghIssue && (
                        <a
                          href={ghIssue.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700"
                        >
                          <span>GitHub #{ghIssue.number}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}

                      {/* Tasks ratio indicator */}
                      <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                        {completedTasks}/{totalTasks} criterios
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold transition-colors ${isCompleted ? 'text-slate-300 line-through' : 'text-white hover:text-indigo-300'}`}>
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Toggle Complete / Incomplete */}
                  {ghIssue ? (
                    <button
                      type="button"
                      onClick={() => handleToggleGhState(issue, ghIssue)}
                      disabled={isToggling}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        ghIssue.state === 'closed'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      {isToggling ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Actualizando...</span>
                        </>
                      ) : ghIssue.state === 'closed' ? (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          <span>Reabrir</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Completar</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePublishSingle(issue)}
                      disabled={isPublishing}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                    >
                      {isPublishing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Subir Issue</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className="text-slate-500 p-1 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : issue.id)}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                  {/* Interactive Criterios de Aceptación */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Criterios de Aceptación (Hacé clic para marcar como hecho):</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {completedTasks} de {totalTasks} hechos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {issue.criteriosAceptacion.map((crit, idx) => {
                        const taskKey = `${issue.id}_${idx}`;
                        const isChecked = Boolean(checkedTasks[taskKey]);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleTask(taskKey)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                              isChecked
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              className="mt-0.5 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                            />
                            <span className={isChecked ? 'line-through text-slate-400' : ''}>
                              {crit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-500 text-[11px]">Etiquetas:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {issue.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Preview */}
                  <div>
                    <span className="text-slate-500 text-[11px] block mb-1.5">
                      Descripción completa en GitHub:
                    </span>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {issue.body}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
