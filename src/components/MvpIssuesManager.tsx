import React, { useState } from 'react';
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
  FileCheck
} from 'lucide-react';
import { MVP_ISSUES, MvpIssueItem } from '../data/issueTemplates';
import { createIssue } from '../services/githubApi';
import { GitHubIssue } from '../types/github';

interface MvpIssuesManagerProps {
  token: string;
  onOpenTokenModal: () => void;
  onIssuePublished: (created: GitHubIssue) => void;
  onBatchPublished: (createdList: GitHubIssue[]) => void;
  existingIssues: GitHubIssue[];
}

export const MvpIssuesManager: React.FC<MvpIssuesManagerProps> = ({
  token,
  onOpenTokenModal,
  onIssuePublished,
  onBatchPublished,
  existingIssues,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(MVP_ISSUES[0].id);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{ current: number; total: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check which MVP issues are already created on GitHub (matching title)
  const isIssueCreated = (mvpTitle: string) => {
    return existingIssues.some((i) => i.title.toLowerCase().trim() === mvpTitle.toLowerCase().trim());
  };

  const handlePublishSingle = async (issueItem: MvpIssueItem) => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setPublishingId(issueItem.id);
    setStatusMessage(null);

    try {
      const created = await createIssue('JoaquinRiveroAlvarez', 'ProgramacionIII', token, {
        title: issueItem.title,
        body: issueItem.body,
        labels: issueItem.labels,
      });

      onIssuePublished(created);
      setStatusMessage({
        type: 'success',
        text: `¡Issue #${created.number} "${issueItem.title}" publicada en GitHub con éxito!`,
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

  const handlePublishAll = async () => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setIsPublishingAll(true);
    setStatusMessage(null);

    const pendingToPublish = MVP_ISSUES.filter((item) => !isIssueCreated(item.title));

    if (pendingToPublish.length === 0) {
      setStatusMessage({
        type: 'success',
        text: '¡Todas las 9 issues del MVP ya fueron publicadas previamente en GitHub!',
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

        const created = await createIssue('JoaquinRiveroAlvarez', 'ProgramacionIII', token, {
          title: item.title,
          body: item.body,
          labels: item.labels,
        });

        newlyCreated.push(created);
        // Small delay between requests to be gentle on GitHub API rate limits
        await new Promise((r) => setTimeout(r, 600));
      }

      onBatchPublished(newlyCreated);
      setStatusMessage({
        type: 'success',
        text: `¡Éxito total! Se publicaron ${newlyCreated.length} issues del MVP en tu repositorio GitHub.`,
      });
    } catch (err: unknown) {
      if (newlyCreated.length > 0) {
        onBatchPublished(newlyCreated);
      }
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error durante la publicación de issues',
      });
    } finally {
      setIsPublishingAll(false);
      setPublishProgress(null);
    }
  };

  const totalCreatedCount = MVP_ISSUES.filter((i) => isIssueCreated(i.title)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Batch Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MVP Unificado
            </span>
            <span className="text-xs text-slate-400">
              Centralizador Inteligente de Descuentos (McDonald's, Burger King, Mostaza)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Etapa de Generación de Issues para GitHub
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Se desglosaron los 2 módulos y los criterios de aceptación en <strong>9 issues exhaustivas</strong>, listas para ser subidas a tu repositorio <span className="text-indigo-300 font-mono">JoaquinRiveroAlvarez/ProgramacionIII</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 self-stretch sm:self-auto">
          {!token ? (
            <button
              onClick={onOpenTokenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Conectar Token para Subir</span>
            </button>
          ) : (
            <button
              onClick={handlePublishAll}
              disabled={isPublishingAll || totalCreatedCount === MVP_ISSUES.length}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isPublishingAll ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    Subiendo {publishProgress ? `${publishProgress.current}/${publishProgress.total}` : '...'}
                  </span>
                </>
              ) : totalCreatedCount === MVP_ISSUES.length ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>9 de 9 ya en GitHub</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Subir las {MVP_ISSUES.length - totalCreatedCount} Issues Faltantes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress / Status feedback message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
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

      {/* Issues Accordion List */}
      <div className="space-y-3">
        {MVP_ISSUES.map((issue) => {
          const isExpanded = expandedId === issue.id;
          const isCreated = isIssueCreated(issue.title);
          const isPublishing = publishingId === issue.id;

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
                isExpanded
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
                      isCreated
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    #{issue.number}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${moduleBadgeColor}`}>
                        {issue.module}
                      </span>
                      {isCreated && (
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Subida a GitHub
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePublishSingle(issue);
                    }}
                    disabled={isPublishing || isPublishingAll || isCreated}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isCreated
                        ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Subiendo...</span>
                      </>
                    ) : isCreated ? (
                      <>
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Publicada</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Subir Issue</span>
                      </>
                    )}
                  </button>

                  <div className="text-slate-500 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs">
                  {/* Criterios de Aceptación */}
                  <div>
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Criterios de Aceptación del MVP:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {issue.criteriosAceptacion.map((crit, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300"
                        >
                          <CircleDot className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </div>
                      ))}
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
                      Cuerpo Markdown enviado a GitHub:
                    </span>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
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
