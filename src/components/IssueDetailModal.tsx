import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  User,
  Send,
  Tag,
  CircleDot,
  Check
} from 'lucide-react';
import { GitHubIssue, GitHubUser } from '../types/github';
import {
  updateIssue,
  addIssueComment,
  getIssueComments
} from '../services/githubApi';

interface IssueDetailModalProps {
  repoOwner: string;
  repoName: string;
  issue: GitHubIssue | null;
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onIssueUpdated: (updatedIssue: GitHubIssue) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  repoOwner,
  repoName,
  issue,
  isOpen,
  onClose,
  token,
  onIssueUpdated,
}) => {
  const [comments, setComments] = useState<
    Array<{ id: number; body: string; created_at: string; user: GitHubUser }>
  >([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isTogglingState, setIsTogglingState] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (issue && isOpen) {
      loadComments();
    }
  }, [issue, isOpen]);

  if (!isOpen || !issue) return null;

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const data = await getIssueComments(repoOwner, repoName, token, issue.number);
      setComments(data);
    } catch {
      // Ignore
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleToggleState = async () => {
    if (!token) {
      setActionError('Se requiere conectar tu Token de GitHub para cambiar el estado de la issue.');
      return;
    }

    setIsTogglingState(true);
    setActionError(null);

    const newState = issue.state === 'open' ? 'closed' : 'open';

    try {
      const updated = await updateIssue(
        repoOwner,
        repoName,
        token,
        issue.number,
        { state: newState }
      );
      onIssueUpdated(updated);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error al modificar estado');
    } finally {
      setIsTogglingState(false);
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      setActionError('Se requiere conectar tu Token de GitHub para comentar.');
      return;
    }

    setIsSendingComment(true);
    setActionError(null);

    try {
      await addIssueComment(
        repoOwner,
        repoName,
        token,
        issue.number,
        newComment.trim()
      );
      setNewComment('');
      await loadComments();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error al agregar comentario');
    } finally {
      setIsSendingComment(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  issue.state === 'open'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5" />
                <span>{issue.state === 'open' ? 'Abierta' : 'Cerrada'}</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">#{issue.number}</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight mt-1">
              {issue.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                @{issue.user.login}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {formatDate(issue.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Abrir en GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Labels */}
          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {issue.labels.map((lbl, idx) => {
                const labelName = typeof lbl === 'string' ? lbl : lbl.name;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-medium"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {labelName}
                  </span>
                );
              })}
            </div>
          )}

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {issue.body || <span className="text-slate-500 italic">Sin descripción proporcionada.</span>}
          </div>

          {/* Status action toggle button */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-xs text-slate-300">
              Estado actual: <strong className="text-white">{issue.state === 'open' ? 'Abierta' : 'Completada / Cerrada'}</strong>
            </div>
            <button
              type="button"
              onClick={handleToggleState}
              disabled={isTogglingState}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                issue.state === 'open'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{issue.state === 'open' ? 'Marcar como Cerrada / Completada' : 'Reabrir Issue'}</span>
            </button>
          </div>

          {actionError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Comments section */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Comentarios ({comments.length})</span>
            </div>

            {isLoadingComments ? (
              <div className="text-center py-6 text-slate-500 text-xs flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                <span>Cargando comentarios...</span>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No hay comentarios en esta issue todavía.</p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        {c.user?.avatar_url && (
                          <img
                            src={c.user.avatar_url}
                            alt={c.user.login}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span className="font-semibold text-slate-200">@{c.user?.login}</span>
                      </div>
                      <span>{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap">{c.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment input */}
            <form onSubmit={handleSendComment} className="space-y-2 pt-2">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribí un comentario o actualización sobre esta issue..."
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSendingComment || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingComment ? 'Enviando...' : 'Comentar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
