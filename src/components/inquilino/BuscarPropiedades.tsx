"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockPropiedades = [
  {
    id: 1,
    title: "Apartamento en Bogotá",
    location: "Chapinero",
    type: "Apartamento",
    price: 1200000,
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"],
    description: "Hermoso apartamento amoblado, cerca a universidades y transporte público.",
    disponible: true,
  },
  {
    id: 2,
    title: "Casa en Medellín",
    location: "El Poblado",
    type: "Casa",
    price: 2500000,
    images: ["https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"],
    description: "Casa amplia con jardín y parqueadero, zona exclusiva.",
    disponible: true,
  },
  {
    id: 3,
    title: "Oficina en Cali",
    location: "Granada",
    type: "Oficina",
    price: 1800000,
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"],
    description: "Oficina moderna, lista para estrenar, excelente ubicación.",
    disponible: false,
  },
  {
    id: 4,
    title: "Oficina en chechenia",
    location: "Granada",
    type: "Oficina",
    price: 1800000,
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"],
    description: "Atraco asegurado",
    disponible: true,
  },
  {
    id: 5,
    title: "Casa en Mocari",
    location: "Granada",
    type: "Oficina",
    price: 1800000,
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"],
    description: "Atraco asegurado",
    disponible: true,
  },
  {
    id: 6,
    title: "Casa en La Granja",
    location: "Granada",
    type: "Oficina",
    price: 1800000,
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"],
    description: "Atraco asegurado",
    disponible: true,
  },

];

const PAGE_SIZE = 4;

export default function BuscarPropiedades() {
  const [filtros, setFiltros] = useState({ location: "", type: "", minPrice: "", maxPrice: "" });
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [modalPropiedad, setModalPropiedad] = useState<any>(null);
  const [mensaje, setMensaje] = useState("");
  const [solicitando, setSolicitando] = useState(false);

  const ubicaciones = Array.from(new Set(mockPropiedades.map(p => p.location)));
  const tipos = Array.from(new Set(mockPropiedades.map(p => p.type)));

  const propiedadesFiltradas = mockPropiedades.filter(p =>
    (filtros.location ? p.location === filtros.location : true) &&
    (filtros.type ? p.type === filtros.type : true) &&
    (filtros.minPrice ? p.price >= Number(filtros.minPrice) : true) &&
    (filtros.maxPrice ? p.price <= Number(filtros.maxPrice) : true) &&
    (busqueda ? (
      p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.description.toLowerCase().includes(busqueda.toLowerCase())
    ) : true)
  );

  const totalPaginas = Math.ceil(propiedadesFiltradas.length / PAGE_SIZE) || 1;
  const propiedadesPagina = propiedadesFiltradas.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  const handleFiltro = (e: any) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
    setPagina(1);
  };

  const handleBusqueda = (e: any) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const handleSolicitar = async (propiedad: any) => {
    setSolicitando(true);
    setMensaje("");
    // Simula POST
    await new Promise(res => setTimeout(res, 1000));
    setSolicitando(false);
    setMensaje(`Solicitud enviada para "${propiedad.title}". El propietario te contactará pronto.`);
    setModalPropiedad(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Buscar propiedades</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-xs mb-1">Ubicación</label>
          <select name="location" value={filtros.location} onChange={handleFiltro} className="border rounded px-2 py-1 w-full">
            <option value="">Todas</option>
            {ubicaciones.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Tipo</label>
          <select name="type" value={filtros.type} onChange={handleFiltro} className="border rounded px-2 py-1 w-full">
            <option value="">Todos</option>
            {tipos.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Precio mínimo</label>
          <Input name="minPrice" type="number" value={filtros.minPrice} onChange={handleFiltro} placeholder="$" className="w-full" />
        </div>
        <div>
          <label className="block text-xs mb-1">Precio máximo</label>
          <Input name="maxPrice" type="number" value={filtros.maxPrice} onChange={handleFiltro} placeholder="$" className="w-full" />
        </div>
        <div>
          <label className="block text-xs mb-1">Buscar</label>
          <Input value={busqueda} onChange={handleBusqueda} placeholder="Palabra clave..." className="w-full" />
        </div>
      </div>
      {mensaje && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{mensaje}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propiedadesPagina.map((p) => (
          <div key={p.id} className={`bg-white rounded shadow p-4 flex flex-col ${!p.disponible ? "opacity-60" : ""}`}>
            <img src={p.images[0]} alt={p.title} className="rounded mb-3 w-full h-40 object-cover" />
            <h3 className="font-bold text-lg mb-1">{p.title}</h3>
            <div className="text-neutral-500 text-sm mb-2">{p.location} • {p.type}</div>
            <div className="text-green-700 font-bold text-xl mb-2">${p.price.toLocaleString("es-CO")}</div>
            <p className="text-neutral-700 text-sm mb-3 line-clamp-2">{p.description}</p>
            <div className="flex-1" />
            <Button
              disabled={!p.disponible}
              onClick={() => setModalPropiedad(p)}
              className="w-full mt-2"
            >
              {p.disponible ? "Solicitar arriendo" : "No disponible"}
            </Button>
          </div>
        ))}
        {propiedadesPagina.length === 0 && (
          <div className="col-span-full text-center text-neutral-400 py-12">
            No se encontraron propiedades para los filtros/búsqueda seleccionados.
          </div>
        )}
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 my-6">
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
        <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
        <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</Button>
      </div>
      {/* Modal de detalle */}
      {modalPropiedad && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <img src={modalPropiedad.images[0]} alt={modalPropiedad.title} className="rounded mb-3 w-full h-40 object-cover" />
            <h3 className="text-lg font-bold mb-2">{modalPropiedad.title}</h3>
            <div className="text-neutral-500 text-sm mb-2">{modalPropiedad.location} • {modalPropiedad.type}</div>
            <div className="text-green-700 font-bold text-xl mb-2">${modalPropiedad.price.toLocaleString("es-CO")}</div>
            <p className="text-neutral-700 text-sm mb-3">{modalPropiedad.description}</p>
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="outline" onClick={() => setModalPropiedad(null)}>Cerrar</Button>
              <Button
                disabled={!modalPropiedad.disponible || solicitando}
                onClick={() => handleSolicitar(modalPropiedad)}
              >
                {solicitando ? "Enviando..." : "Solicitar arriendo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
