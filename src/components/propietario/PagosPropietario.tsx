"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Banknote, CreditCard, User, Home, Calendar, BadgeCheck, X, Info, Search, ChevronLeft, ChevronRight } from "lucide-react";

const mockPagos = [
  { id: 1, inquilino: "Juan Pérez", propiedad: "Apartamento en Bogotá", fecha: "2024-05-10", monto: 1200000, metodo: "Wompi" },
  { id: 2, inquilino: "Ana Gómez", propiedad: "Casa en Medellín", fecha: "2024-05-05", monto: 2500000, metodo: "Transferencia" },
  { id: 3, inquilino: "Juan Pérez", propiedad: "Apartamento en Bogotá", fecha: "2024-04-10", monto: 1200000, metodo: "Wompi" },
];

export default function PagosPropietario() {
  const [pagos] = useState(mockPagos);
  const [filtroInquilino, setFiltroInquilino] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalPago, setModalPago] = useState<any>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [pagina, setPagina] = useState(1);
  const PAGE_SIZE = 5;

  const inquilinos = Array.from(new Set(pagos.map(p => p.inquilino)));
  const propiedades = Array.from(new Set(pagos.map(p => p.propiedad)));
  const metodos = Array.from(new Set(pagos.map(p => p.metodo)));

  const pagosFiltrados = pagos.filter(p =>
    (filtroInquilino ? p.inquilino === filtroInquilino : true) &&
    (filtroPropiedad ? p.propiedad === filtroPropiedad : true) &&
    (filtroMetodo ? p.metodo === filtroMetodo : true) &&
    (
      !busqueda ||
      p.inquilino.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.propiedad.toLowerCase().includes(busqueda.toLowerCase())
    ) &&
    (
      (!fechaDesde || p.fecha >= fechaDesde) &&
      (!fechaHasta || p.fecha <= fechaHasta)
    )
  );
  const totalPaginas = Math.ceil(pagosFiltrados.length / PAGE_SIZE) || 1;
  const pagosPagina = pagosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Resúmenes
  const totalPagos = pagosFiltrados.reduce((acc, p) => acc + p.monto, 0);
  const totalWompi = pagosFiltrados.filter(p => p.metodo === "Wompi").reduce((acc, p) => acc + p.monto, 0);
  const totalTransfer = pagosFiltrados.filter(p => p.metodo === "Transferencia").reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Resumen visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow flex items-center gap-3 p-4 border border-blue-200">
          <Banknote className="w-7 h-7 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-blue-700">${totalPagos.toLocaleString("es-CO")}</div>
            <div className="text-xs text-neutral-500">Total recibido</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl shadow flex items-center gap-3 p-4 border border-green-200">
          <CreditCard className="w-7 h-7 text-green-600" />
          <div>
            <div className="text-lg font-bold text-green-700">${totalWompi.toLocaleString("es-CO")}</div>
            <div className="text-xs text-neutral-500">Por Wompi</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl shadow flex items-center gap-3 p-4 border border-yellow-200">
          <Banknote className="w-7 h-7 text-yellow-600" />
          <div>
            <div className="text-lg font-bold text-yellow-700">${totalTransfer.toLocaleString("es-CO")}</div>
            <div className="text-xs text-neutral-500">Por Transferencia</div>
          </div>
        </div>
      </div>
      {/* Filtros y título */}
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-3"><BadgeCheck className="w-5 h-5 text-blue-600" /> Pagos recibidos</h2>
        <div className="w-full overflow-x-auto">
          <div className="flex gap-4 flex-nowrap bg-white/80 rounded-xl p-3 border border-blue-100 shadow-sm items-end min-w-[700px]">
            {/* Búsqueda por texto */}
            <div className="flex flex-col min-w-[180px]">
              <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Search className="w-4 h-4 text-blue-400" /> Buscar</label>
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Inquilino o propiedad..."
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-sm shadow-sm"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-blue-300"><Search className="w-4 h-4" /></span>
              </div>
            </div>
            {/* Filtro inquilino */}
            <div className="flex flex-col min-w-[160px]">
              <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><User className="w-4 h-4 text-blue-400" /> Inquilino</label>
              <div className="relative">
                <select
                  value={filtroInquilino}
                  onChange={e => setFiltroInquilino(e.target.value)}
                  className="appearance-none w-full border border-blue-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-sm shadow-sm"
                >
                  <option value="">Todos</option>
                  {inquilinos.map(i => <option key={i}>{i}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-blue-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </div>
            </div>
            {/* Filtro propiedad */}
            <div className="flex flex-col min-w-[160px]">
              <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Home className="w-4 h-4 text-green-400" /> Propiedad</label>
              <div className="relative">
                <select
                  value={filtroPropiedad}
                  onChange={e => setFiltroPropiedad(e.target.value)}
                  className="appearance-none w-full border border-green-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 transition text-sm shadow-sm"
                >
                  <option value="">Todas</option>
                  {propiedades.map(p => <option key={p}>{p}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-green-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </div>
            </div>
            {/* Filtro método de pago */}
            <div className="flex flex-col min-w-[160px]">
              <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><CreditCard className="w-4 h-4 text-green-600" /> Método</label>
              <div className="relative">
                <select
                  value={filtroMetodo}
                  onChange={e => setFiltroMetodo(e.target.value)}
                  className="appearance-none w-full border border-green-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 transition text-sm shadow-sm"
                >
                  <option value="">Todos</option>
                  {metodos.map(m => <option key={m}>{m}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-green-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </div>
            </div>
            {/* Filtro por fecha */}
            <div className="flex flex-col min-w-[140px]">
              <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Calendar className="w-4 h-4 text-yellow-400" /> Desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={e => { setFechaDesde(e.target.value); setPagina(1); }}
                className="w-full border border-yellow-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition text-sm shadow-sm"
              />
            </div>
            <div className="flex flex-col min-w-[140px]">
              <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Calendar className="w-4 h-4 text-yellow-400" /> Hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={e => { setFechaHasta(e.target.value); setPagina(1); }}
                className="w-full border border-yellow-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition text-sm shadow-sm"
              />
            </div>
            {/* Botón limpiar filtros */}
            <div className="flex flex-col justify-end">
              <Button
                variant="ghost"
                className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg border border-blue-100"
                onClick={() => { setFiltroInquilino(""); setFiltroPropiedad(""); setFiltroMetodo(""); setBusqueda(""); setFechaDesde(""); setFechaHasta(""); setPagina(1); }}
                type="button"
              >
                <X className="w-4 h-4 mr-1" /> Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Tabla moderna */}
      <div className="overflow-x-auto rounded-xl shadow border border-neutral-100 bg-white">
        <table className="min-w-full text-sm align-middle">
          <thead className="bg-gradient-to-r from-blue-50 to-white">
            <tr>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Inquilino</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Propiedad</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Fecha</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Monto</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Método</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosPagina.map((pago, idx) => (
              <tr key={pago.id} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"}>
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle"><span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400 shrink-0" /> {pago.inquilino}</span></td>
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle"><span className="flex items-center gap-2"><Home className="w-4 h-4 text-green-400 shrink-0" /> {pago.propiedad}</span></td>
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle"><span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-yellow-400 shrink-0" /> {pago.fecha}</span></td>
                <td className="px-4 py-3 border-b font-bold text-green-700 whitespace-nowrap align-middle">${pago.monto.toLocaleString("es-CO")}</td>
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${pago.metodo === "Wompi" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {pago.metodo === "Wompi" ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />} {pago.metodo}
                  </span>
                </td>
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle">
                  <Button size="sm" variant="outline" onClick={() => setModalPago(pago)}><Info className="w-4 h-4 mr-1" />Ver detalle</Button>
                </td>
              </tr>
            ))}
            {pagosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-neutral-400 py-4">No hay pagos para los filtros seleccionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 my-6">
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}><ChevronLeft className="w-4 h-4" /> Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente <ChevronRight className="w-4 h-4" /></Button>
      </div>
      {/* Modal de detalle */}
      {modalPago && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-blue-100 relative animate-in fade-in duration-200">
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-blue-600 text-xl" onClick={() => setModalPago(null)} aria-label="Cerrar"><X /></button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-700"><BadgeCheck className="w-5 h-5" /> Detalle del pago</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /><b>Inquilino:</b> <span className="text-neutral-700">{modalPago.inquilino}</span></div>
              <div className="flex items-center gap-2"><Home className="w-4 h-4 text-green-400" /><b>Propiedad:</b> <span className="text-neutral-700">{modalPago.propiedad}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-yellow-400" /><b>Fecha:</b> <span className="text-neutral-700">{modalPago.fecha}</span></div>
              <div className="flex items-center gap-2"><Banknote className="w-4 h-4 text-green-700" /><b>Monto:</b> <span className="text-green-700 font-bold">${modalPago.monto.toLocaleString("es-CO")}</span></div>
              <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-green-600" /><b>Método:</b> <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${modalPago.metodo === "Wompi" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{modalPago.metodo === "Wompi" ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />} {modalPago.metodo}</span></div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setModalPago(null)}><X className="w-4 h-4 mr-1" />Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
