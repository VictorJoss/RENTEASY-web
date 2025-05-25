"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Search, User, FileText, Settings, AlertTriangle, MessageSquare, XCircle } from "lucide-react";

const mockRegistros = [
  { id: 1, usuario: "Juan Pérez", accion: "Inicio de sesión", tipo: "sesion", fecha: "2024-03-10 15:30", detalles: "Inicio de sesión exitoso" },
  { id: 2, usuario: "Ana Torres", accion: "Actualización de perfil", tipo: "perfil", fecha: "2024-03-10 14:20", detalles: "Actualización de información personal" },
  { id: 3, usuario: "Carlos López", accion: "Creación de contrato", tipo: "contrato", fecha: "2024-03-10 13:15", detalles: "Nuevo contrato #12345" },
  { id: 4, usuario: "María García", accion: "Reporte de incidencia", tipo: "incidencia", fecha: "2024-03-10 12:45", detalles: "Reporte de problema técnico" },
  { id: 5, usuario: "Admin", accion: "Configuración del sistema", tipo: "sistema", fecha: "2024-03-10 11:30", detalles: "Actualización de parámetros" },
];

const PAGE_SIZE = 10;

export default function Auditoria() {
  const [registros, setRegistros] = useState(mockRegistros);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalDetalles, setModalDetalles] = useState<any>(null);

  const tipos = [
    { id: "sesion", label: "Sesión", icon: <User size={16} /> },
    { id: "perfil", label: "Perfil", icon: <User size={16} /> },
    { id: "contrato", label: "Contrato", icon: <FileText size={16} /> },
    { id: "incidencia", label: "Incidencia", icon: <AlertTriangle size={16} /> },
    { id: "sistema", label: "Sistema", icon: <Settings size={16} /> },
    { id: "soporte", label: "Soporte", icon: <MessageSquare size={16} /> },
  ];

  const registrosFiltrados = registros.filter(r =>
    (filtroTipo ? r.tipo === filtroTipo : true) &&
    (busqueda ? (
      r.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.detalles.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const totalPaginas = Math.ceil(registrosFiltrados.length / PAGE_SIZE) || 1;
  const registrosPagina = registrosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const getIconoTipo = (tipo: string) => {
    return tipos.find(t => t.id === tipo)?.icon || <User size={16} />;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Auditoría del sistema</h2>
      {/* Filtros */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Tipo de acción</label>
          <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todos</option>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            className="border rounded px-2 py-1 min-w-[160px]"
            placeholder="Usuario, acción o detalles..."
          />
        </div>
      </div>
      {/* Tabla de registros */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-sm md:text-base">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b text-left">Usuario</th>
              <th className="px-4 py-2 border-b text-left">Acción</th>
              <th className="px-4 py-2 border-b text-left">Tipo</th>
              <th className="px-4 py-2 border-b text-left">Fecha</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registrosPagina.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-blue-50/40">
                <td className="px-4 py-2 border-b">{r.usuario}</td>
                <td className="px-4 py-2 border-b">{r.accion}</td>
                <td className="px-4 py-2 border-b">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-semibold bg-neutral-100 text-neutral-700 border-neutral-300">
                    {getIconoTipo(r.tipo)}
                    {tipos.find(t => t.id === r.tipo)?.label}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{r.fecha}</td>
                <td className="px-4 py-2 border-b">
                  <Button size="sm" variant="outline" onClick={() => setModalDetalles(r)}><Eye size={16} className="mr-1" />Ver detalles</Button>
                </td>
              </tr>
            ))}
            {registrosPagina.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-neutral-400 py-4">No hay registros para los filtros/búsqueda seleccionados.</td>
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
      {/* Modal de detalles */}
      {modalDetalles && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-2xl w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => setModalDetalles(null)}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              {getIconoTipo(modalDetalles.tipo)}
              <h3 className="text-lg font-bold">Detalles del registro</h3>
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <div><b>Usuario:</b> {modalDetalles.usuario}</div>
              <div><b>Acción:</b> {modalDetalles.accion}</div>
              <div><b>Tipo:</b> {tipos.find(t => t.id === modalDetalles.tipo)?.label}</div>
              <div><b>Fecha:</b> {modalDetalles.fecha}</div>
              <div><b>Detalles:</b> {modalDetalles.detalles}</div>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm" variant="outline" onClick={() => setModalDetalles(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 