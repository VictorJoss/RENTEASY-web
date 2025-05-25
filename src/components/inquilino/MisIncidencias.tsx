"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, FileDown, FileText, PlusCircle, Image as ImageIcon, Loader2, CheckCircleIcon } from "lucide-react";

const mockIncidencias = [
  { id: 1, propiedad: "Apartamento en Bogotá", tipo: "Daño en baño", descripcion: "El lavamanos está goteando.", estado: "Pendiente", fecha: "2024-05-10", respuesta: "", imagen: "https://via.placeholder.com/120x80?text=Baño" },
  { id: 2, propiedad: "Casa en Medellín", tipo: "Fuga de gas", descripcion: "Se percibe olor a gas en la cocina.", estado: "Resuelta", fecha: "2024-04-22", respuesta: "Se envió técnico y se solucionó.", imagen: "https://via.placeholder.com/120x80?text=Cocina" },
  { id: 3, propiedad: "Apartamento en Bogotá", tipo: "Ruido excesivo", descripcion: "Vecinos hacen ruido en la noche.", estado: "Pendiente", fecha: "2024-05-12", respuesta: "", imagen: "" },
];

const PAGE_SIZE = 5;

function EstadoBadge({ estado }: { estado: string }) {
  const color = estado === "Resuelta"
    ? "bg-green-100 text-green-700 border-green-300"
    : estado === "Pendiente"
    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
    : "bg-neutral-100 text-neutral-700 border-neutral-300";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs border font-semibold ${color}`}>{estado}</span>;
}

export default function MisIncidencias() {
  const [incidencias, setIncidencias] = useState(mockIncidencias);
  const [modalIncidencia, setModalIncidencia] = useState<any>(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPropiedad, setFiltroPropiedad] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  // Estado para nueva incidencia
  const [modalNueva, setModalNueva] = useState(false);
  const [form, setForm] = useState({
    propiedad: "",
    tipo: "",
    descripcion: "",
    prioridad: "Media",
    imagen: null as File | null,
    imagenPreview: ""
  });
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState("");

  const propiedades = Array.from(new Set(incidencias.map(i => i.propiedad)));
  const estados = ["Pendiente", "Resuelta"];
  const tipos = ["Daño", "Fuga", "Ruido", "Otro"];
  const prioridades = ["Alta", "Media", "Baja"];

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

  // Paginación
  const totalPaginas = Math.ceil(incidenciasFiltradas.length / PAGE_SIZE) || 1;
  const incidenciasPagina = incidenciasFiltradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center justify-between gap-4">
        Mis incidencias
        <Button onClick={() => setModalNueva(true)} className="flex gap-2 items-center bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-semibold shadow">
          <PlusCircle size={18} /> Reportar nueva incidencia
        </Button>
      </h2>
      {/* Feedback de éxito */}
      {feedback && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded border border-green-200 animate-fade-in">
          <CheckCircleIcon size={20} className="text-green-500" />
          <span>{feedback}</span>
        </div>
      )}
      {/* Filtros */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Estado</label>
          <select value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todos</option>
            {estados.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Propiedad</label>
          <select value={filtroPropiedad} onChange={e => { setFiltroPropiedad(e.target.value); setPagina(1); }} className="border rounded px-2 py-1 min-w-[120px]">
            <option value="">Todas</option>
            {propiedades.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            className="border rounded px-2 py-1 min-w-[160px]"
            placeholder="Buscar por texto..."
          />
        </div>
      </div>
      {/* Resumen visual */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Resumen de incidencias</h3>
        <div className="flex gap-6">
          {resumen.map(r => (
            <div key={r.estado} className="bg-neutral-100 rounded p-4 text-center min-w-[120px]">
              <div className="text-lg font-bold">{r.cantidad}</div>
              <EstadoBadge estado={r.estado} />
            </div>
          ))}
        </div>
      </div>
      {/* Tabla de incidencias */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-sm md:text-base">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="px-4 py-2 border-b text-left">Propiedad</th>
              <th className="px-4 py-2 border-b text-left">Tipo</th>
              <th className="px-4 py-2 border-b text-left">Descripción</th>
              <th className="px-4 py-2 border-b text-left">Estado</th>
              <th className="px-4 py-2 border-b text-left">Fecha</th>
              <th className="px-4 py-2 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {incidenciasPagina.map((i) => (
              <tr key={i.id} className={`transition-colors ${i.estado === "Pendiente" ? "bg-yellow-50" : ""} hover:bg-blue-50/40`}>
                <td className="px-4 py-2 border-b">{i.propiedad}</td>
                <td className="px-4 py-2 border-b">{i.tipo}</td>
                <td className="px-4 py-2 border-b">{i.descripcion}</td>
                <td className="px-4 py-2 border-b"><EstadoBadge estado={i.estado} /></td>
                <td className="px-4 py-2 border-b">{i.fecha}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setModalIncidencia(i)}><Eye size={16} className="mr-1" />Ver detalle</Button>
                  {i.estado !== "Resuelta" && (
                    <Button size="sm" onClick={() => setIncidencias(prev => prev.map(x => x.id === i.id ? { ...x, estado: "Resuelta" } : x))} className="bg-green-600 hover:bg-green-700 text-white"><CheckCircle size={16} className="mr-1" />Marcar resuelta</Button>
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
      {/* Modal de detalle */}
      {modalIncidencia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => setModalIncidencia(null)}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              {modalIncidencia.estado === "Resuelta" ? (
                <CheckCircle size={32} className="text-green-500" />
              ) : (
                <Eye size={32} className="text-yellow-500" />
              )}
              <h3 className="text-lg font-bold">Detalle de la incidencia</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-2">
              <div><b>Propiedad:</b><br />{modalIncidencia.propiedad}</div>
              <div><b>Tipo:</b><br />{modalIncidencia.tipo}</div>
              <div className="sm:col-span-2"><b>Descripción:</b><br />{modalIncidencia.descripcion}</div>
              <div><b>Estado:</b><br /><EstadoBadge estado={modalIncidencia.estado} /></div>
              <div><b>Fecha:</b><br />{modalIncidencia.fecha}</div>
              {modalIncidencia.imagen && (
                <div className="sm:col-span-2 mt-2"><b>Imagen adjunta:</b><br /><img src={modalIncidencia.imagen} alt="Incidencia" className="mt-1 rounded border w-32 h-20 object-cover" /></div>
              )}
              {modalIncidencia.respuesta && (
                <div className="sm:col-span-2 mt-2"><b>Respuesta del propietario:</b><br />{modalIncidencia.respuesta}</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setModalIncidencia(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de nueva incidencia */}
      {modalNueva && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors"
              onClick={() => setModalNueva(false)}
              aria-label="Cerrar"
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PlusCircle size={20} /> Reportar nueva incidencia</h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!form.propiedad || !form.tipo || !form.descripcion) return;
                setEnviando(true);
                // Simular subida
                setTimeout(() => {
                  setIncidencias(prev => [
                    {
                      id: prev.length + 1,
                      propiedad: form.propiedad,
                      tipo: form.tipo,
                      descripcion: form.descripcion,
                      prioridad: form.prioridad,
                      estado: "Pendiente",
                      fecha: new Date().toISOString().slice(0, 10),
                      respuesta: "",
                      imagen: form.imagenPreview
                    },
                    ...prev
                  ]);
                  setModalNueva(false);
                  setForm({ propiedad: "", tipo: "", descripcion: "", prioridad: "Media", imagen: null, imagenPreview: "" });
                  setEnviando(false);
                  setFeedback("Incidencia reportada exitosamente.");
                  setTimeout(() => setFeedback(""), 3000);
                }, 1200);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs mb-1 font-medium">Propiedad</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={form.propiedad}
                  onChange={e => setForm(f => ({ ...f, propiedad: e.target.value }))}
                  required
                >
                  <option value="">Selecciona una propiedad</option>
                  {propiedades.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium">Tipo de incidencia</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  {tipos.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium">Descripción</label>
                <textarea
                  className="border rounded px-2 py-1 w-full min-h-[60px]"
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  required
                  maxLength={300}
                  placeholder="Describe el problema..."
                />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium">Prioridad</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={form.prioridad}
                  onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}
                >
                  {prioridades.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium flex items-center gap-1"><ImageIcon size={16} /> Adjuntar imagen (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-xs"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setForm(f => ({ ...f, imagen: file, imagenPreview: ev.target?.result as string }));
                      reader.readAsDataURL(file);
                    } else {
                      setForm(f => ({ ...f, imagen: null, imagenPreview: "" }));
                    }
                  }}
                />
                {form.imagenPreview && (
                  <img src={form.imagenPreview} alt="Preview" className="mt-2 rounded border w-32 h-20 object-cover" />
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button type="button" variant="outline" className="mr-2" onClick={() => setModalNueva(false)}>Cancelar</Button>
                <Button type="submit" disabled={enviando || !form.propiedad || !form.tipo || !form.descripcion} className="bg-primary text-white flex gap-2 items-center">
                  {enviando ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />} Reportar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
