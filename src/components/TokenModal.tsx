import React, { useState } from 'react';
import { X, KeyRound, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, Trash2, Terminal } from 'lucide-react';
import { verifyGitHubToken } from '../services/githubApi';
import { GitHubUser } from '../types/github';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSaveToken: (token: string, user: GitHubUser | null) => void;
  currentUser: GitHubUser | null;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  token,
  onSaveToken,
  currentUser,
}) => {
  const [inputToken, setInputToken] = useState(token);
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUser, setSuccessUser] = useState<GitHubUser | null>(currentUser);

  if (!isOpen) return null;

  const handleValidateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = inputToken.trim();
    if (!cleanToken) {
      setError('Por favor ingresá un Personal Access Token de GitHub.');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const user = await verifyGitHubToken(cleanToken);
      setSuccessUser(user);
      onSaveToken(cleanToken, user);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al validar token');
      setSuccessUser(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveToken = () => {
    setInputToken('');
    setSuccessUser(null);
    onSaveToken('', null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Conexión con GitHub</h2>
              <p className="text-xs text-slate-400">Personal Access Token para crear issues y subir código</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Information box */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-start gap-2 text-indigo-300 font-medium text-sm">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
              <span>¿Por qué se necesita un Token de GitHub?</span>
            </div>
            <p>
              GitHub no permite crear issues ni comitear cambios de forma anónima o sin autenticación en repositorios.
              Para que puedas <strong>crear issues directamente desde acá</strong> y <strong>subir los cambios a tu repositorio ProgramacionIII</strong>,
              se requiere un <em>Personal Access Token (classic)</em> con permisos de <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">repo</code>.
            </p>
          </div>

          {/* Quick instructions to generate token */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-200">
                ⚡ Generar token en 1 clic en GitHub
              </span>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=ProgramacionIII-AI-Sync"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <span>Crear Token en GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <ol className="text-xs text-slate-300 list-decimal list-inside space-y-1">
              <li>Hacé clic en el botón de arriba (abrirá GitHub con el scope <strong>repo</strong> ya marcado).</li>
              <li>Hacé scroll hacia abajo y hacé clic en el botón verde <strong>"Generate token"</strong>.</li>
              <li>Copiá el token que empieza con <code className="text-emerald-300">ghp_...</code> y pegalo acá abajo.</li>
            </ol>
          </div>

          {/* Current status if authenticated */}
          {successUser && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={successUser.avatar_url}
                  alt={successUser.login}
                  className="w-8 h-8 rounded-full border border-emerald-500/50"
                />
                <div>
                  <div className="font-semibold text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Conectado como @{successUser.login}</span>
                  </div>
                  <span className="text-emerald-400/80">Acceso a la API habilitado con éxito</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveToken}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Desconectar token"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleValidateAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Personal Access Token (PAT)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isValidating || !inputToken.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/30"
              >
                {isValidating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Verificando con GitHub...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verificar y Guardar Token</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Also mention assistant chat instructions */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>
                También podés compartirme el token o pedirme en el chat: <em className="text-slate-300">"Creá las issues para el TP1"</em> y se crearán automáticamente.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
