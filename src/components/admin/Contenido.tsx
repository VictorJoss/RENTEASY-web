"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Save, X, FileText, Image, Link } from "lucide-react";

const mockContenido = [
  {
    id: 1,
    titulo: "Términos y condiciones",
    tipo: "legal",
    estado: "publicado",
    ultimaActualizacion: "2024-03-10",
    autor: "Admin",
  },
  {
    id: 2,
    titulo: "Política de privacidad",
    tipo: "legal",
    estado: "publicado",
    ultimaActualizacion: "2024-03-09",
    autor: "Admin",
  },
  {
    id: 3,
    titulo: "Guía de uso",
    tipo: "legal",
    estado: "borrador",
    ultimaActualizacion: "2024-03-08",
    autor: "Admin",
  },
  {
    id: 4,
    titulo: "Preguntas frecuentes",
    tipo: "legal",
    estado: "publicado",
    ultimaActualizacion: "2024-03-07",
    autor: "Admin",
  },
];

const tiposContenido = [
  { id: "legal", label: "Legal", icon: <FileText size={16} /> },
];

export default function Contenido() {
  const [contenido, setContenido] = useState(mockContenido);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalEdicion, setModalEdicion] = useState<any>(null);
  const [nuevoContenido, setNuevoContenido] = useState(false);

  const contenidoFiltrado = contenido.filter(c =>
    (filtroTipo ? c.tipo === filtroTipo : true) &&
    (busqueda ? c.titulo.toLowerCase().includes(busqueda.toLowerCase()) : true)
  );

  const guardarContenido = () => {
    if (modalEdicion) {
      setContenido(prev =>
        prev.map(c => c.id === modalEdicion.id ? { ...c, ...modalEdicion } : c)
      );
    } else if (nuevoContenido) {
      setContenido(prev => [
        ...prev,
        {
          id: Math.max(...prev.map(c => c.id)) + 1,
          ...modalEdicion,
          estado: "borrador",
          ultimaActualizacion: new Date().toISOString().split("T")[0],
          autor: "Admin",
        },
      ]);
    }
    setModalEdicion(null);
    setNuevoContenido(false);
  };

  const eliminarContenido = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este contenido?")) {
      setContenido(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de contenido</h2>
        <Button onClick={() => { setNuevoContenido(true); setModalEdicion({ titulo: "", tipo: "", contenido: "" }); }}>
          <Plus size={16} className="mr-1" />
          Nuevo contenido
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Tipo de contenido</label>
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="border rounded px-2 py-1 min-w-[120px]"
          >
            <option value="">Todos</option>
            {tiposContenido.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border rounded px-2 py-1 min-w-[160px]"
            placeholder="Título..."
          />
        </div>
      </div>

      {/* Lista de contenido */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Título</th>
              <th className="px-4 py-2 border-b text-left">Tipo</th>
              <th className="px-4 py-2 border-b text-left">Estado</th>
              <th className="px-4 py-2 border-b text-left">Última actualización</th>
              <th className="px-4 py-2 border-b text-left">Autor</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contenidoFiltrado.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/40">
                <td className="px-4 py-2 border-b">{c.titulo}</td>
                <td className="px-4 py-2 border-b">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-semibold bg-neutral-100 text-neutral-700 border-neutral-300">
                    {tiposContenido.find(t => t.id === c.tipo)?.icon}
                    {tiposContenido.find(t => t.id === c.tipo)?.label}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${
                    c.estado === "publicado" ? "bg-green-100 text-green-700 border-green-300" :
                    "bg-yellow-100 text-yellow-700 border-yellow-300"
                  }`}>
                    {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{c.ultimaActualizacion}</td>
                <td className="px-4 py-2 border-b">{c.autor}</td>
                <td className="px-4 py-2 border-b">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setModalEdicion(c)}>
                      <Edit size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => eliminarContenido(c.id)}>
                      <Trash2 size={16} className="mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {modalEdicion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-4xl w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => { setModalEdicion(null); setNuevoContenido(false); }}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-bold mb-4">
              {nuevoContenido ? "Nuevo contenido" : "Editar contenido"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={modalEdicion.titulo}
                  onChange={e => setModalEdicion({ ...modalEdicion, titulo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={modalEdicion.tipo}
                  onChange={e => setModalEdicion({ ...modalEdicion, tipo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposContenido.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contenido</label>
                <textarea
                  value={modalEdicion.contenido}
                  onChange={e => setModalEdicion({ ...modalEdicion, contenido: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 h-64"
                  placeholder="Escribe el contenido aquí..."
                />
              </div>
              {!nuevoContenido && (
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={modalEdicion.estado}
                    onChange={e => setModalEdicion({ ...modalEdicion, estado: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setModalEdicion(null); setNuevoContenido(false); }}>
                Cancelar
              </Button>
              <Button onClick={guardarContenido}>
                <Save size={16} className="mr-1" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 