"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Home, AlertTriangle, CheckCircle, Calendar, FileText, X, ChevronLeft, ChevronRight, Image as ImageIcon, MessageCircle } from "lucide-react";

const mockIncidencias = [
  { id: 1, propiedad: "Apartamento en Bogotá", tipo: "Daño en baño", descripcion: "El lavamanos está goteando.", estado: "Pendiente", fecha: "2024-05-10", respuesta: "", imagen: "https://via.placeholder.com/120x80?text=Baño" },
  { id: 2, propiedad: "Casa en Medellín", tipo: "Fuga de gas", descripcion: "Se percibe olor a gas en la cocina.", estado: "Resuelta", fecha: "2024-04-22", respuesta: "Se envió técnico y se solucionó.", imagen: "https://via.placeholder.com/120x80?text=Cocina" },
  { id: 3, propiedad: "Apartamento en Bogotá", tipo: "Ruido excesivo", descripcion: "Vecinos hacen ruido en la noche.", estado: "Pendiente", fecha: "2024-05-12", respuesta: "", imagen: "" },
];

const PAGE_SIZE = 5;

export default function IncidenciasPropietario() {
  const [incidencias, setIncidencias] = useState(mockIncidencias);
  const [modalIncidencia, setModalIncidencia] = useState<any>(null);
  const [respuesta, setRespuesta] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const propiedades = Array.from(new Set(incidencias.map(i => i.propiedad)));
  const estados = ["Pendiente", "Resuelta"];

  const incidenciasFiltradas = incidencias.filter(i =>
    (filtroEstado ? i.estado === filtroEstado : true) &&
    (filtroPropiedad ? i.propiedad === filtroPropiedad : true) &&
    (busqueda ? (
      i.propiedad.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const resumen = estados.map(e => ({
    estado: e,
    cantidad: incidencias.filter(i => i.estado === e).length
  }));

  function exportarCSV() {
    const rows = [
      ["Propiedad", "Tipo", "Descripción", "Estado", "Fecha", "Respuesta"],
      ...incidenciasFiltradas.map(i => [i.propiedad, i.tipo, i.descripcion, i.estado, i.fecha, i.respuesta])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "incidencias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Paginación
  const totalPaginas = Math.ceil(incidenciasFiltradas.length / PAGE_SIZE) || 1;
  const incidenciasPagina = incidenciasFiltradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-yellow-500" /> Incidencias</h2>
      {/* Filtros */}
      <div className="mb-4 w-full overflow-x-auto">
        <div className="flex gap-4 flex-nowrap bg-white/80 rounded-xl p-3 border border-yellow-100 shadow-sm items-end min-w-[600px]">
          {/* Filtro estado */}
          <div className="flex flex-col min-w-[140px]">
            <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Estado</label>
            <div className="relative">
              <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="appearance-none w-full border border-green-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 transition text-sm shadow-sm">
                <option value="">Todos</option>
                {estados.map(e => <option key={e}>{e}</option>)}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-green-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
          </div>
          {/* Filtro propiedad */}
          <div className="flex flex-col min-w-[160px]">
            <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Home className="w-4 h-4 text-blue-400" /> Propiedad</label>
            <div className="relative">
              <select value={filtroPropiedad} onChange={e => { setFiltroPropiedad(e.target.value); setPagina(1); }} className="appearance-none w-full border border-blue-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition text-sm shadow-sm">
                <option value="">Todas</option>
                {propiedades.map(p => <option key={p}>{p}</option>)}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-blue-300"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            </div>
          </div>
          {/* Búsqueda por texto */}
          <div className="flex flex-col min-w-[180px]">
            <label className="block text-xs mb-1 font-semibold text-neutral-600 flex items-center gap-1"><Search className="w-4 h-4 text-yellow-400" /> Buscar</label>
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
                className="w-full border border-yellow-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-200 transition text-sm shadow-sm"
                placeholder="Buscar por texto..."
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-yellow-300"><Search className="w-4 h-4" /></span>
            </div>
          </div>
          {/* Exportar CSV */}
          <div className="flex flex-col justify-end">
            <Button onClick={exportarCSV} className="h-9 bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900 font-semibold border border-yellow-300 shadow-sm"><FileText className="w-4 h-4 mr-1" /> Exportar CSV</Button>
          </div>
        </div>
      </div>
      {/* Resumen visual */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Resumen de incidencias</h3>
        <div className="flex gap-6">
          {resumen.map(r => (
            <div key={r.estado} className={`rounded-xl p-4 text-center min-w-[120px] shadow border ${r.estado === "Pendiente" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
              <div className={`text-lg font-bold flex items-center justify-center gap-1 ${r.estado === "Pendiente" ? "text-yellow-600" : "text-green-700"}`}>
                {r.estado === "Pendiente" ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />} {r.cantidad}
              </div>
              <div className="text-xs text-neutral-600 mt-1">
                <span className={`inline-block px-2 py-1 rounded font-semibold ${r.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{r.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tabla moderna */}
      <div className="overflow-x-auto rounded-xl shadow border border-neutral-100 bg-white">
        <table className="min-w-full text-sm align-middle">
          <thead className="bg-gradient-to-r from-yellow-50 to-white">
            <tr>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Propiedad</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Tipo</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Descripción</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Estado</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Fecha</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Imagen</th>
              <th className="px-4 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incidenciasPagina.map((i) => (
              <tr key={i.id} className="even:bg-yellow-50/40">
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle"><span className="flex items-center gap-2"><Home className="w-4 h-4 text-blue-400 shrink-0" /> {i.propiedad}</span></td>
                <td className="px-4 py-3 border-b whitespace-nowrap align-middle"><span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" /> {i.tipo}</span></td>
                <td className="px-4 py-3 border-b align-middle">{i.descripcion}</td>
                <td className="px-4 py-3 border-b align-middle">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${i.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {i.estado === "Pendiente" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />} {i.estado}
                  </span>
                </td>
                <td className="px-4 py-3 border-b align-middle"><span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-yellow-400 shrink-0" /> {i.fecha}</span></td>
                <td className="px-4 py-3 border-b align-middle">
                  {i.imagen ? (
                    <img src={i.imagen} alt="Incidencia" className="rounded border w-16 h-12 object-cover" />
                  ) : (
                    <span className="text-neutral-300 flex items-center gap-1"><ImageIcon className="w-5 h-5" /> Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-3 border-b align-middle flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalIncidencia(i)}><FileText className="w-4 h-4 mr-1" />Ver</Button>
                  {i.estado !== "Resuelta" && (
                    <Button size="sm" onClick={() => setIncidencias(prev => prev.map(x => x.id === i.id ? { ...x, estado: "Resuelta" } : x))}><CheckCircle className="w-4 h-4 mr-1" />Marcar resuelta</Button>
                  )}
                </td>
              </tr>
            ))}
            {incidenciasPagina.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-neutral-400 py-4">No hay incidencias para los filtros/búsqueda seleccionados.</td>
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
      {modalIncidencia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-yellow-100 relative animate-in fade-in duration-200">
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-yellow-600 text-xl" onClick={() => setModalIncidencia(null)} aria-label="Cerrar"><X /></button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-700"><AlertTriangle className="w-5 h-5" /> Detalle de la incidencia</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Home className="w-4 h-4 text-blue-400" /><b>Propiedad:</b> <span className="text-neutral-700">{modalIncidencia.propiedad}</span></div>
              <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /><b>Tipo:</b> <span className="text-neutral-700">{modalIncidencia.tipo}</span></div>
              <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-neutral-400" /><b>Descripción:</b> <span className="text-neutral-700">{modalIncidencia.descripcion}</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><b>Estado:</b> <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${modalIncidencia.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{modalIncidencia.estado === "Pendiente" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />} {modalIncidencia.estado}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-yellow-400" /><b>Fecha:</b> <span className="text-neutral-700">{modalIncidencia.fecha}</span></div>
              {modalIncidencia.imagen && (
                <div className="my-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-neutral-400" />
                  <b>Imagen adjunta:</b>
                  <img src={modalIncidencia.imagen} alt="Incidencia" className="rounded border w-32 h-20 object-cover ml-2" />
                </div>
              )}
              {modalIncidencia.respuesta && (
                <div className="flex items-center gap-2 mt-2"><MessageCircle className="w-4 h-4 text-blue-400" /><b>Respuesta:</b> <span className="text-neutral-700">{modalIncidencia.respuesta}</span></div>
              )}
            </div>
            {modalIncidencia.estado !== "Resuelta" && (
              <div className="mt-4">
                <label className="block mb-1 text-sm font-medium">Responder incidencia</label>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  value={respuesta}
                  onChange={e => setRespuesta(e.target.value)}
                  placeholder="Escribe una respuesta para el inquilino"
                />
                <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900 font-semibold border border-yellow-300 shadow-sm" onClick={() => {
                  setIncidencias(prev => prev.map(x => x.id === modalIncidencia.id ? { ...x, respuesta } : x));
                  setModalIncidencia(null);
                  setRespuesta("");
                }} disabled={!respuesta}><MessageCircle className="w-4 h-4 mr-1" />Enviar respuesta</Button>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setModalIncidencia(null)}><X className="w-4 h-4 mr-1" />Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
