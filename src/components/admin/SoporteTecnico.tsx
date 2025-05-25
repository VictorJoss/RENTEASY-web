"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, User, MessageSquare, Search } from "lucide-react";

const mockTickets = [
  { id: 1, usuario: "Juan Pérez", asunto: "Problema con el pago", estado: "pendiente", prioridad: "alta", fecha: "2024-03-10", ultimaRespuesta: "2024-03-10 15:30" },
  { id: 2, usuario: "Ana Torres", asunto: "No puedo subir documentos", estado: "en_proceso", prioridad: "media", fecha: "2024-03-09", ultimaRespuesta: "2024-03-10 10:15" },
  { id: 3, usuario: "Carlos López", asunto: "Duda sobre contrato", estado: "resuelto", prioridad: "baja", fecha: "2024-03-08", ultimaRespuesta: "2024-03-09 16:45" },
];
const PAGE_SIZE = 4;

export default function SoporteTecnico() {
  const [tickets, setTickets] = useState(mockTickets);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalTicket, setModalTicket] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");

  const estados = ["pendiente", "en_proceso", "resuelto"];
  const prioridades = ["alta", "media", "baja"];

  const ticketsFiltrados = tickets.filter(t =>
    (filtroEstado ? t.estado === filtroEstado : true) &&
    (filtroPrioridad ? t.prioridad === filtroPrioridad : true) &&
    (busqueda ? (
      t.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.asunto.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const totalPaginas = Math.ceil(ticketsFiltrados.length / PAGE_SIZE) || 1;
  const ticketsPagina = ticketsFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Acciones mock
  const cambiarEstado = (id: number, nuevoEstado: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
    setModalTicket(null);
  };

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;
    // Aquí iría la lógica para enviar el mensaje
    setMensaje("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Soporte técnico</h2>
      {/* Filtros */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Estado</label>
          <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todos</option>
            {estados.map(e => <option key={e}>{e.charAt(0).toUpperCase() + e.slice(1).replace("_", " ")}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Prioridad</label>
          <select value={filtroPrioridad} onChange={e => { setFiltroPrioridad(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todas</option>
            {prioridades.map(p => <option key={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            className="border rounded px-2 py-1 min-w-[160px]"
            placeholder="Usuario o asunto..."
          />
        </div>
      </div>
      {/* Tabla de tickets */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-sm md:text-base">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b text-left">Usuario</th>
              <th className="px-4 py-2 border-b text-left">Asunto</th>
              <th className="px-4 py-2 border-b text-left">Estado</th>
              <th className="px-4 py-2 border-b text-left">Prioridad</th>
              <th className="px-4 py-2 border-b text-left">Fecha</th>
              <th className="px-4 py-2 border-b text-left">Última respuesta</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ticketsPagina.map((t) => (
              <tr key={t.id} className={`transition-colors hover:bg-blue-50/40`}>
                <td className="px-4 py-2 border-b">{t.usuario}</td>
                <td className="px-4 py-2 border-b">{t.asunto}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${
                    t.estado === "resuelto" ? "bg-green-100 text-green-700 border-green-300" :
                    t.estado === "en_proceso" ? "bg-blue-100 text-blue-700 border-blue-300" :
                    "bg-yellow-100 text-yellow-700 border-yellow-300"
                  }`}>{t.estado.charAt(0).toUpperCase() + t.estado.slice(1).replace("_", " ")}</span>
                </td>
                <td className="px-4 py-2 border-b">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${
                    t.prioridad === "alta" ? "bg-red-100 text-red-700 border-red-300" :
                    t.prioridad === "media" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                    "bg-green-100 text-green-700 border-green-300"
                  }`}>{t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1)}</span>
                </td>
                <td className="px-4 py-2 border-b">{t.fecha}</td>
                <td className="px-4 py-2 border-b">{t.ultimaRespuesta}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalTicket(t)}><MessageSquare size={16} className="mr-1" />Atender</Button>
                  {t.estado !== "resuelto" && (
                    <Button size="sm" onClick={() => cambiarEstado(t.id, "resuelto")} className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle size={16} className="mr-1" />Resolver</Button>
                  )}
                </td>
              </tr>
            ))}
            {ticketsPagina.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-neutral-400 py-4">No hay tickets para los filtros/búsqueda seleccionados.</td>
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
      {/* Modal de atención de ticket */}
      {modalTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-2xl w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => setModalTicket(null)}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={32} className="text-blue-600" />
              <h3 className="text-lg font-bold">Atención de ticket</h3>
            </div>
            <div className="grid grid-cols-1 gap-y-2 mb-4">
              <div><b>Usuario:</b> {modalTicket.usuario}</div>
              <div><b>Asunto:</b> {modalTicket.asunto}</div>
              <div><b>Estado:</b> <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${
                modalTicket.estado === "resuelto" ? "bg-green-100 text-green-700 border-green-300" :
                modalTicket.estado === "en_proceso" ? "bg-blue-100 text-blue-700 border-blue-300" :
                "bg-yellow-100 text-yellow-700 border-yellow-300"
              }`}>{modalTicket.estado.charAt(0).toUpperCase() + modalTicket.estado.slice(1).replace("_", " ")}</span></div>
              <div><b>Prioridad:</b> <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${
                modalTicket.prioridad === "alta" ? "bg-red-100 text-red-700 border-red-300" :
                modalTicket.prioridad === "media" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                "bg-green-100 text-green-700 border-green-300"
              }`}>{modalTicket.prioridad.charAt(0).toUpperCase() + modalTicket.prioridad.slice(1)}</span></div>
              <div><b>Fecha:</b> {modalTicket.fecha}</div>
            </div>
            {/* Historial de mensajes */}
            <div className="border rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{modalTicket.usuario}</div>
                    <div className="text-sm text-neutral-600">Hola, necesito ayuda con...</div>
                    <div className="text-xs text-neutral-400">2024-03-10 15:30</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Soporte</div>
                    <div className="text-sm text-neutral-600">¿En qué puedo ayudarte?</div>
                    <div className="text-xs text-neutral-400">2024-03-10 15:35</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Input de mensaje */}
            <div className="flex gap-2">
              <input
                type="text"
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <Button onClick={enviarMensaje}>Enviar</Button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {modalTicket.estado !== "resuelto" && (
                <Button size="sm" onClick={() => cambiarEstado(modalTicket.id, "resuelto")} className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle size={16} className="mr-1" />Marcar como resuelto</Button>
              )}
              <Button size="sm" variant="outline" onClick={() => setModalTicket(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 