"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropietarioDashboardFrame from "@/frames/PropietarioDashboardFrame";
import NuevaPropiedadForm from "@/components/propietario/NuevaPropiedadForm";
import { getPropertyById } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function EditarPropiedadPage() {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const data = await getPropertyById(id as string);
          setPropertyData(data);
        } catch (err) {
          setError("No se pudo cargar la propiedad.");
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <PropietarioDashboardFrame>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="ml-2">Cargando datos de la propiedad...</p>
        </div>
      </PropietarioDashboardFrame>
    );
  }

  if (error) {
    return (
      <PropietarioDashboardFrame>
        <div className="text-red-500 text-center">{error}</div>
      </PropietarioDashboardFrame>
    );
  }

  return (
    <PropietarioDashboardFrame>
      <NuevaPropiedadForm modoEdicion={true} datosPropiedad={propertyData} />
    </PropietarioDashboardFrame>
  );
}
