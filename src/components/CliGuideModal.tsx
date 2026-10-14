import React, { useState } from 'react';
import { X, Terminal, Copy, Check, ExternalLink, Code } from 'lucide-react';

interface CliGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CliGuideModal: React.FC<CliGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Inicializar repositorio local',
      desc: 'En tu computadora, abrí la terminal en la carpeta de tu proyecto de Programación III y ejecutá:',
      code: `git init
git add .
git commit -m "feat: commit inicial del proyecto ProgramacionIII"`,
    },
    {
      title: '2. Configurar la rama principal y el remote de GitHub',
      desc: 'Vinculá tu carpeta local con tu repositorio remoto de GitHub:',
      code: `git branch -M main
git remote add origin https://github.com/JoaquinRiveroAlvarez/ProgramacionIII.git`,
    },
    {
      title: '3. Subir los cambios a GitHub (Push)',
      desc: 'Cuando te pida usuario y contraseña, ingresá tu usuario de GitHub y como contraseña usá tu Personal Access Token (PAT):',
      code: `git push -u origin main`,
    },
    {
      title: '💡 Alternativa: Push automático usando el Token en la URL',
      desc: 'Para no tener que escribir la clave cada vez (reemplazá TU_TOKEN por tu Personal Access Token):',
      code: `git remote set-url origin https://TU_TOKEN@github.com/JoaquinRiveroAlvarez/ProgramacionIII.git
git push -u origin main`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Comandos Git CLI</h2>
              <p className="text-xs text-slate-400">Guía para clonar y subir cambios desde tu terminal local</p>
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {steps.map((s, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-300">{s.title}</h4>
              <p className="text-xs text-slate-400">{s.desc}</p>
              <div className="relative">
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto">
                  {s.code}
                </pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(s.code, idx)}
                  className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors border border-slate-700"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
