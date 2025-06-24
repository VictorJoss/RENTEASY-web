import ListaSolicitudes from "@/components/propietario/ListaSolicitudes";
import PropietarioDashboardFrame from "@/frames/PropietarioDashboardFrame";

export default function SolicitudesPage() {
  return (
    <PropietarioDashboardFrame>
      <h1 className="text-3xl font-bold mb-6">Gestionar Solicitudes</h1>
      <ListaSolicitudes />
    </PropietarioDashboardFrame>
  );
} 