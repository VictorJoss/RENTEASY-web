"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, MapPin, Edit, Trash2, BadgeCheck, BadgeX, Eye, X, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getMyProperties, deleteProperty } from "@/lib/api-client";

const PAGE_SIZE = 6;

export default function MisPropiedades() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalPropiedad, setModalPropiedad] = useState<any>(null);
  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const router = useRouter();
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getMyProperties();
        setProperties(response.data);
      } catch (err: any) {
        setError("Error al cargar las propiedades. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta propiedad?")) {
      try {
        await deleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } catch (err: any) {
        alert(err.message || "Error al eliminar la propiedad.");
      }
    }
  };

  const total = properties.length;
  const disponibles = properties.filter(p => p.status === "DISPONIBLE").length;
  const ocupadas = properties.filter(p => p.status === "OCUPADO").length;

  // Filtro de búsqueda
  const propiedadesFiltradas = properties.filter(p =>
    busqueda
      ? p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.address.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.city.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.description.toLowerCase().includes(busqueda.toLowerCase())
      : true
  );

  const totalPaginas = Math.ceil(propiedadesFiltradas.length / PAGE_SIZE) || 1;
  const propiedadesPagina = propiedadesFiltradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return (
    <div>
      {/* Resumen visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 rounded-xl shadow flex items-center gap-3 p-4 border border-white/30">
          <Home className="w-7 h-7 text-blue-600" />
          <div>
            <div className="text-lg font-bold text-blue-700">{total}</div>
            <div className="text-xs text-neutral-500">Total propiedades</div>
          </div>
        </div>
        <div className="bg-white/80 rounded-xl shadow flex items-center gap-3 p-4 border border-white/30">
          <BadgeCheck className="w-7 h-7 text-green-600" />
          <div>
            <div className="text-lg font-bold text-green-700">{disponibles}</div>
            <div className="text-xs text-neutral-500">Disponibles</div>
          </div>
        </div>
        <div className="bg-white/80 rounded-xl shadow flex items-center gap-3 p-4 border border-white/30">
          <BadgeX className="w-7 h-7 text-yellow-500" />
          <div>
            <div className="text-lg font-bold text-yellow-600">{ocupadas}</div>
            <div className="text-xs text-neutral-500">Ocupadas</div>
          </div>
        </div>
      </div>
      {/* Filtro de búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><Search className="w-4 h-4" /> Buscar propiedad</label>
          <input
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
            placeholder="Título, ubicación o descripción..."
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex justify-end mt-2 sm:mt-0">
          <Button onClick={() => router.push("/panel-propietario/nueva")}>Nueva Propiedad</Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="ml-2">Cargando propiedades...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-12">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Cards visuales con paginación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedadesPagina.map((prop) => {
              const imgs = Array.isArray(prop.images) ? prop.images : [prop.image];
              return (
                <div key={prop.id} className="bg-white/90 rounded-2xl shadow-lg border border-white/30 flex flex-col overflow-hidden">
                  <div className="relative w-full h-44">
                    <img src={imgs[0]} alt={prop.title} className="w-full h-44 object-cover" />
                    {imgs.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1">{imgs.length} fotos</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${prop.status === "DISPONIBLE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{prop.status}</span>
                    </div>
                    <h3 className="font-bold text-lg text-blue-700 mb-1 flex items-center gap-2"><Home className="w-5 h-5" /> {prop.title}</h3>
                    <div className="text-neutral-500 text-sm mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {prop.address}, {prop.city}</div>
                    <div className="text-green-700 font-bold text-xl mb-2">${prop.price.toLocaleString("es-CO")}</div>
                    <p className="text-neutral-700 text-sm mb-3 line-clamp-2">{prop.description}</p>
                    <div className="flex gap-2 mt-auto flex-wrap">
                      <Button size="sm" variant="secondary" onClick={() => setModalPropiedad(prop)}><Eye className="w-4 h-4 mr-1" />Ver detalles</Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/panel-propietario/editar/${prop.id}`)}><Edit className="w-4 h-4 mr-1" />Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(prop.id)}><Trash2 className="w-4 h-4 mr-1" />Eliminar</Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {propiedadesPagina.length === 0 && (
              <div className="col-span-full text-center text-neutral-400 py-12">
                No has publicado ninguna propiedad todavía.
              </div>
            )}
          </div>
          {/* Paginación */}
          <div className="flex justify-center gap-2 my-6">
            <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
            <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
            <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</Button>
          </div>
        </>
      )}

      {/* Modal de detalle */}
      {modalPropiedad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in duration-200">
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-blue-600 text-xl" onClick={() => { setModalPropiedad(null); setImgIdx(0); }} aria-label="Cerrar"><X /></button>
            {/* Slider de imágenes */}
            {(() => {
              let imgs: string[] = [];
              if (Array.isArray(modalPropiedad.images)) {
                imgs = modalPropiedad.images;
              } else if (modalPropiedad.image) {
                imgs = [modalPropiedad.image];
              }
              return (
                <div className="relative w-full h-44 mb-3 flex items-center justify-center">
                  <img src={imgs[imgIdx]} alt={modalPropiedad.title} className="rounded-xl w-full h-44 object-cover" />
                  {imgs.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 rounded-full p-1 shadow"
                        onClick={() => setImgIdx(i => (i === 0 ? imgs.length - 1 : i - 1))}
                        aria-label="Anterior"
                      >
                        <ChevronLeft className="w-5 h-5 text-blue-700" />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 rounded-full p-1 shadow"
                        onClick={() => setImgIdx(i => (i === imgs.length - 1 ? 0 : i + 1))}
                        aria-label="Siguiente"
                      >
                        <ChevronRight className="w-5 h-5 text-blue-700" />
                      </button>
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1">{imgIdx + 1} / {imgs.length}</span>
                    </>
                  )}
                </div>
              );
            })()}
            <h3 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2"><Home className="w-5 h-5" /> {modalPropiedad.title}</h3>
            <div className="text-neutral-500 text-sm mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {modalPropiedad.address}, {modalPropiedad.city}</div>
            <div className="text-green-700 font-bold text-xl mb-2">${modalPropiedad.price.toLocaleString("es-CO")}</div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${modalPropiedad.status === "DISPONIBLE" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{modalPropiedad.status}</span>
            <p className="text-neutral-700 text-sm mt-4">{modalPropiedad.description}</p>
            <Button className="w-full mt-4" onClick={() => setModalPropiedad(null)}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
