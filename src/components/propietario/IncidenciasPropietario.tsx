"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div>
      <h2 className="text-xl font-bold mb-4">Incidencias</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-xs mb-1">Estado</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="border rounded px-2 py-1">
            <option value="">Todos</option>
            {estados.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Propiedad</label>
          <select value={filtroPropiedad} onChange={e => setFiltroPropiedad(e.target.value)} className="border rounded px-2 py-1">
            <option value="">Todas</option>
            {propiedades.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Buscar por texto..."
          />
        </div>
        <Button onClick={exportarCSV} className="h-9">Exportar a CSV</Button>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Resumen de incidencias</h3>
        <div className="flex gap-6">
          {resumen.map(r => (
            <div key={r.estado} className="bg-neutral-100 rounded p-4 text-center min-w-[120px]">
              <div className="text-lg font-bold">{r.cantidad}</div>
              <div className="text-xs text-neutral-600">{r.estado}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Propiedad</th>
              <th className="px-4 py-2 border-b">Tipo</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incidenciasPagina.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-2 border-b">{i.propiedad}</td>
                <td className="px-4 py-2 border-b">{i.tipo}</td>
                <td className="px-4 py-2 border-b">{i.descripcion}</td>
                <td className="px-4 py-2 border-b">{i.estado}</td>
                <td className="px-4 py-2 border-b">{i.fecha}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalIncidencia(i)}>Ver</Button>
                  {i.estado !== "Resuelta" && (
                    <Button size="sm" onClick={() => setIncidencias(prev => prev.map(x => x.id === i.id ? { ...x, estado: "Resuelta" } : x))}>Marcar resuelta</Button>
                  )}
                </td>
              </tr>
            ))}
            {incidenciasPagina.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-neutral-400 py-4">No hay incidencias para los filtros/búsqueda seleccionados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 my-4">
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</Button>
      </div>
      {modalIncidencia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Detalle de la incidencia</h3>
            <p><b>Propiedad:</b> {modalIncidencia.propiedad}</p>
            <p><b>Tipo:</b> {modalIncidencia.tipo}</p>
            <p><b>Descripción:</b> {modalIncidencia.descripcion}</p>
            <p><b>Estado:</b> {modalIncidencia.estado}</p>
            <p><b>Fecha:</b> {modalIncidencia.fecha}</p>
            {modalIncidencia.imagen && (
              <div className="my-2">
                <b>Imagen adjunta:</b>
                <img src={modalIncidencia.imagen} alt="Incidencia" className="mt-1 rounded border w-32 h-20 object-cover" />
              </div>
            )}
            {modalIncidencia.respuesta && (
              <p className="mt-2"><b>Respuesta:</b> {modalIncidencia.respuesta}</p>
            )}
            {modalIncidencia.estado !== "Resuelta" && (
              <div className="mt-4">
                <label className="block mb-1 text-sm font-medium">Responder incidencia</label>
                <textarea
                  className="w-full border rounded px-3 py-2 mb-2"
                  value={respuesta}
                  onChange={e => setRespuesta(e.target.value)}
                  placeholder="Escribe una respuesta para el inquilino"
                />
                <Button size="sm" onClick={() => {
                  setIncidencias(prev => prev.map(x => x.id === modalIncidencia.id ? { ...x, respuesta } : x));
                  setModalIncidencia(null);
                  setRespuesta("");
                }} disabled={!respuesta}>Enviar respuesta</Button>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setModalIncidencia(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
