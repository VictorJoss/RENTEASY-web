"use client";

import { getPublicPropertyById, createRentalApplication, getUser } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  CalendarCheck2,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getPublicPropertyById(id);
        setProperty(response.data);
      } catch (err) {
        setError("No se pudo cargar la propiedad.");
      } finally {
        setLoading(false);
      }
    };
    
    setUser(getUser());
    fetchProperty();
  }, [id]);

  const handleRequestRental = async () => {
    if (!user) {
        router.push(`/login?redirect=/propiedad/${id}`);
        return;
    }
    
    setApplicationStatus('loading');
    try {
        await createRentalApplication(property!.id);
        setApplicationStatus('success');
    } catch (error) {
        console.error("Error al solicitar alquiler:", error);
        setApplicationStatus('error');
    }
  };

  const renderRequestButton = () => {
    if (!property) return null;
    
    if (property.status !== 'DISPONIBLE') {
      return <Button size="lg" className="w-full text-lg" disabled>Propiedad no Disponible</Button>;
    }

    if (user && user.id === property.ownerId) {
        return <Button size="lg" className="w-full text-lg" disabled>No puedes alquilar tu propia propiedad</Button>;
    }
    
    switch (applicationStatus) {
      case 'loading':
        return <Button size="lg" className="w-full text-lg" disabled><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</Button>;
      case 'success':
        return <Button size="lg" className="w-full text-lg" disabled className="bg-green-500"><CheckCircle2 className="mr-2 h-5 w-5" /> ¡Solicitud Enviada!</Button>;
      case 'error':
        return <Button size="lg" className="w-full text-lg" variant="destructive" onClick={handleRequestRental}><AlertCircle className="mr-2 h-5 w-5" /> Reintentar Solicitud</Button>;
      default:
        return (
          <Button size="lg" className="w-full text-lg" onClick={handleRequestRental}>
            <CalendarCheck2 className="w-5 h-5 mr-3" />
            {user ? 'Solicitar Alquiler' : 'Iniciar Sesión para Solicitar'}
          </Button>
        );
    }
  };


  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-green-600"/>
        </div>
    );
  }

  if (error || !property) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
            <h1 className="text-2xl font-bold">Propiedad no encontrada</h1>
            <p>No pudimos encontrar la propiedad que buscas.</p>
            <Link href="/">
                <Button className="mt-4">Volver al Inicio</Button>
            </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image Gallery */}
          <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={property.images[0] || 'https://via.placeholder.com/800x600?text=Propiedad'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
             <div className="absolute top-4 right-4">
               <Badge variant={property.status === 'DISPONIBLE' ? 'default' : 'destructive'} className="text-sm">
                 {property.status}
               </Badge>
             </div>
          </div>

          {/* Property Details */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-500 mb-6">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{property.address}, {property.city}</span>
            </div>
            
            <p className="text-4xl font-extrabold text-green-600 mb-6">
              ${new Intl.NumberFormat("es-CO").format(property.price)}
              <span className="text-lg font-medium text-gray-500">/mes</span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6 text-center">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg">
                <BedDouble className="w-8 h-8 text-green-600 mb-2"/>
                <span className="font-bold">{property.bedrooms}</span>
                <span className="text-sm text-gray-500">Habitaciones</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg">
                <Bath className="w-8 h-8 text-green-600 mb-2"/>
                <span className="font-bold">{property.bathrooms}</span>
                <span className="text-sm text-gray-500">Baños</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-100 rounded-lg">
                <Ruler className="w-8 h-8 text-green-600 mb-2"/>
                <span className="font-bold">{property.area} m²</span>
                <span className="text-sm text-gray-500">Área</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Descripción</h2>
            <p className="text-gray-600 leading-relaxed mb-8">{property.description}</p>
            
            {renderRequestButton()}
          </div>
        </div>
      </div>
    </div>
  );
} 