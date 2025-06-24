import ConfigurarContratoForm from "@/components/propietario/ConfigurarContratoForm";
import PropietarioDashboardFrame from "@/frames/PropietarioDashboardFrame";

export default function ConfigurarContratoPage({ params }: { params: { id: string } }) {
  return (
    <PropietarioDashboardFrame>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Configurar Términos del Contrato</h1>
        <p className="text-gray-500 mb-6">
          Define las cláusulas y condiciones específicas para este contrato de alquiler.
        </p>
        <ConfigurarContratoForm contractId={params.id} />
      </div>
    </PropietarioDashboardFrame>
  );
} 