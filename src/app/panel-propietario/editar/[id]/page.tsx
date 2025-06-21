"use client";
import PropietarioDashboardFrame from "@/frames/PropietarioDashboardFrame";
import NuevaPropiedadForm from "@/components/propietario/NuevaPropiedadForm";
import { useParams } from "next/navigation";

const mockProperties = [
  { id: "1", title: "Apartamento en Bogotá", location: "Chapinero", type: "Apartamento", price: "1200000", images: ["foto1.jpg"], description: "Hermoso apartamento en el centro de Bogotá, cerca a todo." },
  { id: "2", title: "Casa en Medellín", location: "El Poblado", type: "Casa", price: "2500000", images: ["foto2.jpg"], description: "Casa amplia en zona exclusiva de Medellín." },
];

export default function EditarPropiedadPage() {
  const params = useParams();
  const id = params?.id as string;
  const propiedad = mockProperties.find((p) => p.id === id);

  return (
    <PropietarioDashboardFrame>
      {propiedad ? (
        <NuevaPropiedadForm modoEdicion={true} datosPropiedad={propiedad} />
      ) : (
        <div className="text-red-600 font-bold">Propiedad no encontrada</div>
      )}
    </PropietarioDashboardFrame>
  );
}
