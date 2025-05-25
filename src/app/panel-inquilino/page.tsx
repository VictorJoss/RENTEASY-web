import InquilinoDashboardFrame from "@/frames/InquilinoDashboardFrame";
import BuscarPropiedades from "@/components/inquilino/BuscarPropiedades";
import Header from "@/components/home/Header";
import ResumenInquilino from "@/components/inquilino/ResumenInquilino";

export default function InquilinoDashboardPage() {
  return (
    <InquilinoDashboardFrame>
      <div className="text-2xl font-bold mb-4">¡Bienvenido al panel de inquilino!</div>
      <p className="text-neutral-600 my-7">Explora y gestiona tus contratos, pagos e incidencias desde aquí.</p>
      {/* <BuscarPropiedades /> */}
      <ResumenInquilino />
    </InquilinoDashboardFrame>
  );
}
