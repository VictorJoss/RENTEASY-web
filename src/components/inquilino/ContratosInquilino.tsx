"use client";
import { useEffect, useState } from "react";
import { getTenantContracts, getContractPaymentUrl } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, Home, DollarSign, Calendar, CheckCircle, AlertTriangle, CreditCard, ExternalLink, Loader } from "lucide-react";

interface Contract {
  id: number;
  propertyName: string;
  rentAmount: number;
  status: string;
  startDate: string;
  endDate: string;
}

const ContractStatusBadge = ({ status }: { status: string }) => {
  const statusMap: { [key: string]: { variant: "destructive" | "success" | "secondary" | "outline", icon: JSX.Element } } = {
    PENDIENTE_PAGO: { variant: "destructive", icon: <AlertTriangle className="w-3 h-3" /> },
    PENDIENTE_FIRMA: { variant: "outline", icon: <AlertTriangle className="w-3 h-3" /> },
    ACTIVO: { variant: "success", icon: <CheckCircle className="w-3 h-3" /> },
    FINALIZADO: { variant: "secondary", icon: <CheckCircle className="w-3 h-3" /> },
    CANCELADO: { variant: "secondary", icon: <CheckCircle className="w-3 h-3" /> },
  };

  const currentStatus = statusMap[status] || { variant: "secondary", icon: <CheckCircle className="w-3 h-3" /> };

  return <Badge variant={currentStatus.variant} className="flex items-center gap-1.5 capitalize">{currentStatus.icon} {status.replace(/_/g, ' ').toLowerCase()}</Badge>;
};

export default function ContratosInquilino() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingContractId, setPayingContractId] = useState<number | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await getTenantContracts();
        setContracts(data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar tus contratos. Por favor, inténtalo de nuevo más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handlePayment = async (contractId: number) => {
    setPayingContractId(contractId);
    try {
      const data = await getContractPaymentUrl(contractId);
      if (data && data.paymentUrl) {
        window.open(data.paymentUrl, "_blank");
      } else {
        setError("No se pudo obtener la URL de pago. Por favor, contacta a soporte.");
      }
    } catch (err) {
      setError("Error al procesar el pago. Inténtalo de nuevo o contacta a soporte.");
      console.error(err);
    } finally {
      setPayingContractId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-neutral-100">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Cargando tus contratos...</h2>
        <p className="text-neutral-500">Un momento, por favor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-red-50 rounded-xl shadow-sm border border-red-200 text-red-700">
        <AlertTriangle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-semibold">Ocurrió un error</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-7 h-7 text-blue-600" /> Mis Contratos</h2>
      <div className="overflow-x-auto rounded-xl shadow border border-neutral-100 bg-white">
        <table className="min-w-full text-sm align-middle">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-5 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap flex items-center gap-2"><Home className="w-4 h-4"/>Propiedad</th>
              <th className="px-5 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap flex items-center gap-2"><DollarSign className="w-4 h-4"/>Monto Mensual</th>
              <th className="px-5 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap flex items-center gap-2"><CheckCircle className="w-4 h-4"/>Estado</th>
              <th className="px-5 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap flex items-center gap-2"><Calendar className="w-4 h-4"/>Fecha de Inicio</th>
              <th className="px-5 py-3 border-b text-left text-xs text-neutral-500 font-semibold whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap text-neutral-800 font-medium">{contract.propertyName}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-green-600 font-semibold">${new Intl.NumberFormat('es-CO').format(contract.rentAmount)}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <ContractStatusBadge status={contract.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-neutral-600">{format(new Date(contract.startDate), "dd/MM/yyyy")}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {contract.status === "PENDIENTE_PAGO" && (
                      <Button
                        size="sm"
                        onClick={() => handlePayment(contract.id)}
                        disabled={payingContractId === contract.id}
                        className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow flex items-center gap-1.5"
                      >
                        {payingContractId === contract.id 
                          ? <><Loader className="w-4 h-4 animate-spin"/> Procesando...</>
                          : <><CreditCard className="w-4 h-4" /> Pagar Renta</>
                        }
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="ml-2 flex items-center gap-1.5"><ExternalLink className="w-4 h-4"/> Ver Detalles</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-16 text-neutral-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-neutral-300"/>
                  <p className="font-semibold">No tienes contratos aún.</p>
                  <p className="text-sm">Cuando alquiles una propiedad, tu contrato aparecerá aquí.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
