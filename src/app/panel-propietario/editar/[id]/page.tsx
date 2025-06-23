"use client";
import EditPropertyForm from "@/components/propietario/EditarPropiedadForm";
import PropietarioDashboardFrame from "@/frames/PropietarioDashboardFrame";
import { useParams } from "next/navigation";

export default function EditPropertyPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    return (
        <PropietarioDashboardFrame>
            <div className="p-4 sm:p-6 lg:p-8">
                {id ? <EditPropertyForm propertyId={id} /> : <p>Cargando...</p>}
            </div>
        </PropietarioDashboardFrame>
    );
}
