import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Smartphone,
  Sliders,
  Filter,
  CheckCircle2,
  X,
  Tag,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';
import { CATALOGO_DESCUENTOS_INICIAL, PromocionItem } from '../data/mockPromociones';

export const MvpLivePreview: React.FC = () => {
  const [promos, setPromos] = useState<PromocionItem[]>(CATALOGO_DESCUENTOS_INICIAL);
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyNoApp, setOnlyNoApp] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>(['Hamburguesas']);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  // Selected promo for detail modal
  const [selectedPromo, setSelectedPromo] = useState<PromocionItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Vencida');

  const ALL_PREFERENCES = ['Hamburguesas', 'Combos', 'Postres', 'Café', 'Papas Fritas', 'Bebidas'];

  const togglePreference = (pref: string) => {
    if (userPreferences.includes(pref)) {
      setUserPreferences(userPreferences.filter((p) => p !== pref));
    } else {
      if (userPreferences.length < 3) {
        setUserPreferences([...userPreferences, pref]);
      }
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCanjearDeepLink = (promo: PromocionItem) => {
    handleCopy(promo.codigoCupon);
    // Open origin URL in new tab
    window.open(promo.urlOrigen, '_blank', 'noopener,noreferrer');
  };

  const handleRatePromo = (promoId: number, isPositive: boolean) => {
    setPromos((prev) =>
      prev.map((p) => {
        if (p.id !== promoId) return p;
        const newPos = isPositive ? p.reportesPositivos + 1 : p.reportesPositivos;
        const newNeg = !isPositive ? p.reportesNegativos + 1 : p.reportesNegativos;
        const total = newPos + newNeg;
        let newSemaforo = p.semaforoValidez;
        if (total >= 3) {
          const ratioNeg = newNeg / total;
          if (ratioNeg > 0.6) newSemaforo = 'Rojo';
          else if (ratioNeg > 0.3) newSemaforo = 'Amarillo';
          else newSemaforo = 'Verde';
        }
        return {
          ...p,
          reportesPositivos: newPos,
          reportesNegativos: newNeg,
          semaforoValidez: newSemaforo,
        };
      })
    );

    if (selectedPromo && selectedPromo.id === promoId) {
      setSelectedPromo((prev) =>
        prev
          ? {
              ...prev,
              reportesPositivos: isPositive ? prev.reportesPositivos + 1 : prev.reportesPositivos,
              reportesNegativos: !isPositive ? prev.reportesNegativos + 1 : prev.reportesNegativos,
            }
          : null
      );
    }

    setFeedbackSuccessMsg(
      isPositive ? '¡Gracias! Tu voto positivo valida esta oferta para la comunidad.' : 'Gracias. Tu reporte ayuda a alertar a otros usuarios.'
    );
    setTimeout(() => setFeedbackSuccessMsg(null), 3000);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromo) return;
    handleRatePromo(selectedPromo.id, false);
    setReportModalOpen(false);
    setFeedbackSuccessMsg('Reporte enviado correctamente. El equipo revisará esta oferta.');
    setTimeout(() => setFeedbackSuccessMsg(null), 3500);
  };

  // Filter & Prioritization Engine
  const filteredAndSortedPromos = promos
    .filter((p) => {
      if (selectedBrand !== 'Todas' && p.marcaNombre !== selectedBrand) return false;
      if (onlyNoApp && p.requiereApp) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.titulo.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.marcaNombre.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Prioritize by user preferences first
      const aMatches = userPreferences.includes(a.categoria) || userPreferences.some(pref => a.titulo.includes(pref));
      const bMatches = userPreferences.includes(b.categoria) || userPreferences.some(pref => b.titulo.includes(pref));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;

      // Then by percentage discount
      return b.porcentajeDescuento - a.porcentajeDescuento;
    });

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the live preview */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Vista Previa en Vivo
              </span>
              <span className="text-xs text-slate-400">
                Frontend React del MVP (McDonald's, Burger King, Mostaza)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Centralizador Inteligente de Descuentos
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Esta es la interfaz de usuario interactiva del Módulo Cliente. Podés buscar ofertas, filtrar marcas, personalizar gustos, canjear cupones y probar el bucle de retroalimentación.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPrefModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 shrink-0"
        >
          <Sliders className="w-4 h-4" />
          <span>Tus Preferencias ({userPreferences.length}/3)</span>
        </button>
      </div>

      {/* User Preferences active chip bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Priorizando por tus gustos:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {userPreferences.map((pref) => (
              <span
                key={pref}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold text-[11px] flex items-center gap-1"
              >
                <span>#{pref}</span>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsPrefModalOpen(true)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
        >
          Cambiar preferencias
        </button>
      </div>

      {/* Filters & Brand Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Brand Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['Todas', "McDonald's", 'Burger King', 'Mostaza'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedBrand === b
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por hamburguesa, postre, combo, papas..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Toggle No App */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none px-2">
            <input
              type="checkbox"
              checked={onlyNoApp}
              onChange={(e) => setOnlyNoApp(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>Sin necesidad de App</span>
            </span>
          </label>
        </div>
      </div>

      {/* Feedback Toast Notification */}
      {feedbackSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackSuccessMsg}</span>
        </div>
      )}

      {/* Grid of Discounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAndSortedPromos.map((promo) => {
          const isPreferred = userPreferences.includes(promo.categoria) || userPreferences.some(p => promo.titulo.includes(p));

          const semaforoBg =
            promo.semaforoValidez === 'Verde'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : promo.semaforoValidez === 'Amarillo'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

          return (
            <div
              key={promo.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between group ${
                isPreferred
                  ? 'bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-5 space-y-3.5">
                {/* Header: Brand & Discount Tag */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={promo.marcaLogo}
                      alt={promo.marcaNombre}
                      className="w-7 h-7 object-contain"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">
                        {promo.marcaNombre}
                      </span>
                      <span className="text-[11px] text-slate-400">{promo.categoria}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-extrabold text-xs border border-rose-500/30">
                    {promo.tipoBeneficio === '2x1'
                      ? '2x1'
                      : promo.tipoBeneficio === 'ProductoGratis'
                      ? '¡GRATIS!'
                      : `-${promo.porcentajeDescuento}%`}
                  </span>
                </div>

                {/* Preference Tag if matches */}
                {isPreferred && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Coincide con tu preferencia por #{promo.categoria}</span>
                  </div>
                )}

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {promo.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {promo.descripcion}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl font-black text-emerald-400">
                    {promo.precioPromocional === 0 ? 'GRATIS' : `$${promo.precioPromocional.toLocaleString('es-AR')}`}
                  </span>
                  {promo.precioOriginal > 0 && (
                    <span className="text-xs text-slate-500 line-through">
                      ${promo.precioOriginal.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>

                {/* Technical status & Requirements */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${semaforoBg}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{promo.semaforoValidez === 'Verde' ? 'Verificado' : promo.semaforoValidez === 'Amarillo' ? 'En revisión' : 'Reportado'}</span>
                  </span>

                  {promo.requiereApp ? (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-slate-400" />
                      <span>Requiere App</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                      Sin App
                    </span>
                  )}

                  <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                    <Clock className="w-2.5 h-2.5" />
                    {promo.fechaUltimaVerificacion}
                  </span>
                </div>
              </div>

              {/* Card Footer: Action button */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
                    {promo.codigoCupon}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPromo(promo)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Ver Ficha y Canje</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Ficha Detallada del Descuento y Canje Rápido */}
      {selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPromo.marcaLogo}
                  alt={selectedPromo.marcaNombre}
                  className="w-9 h-9 object-contain"
                />
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {selectedPromo.marcaNombre}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedPromo.titulo}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPromo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-300">
              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">Precio Promocional Final</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">
                      {selectedPromo.precioPromocional === 0
                        ? 'GRATIS'
                        : `$${selectedPromo.precioPromocional.toLocaleString('es-AR')}`}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ${selectedPromo.precioOriginal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-sm border border-rose-500/30">
                    Ahorro del {selectedPromo.porcentajeDescuento}%
                  </span>
                </div>
              </div>

              {/* Description & Vigencia */}
              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs">Descripción de la Promoción:</h4>
                <p className="text-slate-300 leading-relaxed">{selectedPromo.descripcion}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  📅 Vigencia válida hasta: <strong className="text-slate-200">{selectedPromo.vigenciaHasta}</strong>
                </p>
              </div>

              {/* Letra chica / Restricciones estructuradas */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Condiciones y Letra Chica:</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedPromo.restricciones.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirement Alert if requires app */}
              {selectedPromo.requiereApp && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Atención:</strong> Esta oferta exige tener instalada la App oficial de {selectedPromo.marcaNombre}.
                  </span>
                </div>
              )}

              {/* Coupon Box & Action Canje */}
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-200 font-semibold">Código de Cupón:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-slate-900 px-3 py-1 rounded-lg text-emerald-300 border border-slate-700">
                      {selectedPromo.codigoCupon}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedPromo.codigoCupon)}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs"
                      title="Copiar código"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleCanjearDeepLink(selectedPromo)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Copiar Cupón y Abrir en {selectedPromo.marcaNombre} (Canje en 1 Toque)</span>
                </button>
              </div>

              {/* Bucle de Retroalimentación Inmediata (Feedback Loop) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold text-white block">
                  Bucle de Retroalimentación de la Comunidad:
                </span>
                <p className="text-[11px] text-slate-400">
                  ¿Probaste este cupón? Calificá para ajustar el semáforo de validez pública.
                </p>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRatePromo(selectedPromo.id, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Me funcionó ({selectedPromo.reportesPositivos})</span>
                    </button>
                    <button
                      onClick={() => handleRatePromo(selectedPromo.id, false)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>No me funcionó ({selectedPromo.reportesNegativos})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Reportar problema</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Preferencias del Usuario */}
      {isPrefModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Captura Ágil de Preferencias</span>
              </h3>
              <button
                onClick={() => setIsPrefModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Elegí hasta <strong>3 categorías</strong> favoritas para que el catálogo ordene y priorice automáticamente las ofertas que más te interesan:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {ALL_PREFERENCES.map((pref) => {
                const isSelected = userPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{pref}</span>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsPrefModalOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Guardar y Aplicar al Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reportar Problema */}
      {reportModalOpen && selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSendReport}
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Reportar Oferta Vencida o Errónea</span>
              </h3>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motivo del reporte:</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                >
                  <option value="Vencida">El cupón ya expiró o venció</option>
                  <option value="DatoIncorrecto">El precio o descuento no coincide</option>
                  <option value="RechazadoEnLocal">No me lo aceptaron en el local</option>
                  <option value="Otro">Otro problema</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detalle adicional (opcional):</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Fui a la sucursal de Córdoba Shopping y me dijeron que no aplica..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
              >
                Enviar Reporte
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
