import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Tag,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  CheckSquare,
  Code,
  Heading,
  Bold,
  Eye,
  Edit3,
  KeyRound
} from 'lucide-react';
import { PROGRAMACION_III_TEMPLATES } from '../data/issueTemplates';
import { createIssue } from '../services/githubApi';
import { GitHubIssue, IssueTemplate } from '../types/github';

interface CreateIssueModalProps {
  repoOwner: string;
  repoName: string;
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onIssueCreated: (newIssue: GitHubIssue) => void;
  onOpenTokenModal: () => void;
}

const AVAILABLE_LABELS = [
  { name: 'trabajo-practico', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { name: 'algoritmos', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { name: 'estructura-datos', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { name: 'enhancement', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { name: 'bug', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { name: 'documentation', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  { name: 'testing', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { name: 'setup', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
];

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  repoOwner,
  repoName,
  isOpen,
  onClose,
  token,
  onIssueCreated,
  onOpenTokenModal,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['trabajo-practico']);
  const [customLabel, setCustomLabel] = useState('');
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl: IssueTemplate) => {
    setTitle(tpl.defaultTitle);
    setBody(tpl.body);
    setSelectedLabels(tpl.labels);
    setViewMode('write');
  };

  const toggleLabel = (labelName: string) => {
    if (selectedLabels.includes(labelName)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== labelName));
    } else {
      setSelectedLabels([...selectedLabels, labelName]);
    }
  };

  const handleAddCustomLabel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customLabel.trim()) {
      e.preventDefault();
      const clean = customLabel.trim().toLowerCase().replace(/\s+/g, '-');
      if (!selectedLabels.includes(clean)) {
        setSelectedLabels([...selectedLabels, clean]);
      }
      setCustomLabel('');
    }
  };

  const insertFormatting = (prefix: string, suffix = '') => {
    setBody((prev) => `${prev}\n${prefix}texto${suffix}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor especificá un título para la issue.');
      return;
    }

    if (!token) {
      setError('Necesitás conectar tu Personal Access Token de GitHub para publicar la issue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createIssue(repoOwner, repoName, token, {
        title: title.trim(),
        body: body.trim(),
        labels: selectedLabels,
      });

      onIssueCreated(created);
      setTitle('');
      setBody('');
      setSelectedLabels(['trabajo-practico']);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al crear la issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Nueva Issue en GitHub</h2>
              <p className="text-xs text-slate-400">
                Repositorio: <span className="text-indigo-400 font-mono">{repoOwner}/{repoName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body with templates and form */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Preset templates selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Plantillas rápidas para Programación III:
              </span>
              <span className="text-[11px] text-slate-500">Hacé clic para rellenar automáticamente</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROGRAMACION_III_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-left p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 transition-all group"
                >
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                    {tpl.title}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {tpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* If no token connected, show alert banner */}
          {!token && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  No hay token de GitHub conectado. Conectalo para que la API permita crear la issue.
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenTokenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Conectar Token</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Título de la Issue *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: TP1: Implementar Árbol AVL y tests unitarios"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Etiquetas (Labels)</span>
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {AVAILABLE_LABELS.map((lbl) => {
                  const isSelected = selectedLabels.includes(lbl.name);
                  return (
                    <button
                      key={lbl.name}
                      type="button"
                      onClick={() => toggleLabel(lbl.name)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? `${lbl.color} ring-1 ring-white/30 font-semibold`
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {lbl.name}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                onKeyDown={handleAddCustomLabel}
                placeholder="Escribí una etiqueta personalizada y presioná Enter..."
                className="w-full px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Descripción / Especificación de la Issue
                </label>
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('write')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      viewMode === 'write'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Escribir</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Vista Previa</span>
                  </button>
                </div>
              </div>

              {viewMode === 'write' ? (
                <div className="space-y-1.5">
                  {/* Formatting toolbar */}
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 border border-slate-700 rounded-t-xl text-slate-400 text-xs">
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      title="Título"
                      className="p-1 hover:text-white hover:bg-slate-700 rounded"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      title="Negrita"
                      className="p-1 hover:text-white hover:bg-slate-700 rounded"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- [ ] ')}
                      title="Lista de tareas con checkbox"
                      className="p-1 hover:text-white hover:bg-slate-700 rounded"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('```ts\n', '\n```')}
                      title="Bloque de código"
                      className="p-1 hover:text-white hover:bg-slate-700 rounded"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Describí los requerimientos, criterios de aceptación, tareas a resolver..."
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-b-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
                  />
                </div>
              ) : (
                <div className="min-h-[190px] p-4 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-200 space-y-2 whitespace-pre-wrap font-sans">
                  {body.trim() ? (
                    body
                  ) : (
                    <span className="text-slate-500 italic">No hay contenido para previsualizar.</span>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Publicando en GitHub...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publicar Issue en GitHub</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
