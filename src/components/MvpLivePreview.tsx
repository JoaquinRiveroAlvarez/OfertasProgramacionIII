import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Zap,
  CheckCheck,
  Compass,
  ArrowUpRight,
  ShoppingCart,
  Truck,
  CreditCard,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  CATALOGO_DESCUENTOS_INICIAL,
  PromocionItem,
  MarcaNombre,
  CategoriaPromo
} from '../data/mockPromociones';

// Helper for safe clipboard copying in iframes
async function copyToClipboardSafe(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback for restricted iframe contexts
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

// Brand Logo Component with robust fallback
const BrandLogo: React.FC<{ marca: MarcaNombre; logoUrl: string; size?: string }> = ({
  marca,
  logoUrl,
  size = 'w-8 h-8'
}) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !logoUrl) {
    if (marca === 'Betos Lomitos') {
      return (
        <div className={`${size} rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0 border border-amber-400/30`}>
          BETOS
        </div>
      );
    }
    if (marca === 'PedidosYa') {
      return (
        <div className={`${size} rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0 border border-red-400/30`}>
          PEYA
        </div>
      );
    }
    if (marca === 'Rappi') {
      return (
        <div className={`${size} rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0 border border-orange-400/30`}>
          RAPPI
        </div>
      );
    }
    if (marca === 'Lomiterías 2x1') {
      return (
        <div className={`${size} rounded-xl bg-yellow-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shrink-0 border border-yellow-400/30`}>
          2x1
        </div>
      );
    }
    if (marca === "McDonald's") {
      return (
        <div className={`${size} rounded-xl bg-red-600 flex items-center justify-center text-amber-300 font-black text-sm shadow-md shrink-0`}>
          M
        </div>
      );
    }
    if (marca === 'Burger King') {
      return (
        <div className={`${size} rounded-xl bg-amber-500 flex items-center justify-center text-red-950 font-black text-xs shadow-md shrink-0`}>
          BK
        </div>
      );
    }
    if (marca === 'KFC') {
      return (
        <div className={`${size} rounded-xl bg-red-700 flex items-center justify-center text-white font-black text-xs tracking-tighter shadow-md shrink-0 border border-red-500/40`}>
          KFC
        </div>
      );
    }
    if (marca === "Wendy's") {
      return (
        <div className={`${size} rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0`}>
          W
        </div>
      );
    }
    if (marca === 'Subway') {
      return (
        <div className={`${size} rounded-xl bg-emerald-600 flex items-center justify-center text-amber-300 font-black text-xs shadow-md shrink-0`}>
          SUB
        </div>
      );
    }
    return (
      <div className={`${size} rounded-xl bg-rose-700 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0`}>
        M
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={marca}
      onError={() => setImgError(true)}
      className={`${size} object-contain rounded-lg shrink-0`}
    />
  );
};

export const MvpLivePreview: React.FC = () => {
  const [promos, setPromos] = useState<PromocionItem[]>(CATALOGO_DESCUENTOS_INICIAL);
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedBenefit, setSelectedBenefit] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected promo for full conditions modal
  const [selectedPromo, setSelectedPromo] = useState<PromocionItem | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);
  const [modalCopiedCode, setModalCopiedCode] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  const BRAND_OPTIONS = [
    'Todas',
    'Betos Lomitos',
    'PedidosYa',
    'Rappi',
    'Lomiterías 2x1',
    'KFC',
    "McDonald's",
    'Burger King',
    'Mostaza',
    "Wendy's",
    'Subway'
  ];

  const CATEGORY_OPTIONS: (string | CategoriaPromo)[] = [
    'Todas',
    'Lomitos & Sándwiches',
    'Hamburguesas',
    'Combos',
    'Pollo',
    'Postres & Helados'
  ];

  const BENEFIT_OPTIONS = ['Todos', '2x1', 'Porcentaje', 'PrecioFinal'];

  const handleCopyCode = async (promoId: number, code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const ok = await copyToClipboardSafe(code);
    if (ok) {
      setCopiedCodeId(promoId);
      setTimeout(() => setCopiedCodeId(null), 2500);
    }
  };

  const handleCopyModalCode = async (code: string) => {
    const ok = await copyToClipboardSafe(code);
    if (ok) {
      setModalCopiedCode(true);
      setTimeout(() => setModalCopiedCode(false), 2500);
    }
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
          semaforoValidez: newSemaforo
        };
      })
    );

    if (selectedPromo && selectedPromo.id === promoId) {
      setSelectedPromo((prev) =>
        prev
          ? {
              ...prev,
              reportesPositivos: isPositive ? prev.reportesPositivos + 1 : prev.reportesPositivos,
              reportesNegativos: !isPositive ? prev.reportesNegativos + 1 : prev.reportesNegativos
            }
          : null
      );
    }

    setFeedbackSuccessMsg(
      isPositive
        ? '¡Gracias! Tu confirmación valida este cupón online para la comunidad.'
        : 'Reporte registrado. Revisaremos la vigencia de este cupón online.'
    );
    setTimeout(() => setFeedbackSuccessMsg(null), 3000);
  };

  // Filter promos
  const filteredPromos = promos.filter((p) => {
    if (selectedBrand !== 'Todas' && p.marcaNombre !== selectedBrand) {
      return false;
    }
    if (selectedCategory !== 'Todas' && p.categoria !== selectedCategory) {
      return false;
    }
    if (selectedBenefit !== 'Todos' && p.tipoBeneficio !== selectedBenefit) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchText =
        p.titulo.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.marcaNombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q) ||
        p.seccionNombre.toLowerCase().includes(q) ||
        (p.codigoCupon && p.codigoCupon.toLowerCase().includes(q)) ||
        p.condiciones.mediosDePago.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackSuccessMsg}</span>
        </div>
      )}

      {/* Main App Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Exclusivo Compras Online & Delivery en Argentina</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Cazador de Descuentos</span>
              <span className="text-2xl">🏷️</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Encontrá ofertas reales, 2x1 en lomitos y cupones verificados para comprar online en{' '}
              <strong className="text-white">Betos Lomitos</strong>,{' '}
              <strong className="text-white">PedidosYa</strong>,{' '}
              <strong className="text-white">Rappi</strong>,{' '}
              <strong className="text-white">KFC</strong>,{' '}
              <strong className="text-white">Mostaza</strong>,{' '}
              <strong className="text-white">Burger King</strong> y más. Sin simuladores presenciales ni demoras: con todas las condiciones y precios detallados.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-2xl font-black text-emerald-400 block">
                {promos.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Ofertas Online Activas
              </span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-2xl font-black text-indigo-400 block">
                Hasta 50%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Ahorro en 2x1 y Combos
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por lomito 2x1, Betos, PedidosYa, hamburguesa, cupón o comida..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Brand Filters Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
            Filtrar por Tienda o Plataforma Online:
          </span>
          <span>{filteredPromos.length} ofertas encontradas</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BRAND_OPTIONS.map((brand) => {
            const isSelected = selectedBrand === brand;
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {brand === 'Todas' ? (
                  <span>Todas las Tiendas</span>
                ) : (
                  <>
                    <span>{brand}</span>
                    {brand.includes('2x1') && (
                      <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] rounded font-black">
                        HOT
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-slate-500" />
          Categoría:
        </span>
        {CATEGORY_OPTIONS.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                isSelected
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}

        <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

        <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-500" />
          Beneficio:
        </span>
        {BENEFIT_OPTIONS.map((ben) => {
          const isSelected = selectedBenefit === ben;
          return (
            <button
              key={ben}
              onClick={() => setSelectedBenefit(ben)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                isSelected
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ben === 'Todos' ? 'Todos los beneficios' : ben}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPromos.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No se encontraron ofertas con estos filtros</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Probá quitando el término de búsqueda o seleccionando "Todas las Tiendas".
          </p>
          <button
            onClick={() => {
              setSelectedBrand('Todas');
              setSelectedCategory('Todas');
              setSelectedBenefit('Todos');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Grid of Online Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPromos.map((promo) => {
          const hasMultiplePrices = Boolean(promo.variantesPrecios && promo.variantesPrecios.length > 1);

          return (
            <div
              key={promo.id}
              onClick={() => setSelectedPromo(promo)}
              className="group cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all hover:-translate-y-1 hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                {/* Brand & Badge Top Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BrandLogo marca={promo.marcaNombre} logoUrl={promo.marcaLogo} size="w-8 h-8" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {promo.marcaNombre}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {promo.nombrePlataforma}
                      </span>
                    </div>
                  </div>

                  {/* Benefit Pill */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold shrink-0 border ${promo.marcaBgBadge}`}>
                    {promo.tipoBeneficio === '2x1'
                      ? '2x1 ONLINE'
                      : promo.tipoBeneficio === 'Porcentaje'
                      ? `${promo.porcentajeDescuento}% OFF`
                      : 'PRECIO ESPECIAL'}
                  </span>
                </div>

                {/* Offer Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                    {promo.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {promo.descripcion}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-emerald-400">
                        ${promo.precioPromocional.toLocaleString('es-AR')}
                      </span>
                      {promo.precioOriginal > 0 && (
                        <span className="text-xs text-slate-500 line-through">
                          ${promo.precioOriginal.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Ahorrás ${(promo.precioOriginal - promo.precioPromocional).toLocaleString('es-AR')}
                    </span>
                  </div>

                  {hasMultiplePrices && (
                    <div className="text-[10px] text-indigo-300 font-medium flex items-center gap-1 pt-1 border-t border-slate-900">
                      <Tag className="w-3 h-3" />
                      <span>{promo.variantesPrecios?.length} precios según delivery / take away</span>
                    </div>
                  )}
                </div>

                {/* Conditions Summary */}
                <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-1.5 truncate">
                    <Truck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{promo.condiciones.modalidad}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{promo.condiciones.mediosDePago}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{promo.condiciones.diasValidos}</span>
                  </div>
                </div>

                {/* Code Box or Direct Cart Banner */}
                {promo.requiereCodigo && promo.codigoCupon ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                        Código Necesario:
                      </span>
                      <span className="font-mono text-xs font-black text-indigo-300 tracking-wider">
                        {promo.codigoCupon}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(promo.id, promo.codigoCupon!, e)}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors shrink-0"
                      title="Copiar cupón"
                    >
                      {copiedCodeId === promo.id ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                          <span className="text-emerald-300">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>Aplica directo en carrito (Sin código manual)</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPromo(promo);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ver Condiciones</span>
                </button>

                <a
                  href={promo.urlTiendaOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                  title="Abrir tienda para comprar online"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Comprar Online</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Full Conditions & Multi-price details for Online Shopping */}
      {selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center gap-3">
                <BrandLogo marca={selectedPromo.marcaNombre} logoUrl={selectedPromo.marcaLogo} size="w-10 h-10" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      {selectedPromo.marcaNombre}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedPromo.condiciones.modalidad}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedPromo.titulo}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPromo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-300">
              {/* Top Action Banner: Direct Online Purchase */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-indigo-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>Tienda / Plataforma de Compra Online:</span>
                  </span>
                  <p className="text-sm text-white font-bold">
                    {selectedPromo.nombrePlataforma}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {selectedPromo.urlTiendaOnline}
                  </p>
                </div>

                <a
                  href={selectedPromo.urlTiendaOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ir a Comprar Online</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Coupon Code Section */}
              {selectedPromo.requiereCodigo && selectedPromo.codigoCupon ? (
                <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/40 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    <span>Código de Descuento para el Checkout:</span>
                  </span>
                  <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                      {selectedPromo.codigoCupon}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyModalCode(selectedPromo.codigoCupon!)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      {modalCopiedCode ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-emerald-300" />
                          <span>¡Código Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pegá este código en el campo "¿Tenés un cupón o descuento?" antes de pagar en la tienda.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Descuento Automático:</strong> Esta oferta no requiere código. Se descuenta automáticamente en el carrito de compras al seleccionar los productos de la promo.
                  </span>
                </div>
              )}

              {/* Different Prices Table (Distintos Precios si los hubiera) */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Precios y Opciones Disponibles:</span>
                </h4>

                {selectedPromo.variantesPrecios && selectedPromo.variantesPrecios.length > 0 ? (
                  <div className="space-y-2">
                    {selectedPromo.variantesPrecios.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-white font-semibold block text-xs">
                            {v.nombre}
                          </span>
                          {v.detalle && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {v.detalle}
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-emerald-400 block">
                            ${v.precio.toLocaleString('es-AR')}
                          </span>
                          {v.precioOriginal && (
                            <span className="text-[11px] text-slate-500 line-through block">
                              ${v.precioOriginal.toLocaleString('es-AR')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Precio Promocional Único</span>
                      <span className="text-base font-black text-emerald-400">
                        ${selectedPromo.precioPromocional.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[11px] block">Precio Regular</span>
                      <span className="text-xs text-slate-500 line-through">
                        ${selectedPromo.precioOriginal.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* All Purchase Conditions (Todas las Condiciones) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Condiciones de la Oferta Online:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium">Compra Mínima:</span>
                    <span className="text-white font-bold">{selectedPromo.condiciones.compraMinima}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium">Días y Horarios:</span>
                    <span className="text-white font-bold">{selectedPromo.condiciones.diasValidos}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium">Medios de Pago Online:</span>
                    <span className="text-white font-bold">{selectedPromo.condiciones.mediosDePago}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block font-medium">Zonas de Alcance:</span>
                    <span className="text-white font-bold">{selectedPromo.condiciones.alcanceZona}</span>
                  </div>
                </div>

                {selectedPromo.condiciones.limitePorUsuario && (
                  <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    ⚠️ {selectedPromo.condiciones.limitePorUsuario}
                  </p>
                )}

                {/* Additional Terms */}
                {selectedPromo.terminosYCondiciones.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Términos adicionales:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                      {selectedPromo.terminosYCondiciones.map((term, i) => (
                        <li key={i}>{term}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Step by Step Online Purchase Guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>Pasos para Comprar Online con este Descuento:</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedPromo.pasosCompraOnline.map((paso, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{paso}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Rating */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">¿Te sirvió esta oferta?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRatePromo(selectedPromo.id, true)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg border border-slate-800 flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Funciona ({selectedPromo.reportesPositivos})</span>
                    </button>
                    <button
                      onClick={() => handleRatePromo(selectedPromo.id, false)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-lg border border-slate-800 flex items-center gap-1"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Falló ({selectedPromo.reportesNegativos})</span>
                    </button>
                  </div>
                </div>

                <span className="text-slate-500 text-[10px]">
                  Vigencia: {selectedPromo.vigenciaHasta}
                </span>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPromo(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                Cerrar
              </button>

              <a
                href={selectedPromo.urlTiendaOnline}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ir a Comprar en {selectedPromo.nombrePlataforma}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
