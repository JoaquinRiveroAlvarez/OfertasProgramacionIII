import React, { useState } from 'react';
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  AlertCircle,
  FileText,
  GitCommit,
  ExternalLink,
  Sparkles,
  KeyRound,
  Terminal,
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { createOrUpdateFile, getCommits } from '../services/githubApi';
import { GitHubCommit } from '../types/github';

interface GitSyncPanelProps {
  token: string;
  commits: GitHubCommit[];
  onCommitSuccess: () => void;
  onOpenTokenModal: () => void;
  isEmptyRepo: boolean;
}

const STARTER_README = `# Programación III

Repositorio de trabajos prácticos, algoritmos y estructuras de datos para la materia **Programación III**.

## 📚 Contenidos del Curso
- **TP1**: Estructuras de Datos Avanzadas (Árboles Binarios, AVL, Grafos).
- **TP2**: Algoritmos de Búsqueda, Ordenamiento y Complejidad Temporal.
- **TP3**: Técnicas de Diseño de Algoritmos (Greedy, Backtracking, Programación Dinámica).

## 🛠️ Estructura del Proyecto
\`\`\`text
├── /tp1              # Código y ejercicios del Trabajo Práctico 1
├── /tp2              # Código y ejercicios del Trabajo Práctico 2
├── /docs             # Enunciados, diagramas y documentación
└── README.md         # Documentación principal
\`\`\`

## 🚀 Cómo ejecutar
1. Clonar el repositorio:
   \`\`\`bash
   git clone https://github.com/JoaquinRiveroAlvarez/ProgramacionIII.git
   \`\`\`
2. Compilar y ejecutar según las instrucciones de cada TP.
`;

const STARTER_GITIGNORE = `# Binarios y compilados
*.class
*.o
*.obj
*.exe
target/
build/
bin/
out/

# IDEs y Editores
.idea/
.vscode/
*.iml
.project
.classpath
.settings/

# Dependencias y entornos virtuales
node_modules/
venv/
__pycache__/

# Logs y SO
*.log
.DS_Store
Thumbs.db
`;

export const GitSyncPanel: React.FC<GitSyncPanelProps> = ({
  token,
  commits,
  onCommitSuccess,
  onOpenTokenModal,
  isEmptyRepo,
}) => {
  const [filePath, setFilePath] = useState('README.md');
  const [fileContent, setFileContent] = useState(STARTER_README);
  const [commitMessage, setCommitMessage] = useState('docs: inicializar repositorio con README.md');
  const [isCommitting, setIsCommitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string; url?: string } | null>(null);

  const handleScaffoldRepo = async () => {
    if (!token) {
      onOpenTokenModal();
      return;
    }

    setIsCommitting(true);
    setStatusMsg(null);

    try {
      // 1. Commit README.md
      const resReadme = await createOrUpdateFile(
        'JoaquinRiveroAlvarez',
        'ProgramacionIII',
        token,
        'README.md',
        'chore: inicializar repositorio con README.md base para Programacion III',
        STARTER_README
      );

      // 2. Commit .gitignore
      await createOrUpdateFile(
        'JoaquinRiveroAlvarez',
        'ProgramacionIII',
        token,
        '.gitignore',
        'chore: agregar .gitignore estándar para proyectos académicos',
        STARTER_GITIGNORE
      );

      setStatusMsg({
        type: 'success',
        text: '¡Repositorio inicializado con éxito! Se crearon README.md y .gitignore en branch main.',
        url: resReadme.commit.html_url,
      });

      onCommitSuccess();
    } catch (err: unknown) {
      setStatusMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al inicializar repositorio',
      });
    } finally {
      setIsCommitting(false);
    }
  };

  const handleCustomCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      onOpenTokenModal();
      return;
    }

    if (!filePath.trim()) {
      setStatusMsg({ type: 'error', text: 'Indicá una ruta de archivo válida (ej: src/TP1/Principal.java).' });
      return;
    }

    if (!commitMessage.trim()) {
      setStatusMsg({ type: 'error', text: 'Escribí un mensaje de commit descriptivo.' });
      return;
    }

    setIsCommitting(true);
    setStatusMsg(null);

    try {
      const res = await createOrUpdateFile(
        'JoaquinRiveroAlvarez',
        'ProgramacionIII',
        token,
        filePath.trim(),
        commitMessage.trim(),
        fileContent
      );

      setStatusMsg({
        type: 'success',
        text: `¡Archivo "${filePath.trim()}" subido y comiteado con éxito a GitHub!`,
        url: res.commit.html_url,
      });

      onCommitSuccess();
    } catch (err: unknown) {
      setStatusMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al subir commit a GitHub',
      });
    } finally {
      setIsCommitting(false);
    }
  };

  const loadPresetTemplate = (type: 'readme' | 'gitignore' | 'tp1-java' | 'tp1-cpp') => {
    if (type === 'readme') {
      setFilePath('README.md');
      setFileContent(STARTER_README);
      setCommitMessage('docs: actualizar documentación principal README.md');
    } else if (type === 'gitignore') {
      setFilePath('.gitignore');
      setFileContent(STARTER_GITIGNORE);
      setCommitMessage('chore: configurar .gitignore');
    } else if (type === 'tp1-java') {
      setFilePath('src/tp1/ArbolBinarioBusqueda.java');
      setFileContent(`package tp1;

public class ArbolBinarioBusqueda<T extends Comparable<T>> {
    private static class Nodo<T> {
        T dato;
        Nodo<T> izquierdo;
        Nodo<T> derecho;

        Nodo(T dato) {
            this.dato = dato;
        }
    }

    private Nodo<T> raiz;

    public void insertar(T valor) {
        raiz = insertarRecursivo(raiz, valor);
    }

    private Nodo<T> insertarRecursivo(Nodo<T> actual, T valor) {
        if (actual == null) {
            return new Nodo<>(valor);
        }
        if (valor.compareTo(actual.dato) < 0) {
            actual.izquierdo = insertarRecursivo(actual.izquierdo, valor);
        } else if (valor.compareTo(actual.dato) > 0) {
            actual.derecho = insertarRecursivo(actual.derecho, valor);
        }
        return actual;
    }

    public boolean contiene(T valor) {
        return buscar(raiz, valor);
    }

    private boolean buscar(Nodo<T> actual, T valor) {
        if (actual == null) return false;
        if (valor.compareTo(actual.dato) == 0) return true;
        return valor.compareTo(actual.dato) < 0
                ? buscar(actual.izquierdo, valor)
                : buscar(actual.derecho, valor);
    }
}
`);
      setCommitMessage('feat(tp1): estructura base de Arbol Binario de Busqueda');
    } else if (type === 'tp1-cpp') {
      setFilePath('tp1/grafo.hpp');
      setFileContent(`#pragma once
#include <vector>
#include <iostream>

class Grafo {
private:
    int numVertices;
    std::vector<std::vector<int>> listaAdyacencia;

public:
    Grafo(int v) : numVertices(v), listaAdyacencia(v) {}

    void agregarArista(int u, int v) {
        listaAdyacencia[u].push_back(v);
        listaAdyacencia[v].push_back(u); // No dirigido
    }

    int getVertices() const { return numVertices; }
};
`);
      setCommitMessage('feat(tp1): clase base Grafo en C++');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Starter Scaffolding Banner if empty or wanted */}
      {isEmptyRepo && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Inicializar Repositorio con Estructura Oficial de Programación III
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Crea automáticamente los archivos <span className="text-indigo-300 font-mono">README.md</span> y <span className="text-indigo-300 font-mono">.gitignore</span> y genera la rama <span className="text-indigo-300 font-mono">main</span> en GitHub.
              </p>
            </div>
          </div>

          <button
            onClick={handleScaffoldRepo}
            disabled={isCommitting}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0"
          >
            {isCommitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Subiendo archivos a GitHub...</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                <span>Crear Archivos Iniciales en GitHub</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Direct Code Editor & Commit Pusher */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Subir Cambios / Commit Directo a GitHub</h2>
              <p className="text-xs text-slate-400">
                Escribí código o cargá archivos y hacé commit & push a <span className="text-indigo-400 font-mono">main</span>
              </p>
            </div>
          </div>

          {/* Quick presets for common files */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Plantillas:</span>
            <button
              type="button"
              onClick={() => loadPresetTemplate('readme')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              README.md
            </button>
            <button
              type="button"
              onClick={() => loadPresetTemplate('gitignore')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              .gitignore
            </button>
            <button
              type="button"
              onClick={() => loadPresetTemplate('tp1-java')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              Java (Árbol)
            </button>
            <button
              type="button"
              onClick={() => loadPresetTemplate('tp1-cpp')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            >
              C++ (Grafo)
            </button>
          </div>
        </div>

        {/* No token notice */}
        {!token && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Conectá tu Token de GitHub para habilitar la subida y commits de código.</span>
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

        {/* Status banner */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
            {statusMsg.url && (
              <a
                href={statusMsg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-white underline shrink-0"
              >
                <span>Ver Commit en GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCustomCommit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ruta del archivo en el repositorio</span>
              </label>
              <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="Ej: src/tp1/ArbolBinario.java"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mensaje del Commit</span>
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Ej: feat(tp1): resolver problema de busqueda en grafos"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contenido del archivo</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {fileContent.split('\n').length} líneas
              </span>
            </div>
            <textarea
              rows={12}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isCommitting || !token}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/30"
            >
              {isCommitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Subiendo commit a GitHub...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Subir Cambios a GitHub (Commit & Push)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info card on how the assistant works */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>¿Cómo pedirle al asistente AI que suba cambios a GitHub?</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Podés pedirle directamente en el chat comandos como:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px] pl-1">
          <li>"Creá una issue para el TP1 con los requerimientos de Árboles AVL"</li>
          <li>"Subí un archivo src/Grafos.java al repositorio ProgramacionIII"</li>
          <li>"Hacé un commit agregando las pruebas de Dijkstra"</li>
        </ul>
        <p className="text-slate-400 text-[11px] pt-1">
          Una vez que configures tu token de GitHub, tanto esta interfaz web como el asistente pueden interactuar con tu repositorio en tiempo real.
        </p>
      </div>
    </div>
  );
};
