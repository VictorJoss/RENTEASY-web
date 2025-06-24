"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home, Building2, X, ChevronLeft, ChevronRight, Loader2, CalendarCheck2, BedDouble, Bath, Ruler } from "lucide-react";
import { searchProperties, createRentalApplication, getUser } from "@/lib/api-client";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 4;

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: "DISPONIBLE" | "OCUPADO" | "RESERVADA";
  images: string[];
  ownerId: number;
  ownerName: string;
}

export default function PublicPropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({ 
    city: "", 
    minPrice: "", 
    maxPrice: "", 
    bedrooms: "",
    search: "" 
  });
  const [pagina, setPagina] = useState(1);
  const [modalPropiedad, setModalPropiedad] = useState<Property | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState<{[key: number]: 'idle' | 'loading' | 'success' | 'error'}>({});

  const router = useRouter();
  const user = getUser();

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const filters: any = {};
      if (filtros.city) filters.city = filtros.city;
      if (filtros.minPrice) filters.minPrice = parseInt(filtros.minPrice);
      if (filtros.maxPrice) filters.maxPrice = parseInt(filtros.maxPrice);
      if (filtros.bedrooms) filters.bedrooms = parseInt(filtros.bedrooms);
      if (filtros.search) filters.search = filtros.search;

      const response = await searchProperties(filters);
      setProperties(response.data);
      setPagina(1);
    } catch (err: any) {
      setError("Error al buscar propiedades. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, search: e.target.value });
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const handleRequestRental = async (propertyId: number) => {
    if (!user) {
      router.push(`/login?redirect=/`);
      return;
    }
    
    setApplicationStatus(prev => ({ ...prev, [propertyId]: 'loading' }));
    try {
      await createRentalApplication(propertyId);
      setApplicationStatus(prev => ({ ...prev, [propertyId]: 'success' }));
    } catch (error) {
      console.error("Error al solicitar alquiler:", error);
      setApplicationStatus(prev => ({ ...prev, [propertyId]: 'error' }));
    }
  };

  const renderRequestButton = (property: Property) => {
    const status = applicationStatus[property.id] || 'idle';
    
    if (property.status !== 'DISPONIBLE') {
      return <Button size="sm" disabled>No disponible</Button>;
    }

    if (user && user.id === property.ownerId) {
      return <Button size="sm" disabled>Tu propiedad</Button>;
    }
    
    switch (status) {
      case 'loading':
        return <Button size="sm" disabled><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Solicitando...</Button>;
      case 'success':
        return <Button size="sm" className="bg-green-500" disabled>¡Solicitado!</Button>;
      case 'error':
        return <Button size="sm" variant="destructive" onClick={() => handleRequestRental(property.id)}>Reintentar</Button>;
      default:
        return (
          <Button 
            size="sm" 
            onClick={() => handleRequestRental(property.id)}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
          >
            <CalendarCheck2 className="w-4 h-4 mr-1" />
            {user ? 'Solicitar' : 'Iniciar sesión'}
          </Button>
        );
    }
  };

  const totalPaginas = Math.ceil(properties.length / PAGE_SIZE) || 1;
  const propiedadesPagina = properties.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><Search className="w-4 h-4" /> Buscar</label>
          <Input value={filtros.search} onChange={handleBusqueda} placeholder="Palabra clave, barrio, etc..." className="w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><MapPin className="w-4 h-4" /> Ciudad</label>
          <Input name="city" value={filtros.city} onChange={handleFiltro} placeholder="Ciudad" className="w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1"><BedDouble className="w-4 h-4" /> Habitaciones</label>
          <select name="bedrooms" value={filtros.bedrooms} onChange={handleFiltro} className="border rounded px-2 py-1 w-full">
            <option value="">Cualquiera</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-600">Precio mínimo</label>
          <Input name="minPrice" type="number" value={filtros.minPrice} onChange={handleFiltro} placeholder="$" className="w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-600">Precio máximo</label>
          <Input name="maxPrice" type="number" value={filtros.maxPrice} onChange={handleFiltro} placeholder="$" className="w-full" />
        </div>
        <Button onClick={handleSearch} disabled={loading} className="bg-gradient-to-r from-blue-600 to-green-600">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
          Buscar
        </Button>
      </div>
      
      {/* Resultados */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="ml-2">Buscando propiedades...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-12">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedadesPagina.map((p) => {
              const imgs = Array.isArray(p.images) ? p.images : [];
              const imgSrc = imgs.length > 0 ? imgs[0] : 'https://via.placeholder.com/400x250?text=Sin+Imagen';
              
              return (
                <div key={p.id} className={`relative bg-white/70 rounded-2xl shadow-lg p-4 flex flex-col border border-blue-100 hover:shadow-xl transition-all ${p.status !== "DISPONIBLE" ? "opacity-60" : ""}`}> 
                  <div className="relative w-full h-44 mb-3 flex items-center justify-center">
                    <img src={imgSrc} alt={p.title} className="rounded-xl w-full h-44 object-cover border-2 border-blue-100" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "DISPONIBLE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    {imgs.length > 1 && (
                      <span className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs rounded px-2 py-1 shadow">{imgs.length} fotos</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-blue-700 flex items-center gap-2"><Building2 className="w-5 h-5" /> {p.title}</h3>
                  <div className="text-neutral-500 text-sm mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> {p.address}, {p.city}</div>
                  <div className="text-green-700 font-bold text-xl mb-2">${p.price.toLocaleString("es-CO")}/mes</div>
                  
                  {/* Detalles */}
                  <div className="flex gap-4 text-sm text-neutral-600 mb-3">
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4" />
                      {p.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {p.bathrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      {p.area}m²
                    </div>
                  </div>
                  
                  <p className="text-neutral-700 text-sm mb-3 line-clamp-2 flex-1">{p.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setModalPropiedad(p); setImgIdx(0); }}
                      className="flex-1"
                    >
                      Ver detalles
                    </Button>
                    <div className="flex-1">
                      {renderRequestButton(p)}
                    </div>
                  </div>
                </div>
              );
            })}
            {propiedadesPagina.length === 0 && !loading && (
              <div className="col-span-full text-center text-neutral-400 py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p>No se encontraron propiedades que coincidan con tus criterios de búsqueda.</p>
              </div>
            )}
          </div>
          
          {/* Paginación */}
          {properties.length > 0 && (
            <div className="flex justify-center gap-2 my-6">
              <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
              <span className="px-2 py-1 text-sm">Página {pagina} de {totalPaginas}</span>
              <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Siguiente</Button>
            </div>
          )}
        </>
      )}
      
      {/* Modal de detalle con slider */}
      {modalPropiedad && (() => {
        const imgs = Array.isArray(modalPropiedad.images) ? modalPropiedad.images : [];
        const imgSrc = imgs.length > 0 ? imgs[imgIdx] : 'https://via.placeholder.com/600x300?text=Sin+Imagen';
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-blue-100">
              <button className="absolute top-3 right-3 text-neutral-400 hover:text-blue-600 text-xl z-10" onClick={() => { setModalPropiedad(null); setImgIdx(0); }} aria-label="Cerrar"><X /></button>
              <div className="relative w-full h-64 mb-4">
                <img src={imgSrc} alt={modalPropiedad.title} className="w-full h-64 object-cover rounded-t-2xl" />
                {imgs.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-blue-100 rounded-full p-2 shadow"
                      onClick={() => setImgIdx(i => (i === 0 ? imgs.length - 1 : i - 1))}
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-700" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 rounded-full p-2 shadow"
                      onClick={() => setImgIdx(i => (i === imgs.length - 1 ? 0 : i + 1))}
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="w-5 h-5 text-green-700" />
                    </button>
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1">
                      {imgIdx + 1} / {imgs.length}
                    </span>
                  </>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-blue-700 flex items-center gap-2">
                      <Home className="w-6 h-6" /> {modalPropiedad.title}
                    </h3>
                    <div className="text-neutral-500 text-sm mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {modalPropiedad.address}, {modalPropiedad.city}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    modalPropiedad.status === "DISPONIBLE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {modalPropiedad.status}
                  </span>
                </div>
                
                <div className="text-green-700 font-bold text-3xl mb-4">
                  ${modalPropiedad.price.toLocaleString("es-CO")}/mes
                </div>
                
                {/* Detalles */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <BedDouble className="w-6 h-6 text-blue-600 mx-auto mb-1"/>
                    <span className="font-bold block">{modalPropiedad.bedrooms}</span>
                    <span className="text-sm text-gray-500">Habitaciones</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Bath className="w-6 h-6 text-blue-600 mx-auto mb-1"/>
                    <span className="font-bold block">{modalPropiedad.bathrooms}</span>
                    <span className="text-sm text-gray-500">Baños</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Ruler className="w-6 h-6 text-blue-600 mx-auto mb-1"/>
                    <span className="font-bold block">{modalPropiedad.area} m²</span>
                    <span className="text-sm text-gray-500">Área</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Descripción</h4>
                  <p className="text-neutral-700 leading-relaxed">{modalPropiedad.description}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Propiedad de: <span className="font-semibold">{modalPropiedad.ownerName}</span></p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setModalPropiedad(null)}
                    className="flex-1"
                  >
                    Cerrar
                  </Button>
                  <div className="flex-1">
                    {renderRequestButton(modalPropiedad)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
} 