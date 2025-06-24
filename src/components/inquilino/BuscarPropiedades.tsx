"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { 
  Home, 
  MapPin, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X, 
  Loader2, 
  Building2,
  BedDouble,
  Bath,
  Ruler,
  CalendarCheck2
} from "lucide-react";
import { searchProperties, createRentalApplication, getUser } from "@/lib/api-client";

const PAGE_SIZE = 6;

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

export default function BuscarPropiedades() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalPropiedad, setModalPropiedad] = useState<Property | null>(null);
  const [pagina, setPagina] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [applicationStatus, setApplicationStatus] = useState<{[key: number]: 'idle' | 'loading' | 'success' | 'error'}>({});
  
  const [filtros, setFiltros] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    search: ""
  });

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

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const handleRequestRental = async (propertyId: number) => {
    if (!user) {
      router.push(`/login?redirect=/panel-inquilino/buscar`);
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
      return <Button size="sm" disabled>No Disponible</Button>;
    }

    if (user && user.id === property.ownerId) {
      return <Button size="sm" disabled>Tu Propiedad</Button>;
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
          <Button size="sm" onClick={() => handleRequestRental(property.id)}>
            <CalendarCheck2 className="w-4 h-4 mr-1" />
            Solicitar
          </Button>
        );
    }
  };

  const totalPaginas = Math.ceil(properties.length / PAGE_SIZE) || 1;
  const propiedadesPagina = properties.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
          <Search className="w-8 h-8" /> Buscar Propiedades
        </h1>
        <p className="text-neutral-600">Encuentra tu próximo hogar ideal</p>
      </div>

      {/* Filtros de búsqueda */}
      <div className="bg-white/80 rounded-xl shadow-lg border border-white/30 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
              <Search className="w-4 h-4" /> Búsqueda general
            </label>
            <Input
              name="search"
              value={filtros.search}
              onChange={handleFiltroChange}
              placeholder="Título, descripción, dirección..."
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Ciudad
            </label>
            <Input
              name="city"
              value={filtros.city}
              onChange={handleFiltroChange}
              placeholder="Ciudad"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-600">Precio mínimo</label>
            <Input
              name="minPrice"
              type="number"
              value={filtros.minPrice}
              onChange={handleFiltroChange}
              placeholder="$0"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-600">Precio máximo</label>
            <Input
              name="maxPrice"
              type="number"
              value={filtros.maxPrice}
              onChange={handleFiltroChange}
              placeholder="$999,999,999"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
              <BedDouble className="w-4 h-4" /> Habitaciones
            </label>
            <select
              name="bedrooms"
              value={filtros.bedrooms}
              onChange={handleFiltroChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Cualquiera</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSearch} disabled={loading} className="bg-gradient-to-r from-blue-600 to-green-600">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Filter className="w-4 h-4 mr-2" />}
            Buscar
          </Button>
        </div>
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
          {/* Cards de propiedades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedadesPagina.map((prop) => {
              const imgs = Array.isArray(prop.images) ? prop.images : [];
              const imgSrc = imgs.length > 0 ? imgs[0] : 'https://via.placeholder.com/400x250?text=Sin+Imagen';
              
              return (
                <div key={prop.id} className="bg-white/90 rounded-2xl shadow-lg border border-white/30 flex flex-col overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative w-full h-44">
                    <img src={imgSrc} alt={prop.title} className="w-full h-44 object-cover" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        prop.status === "DISPONIBLE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                    {imgs.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1">
                        {imgs.length} fotos
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-blue-700 mb-1 flex items-center gap-2">
                      <Home className="w-5 h-5" /> {prop.title}
                    </h3>
                    <div className="text-neutral-500 text-sm mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {prop.address}, {prop.city}
                    </div>
                    <div className="text-green-700 font-bold text-xl mb-2">
                      ${prop.price.toLocaleString("es-CO")}/mes
                    </div>
                    
                    {/* Detalles de la propiedad */}
                    <div className="flex gap-4 text-sm text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4" />
                        {prop.bedrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {prop.bathrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler className="w-4 h-4" />
                        {prop.area}m²
                      </div>
                    </div>
                    
                    <p className="text-neutral-700 text-sm mb-3 line-clamp-2 flex-1">
                      {prop.description}
                    </p>
                    
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => { setModalPropiedad(prop); setImgIdx(0); }}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />Ver
                      </Button>
                      <div className="flex-1">
                        {renderRequestButton(prop)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {propiedadesPagina.length === 0 && !loading && (
              <div className="col-span-full text-center text-neutral-400 py-12">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p>No se encontraron propiedades que coincidan con tus criterios de búsqueda.</p>
                <p className="text-sm mt-2">Intenta ajustar los filtros para obtener más resultados.</p>
              </div>
            )}
          </div>
          
          {/* Paginación */}
          {properties.length > 0 && (
            <div className="flex justify-center gap-2 my-6">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setPagina(p => Math.max(1, p - 1))} 
                disabled={pagina === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <span className="px-4 py-2 text-sm flex items-center">
                Página {pagina} de {totalPaginas}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} 
                disabled={pagina === totalPaginas}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalle */}
      {modalPropiedad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              className="absolute top-3 right-3 text-neutral-400 hover:text-blue-600 text-xl z-10" 
              onClick={() => { setModalPropiedad(null); setImgIdx(0); }} 
              aria-label="Cerrar"
            >
              <X />
            </button>
            
            {/* Slider de imágenes */}
            {(() => {
              const imgs = Array.isArray(modalPropiedad.images) ? modalPropiedad.images : [];
              const imgSrc = imgs.length > 0 ? imgs[imgIdx] : 'https://via.placeholder.com/600x300?text=Sin+Imagen';
              
              return (
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
              );
            })()}
            
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
      )}
    </div>
  );
} 