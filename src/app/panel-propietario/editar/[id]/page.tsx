"use client";
import PropietarioDashboardFrame from "@/frames/PropietarioDashboardFrame";
import NuevaPropiedadForm from "@/components/propietario/NuevaPropiedadForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyById } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function EditarPropiedadPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [propiedad, setPropiedad] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const data = await getPropertyById(Number(id));
          setPropiedad(data);
        } catch (err: any) {
          setError("No se pudo cargar la propiedad. Verifique que exista y que usted sea el propietario.");
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);

  return (
    <PropietarioDashboardFrame>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="ml-2">Cargando datos de la propiedad...</p>
        </div>
      ) : error ? (
        <div className="text-red-600 font-bold text-center">{error}</div>
      ) : propiedad ? (
        <NuevaPropiedadForm modoEdicion={true} datosPropiedad={propiedad} />
      ) : (
        <div className="text-red-600 font-bold text-center">Propiedad no encontrada</div>
      )}
    </PropietarioDashboardFrame>
  );
}
