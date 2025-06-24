"use client";
import { useEffect, useState } from "react";
import { getTenantContracts, getContractPaymentUrl } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, Home, DollarSign, Calendar, CheckCircle, AlertTriangle, CreditCard, ExternalLink, Loader } from "lucide-react";
import Link from 'next/link';

interface Contract {
  id: number;
  propertyTitle: string;
  monthlyAmount: number;
  status: string;
  startDate: string;
  endDate: string;
}

const ContractStatusBadge = ({ status }: { status: string }) => {
  const statusMap: { [key: string]: { variant: "destructive" | "success" | "secondary" | "outline", icon: JSX.Element, className: string } } = {
    PENDIENTE_PAGO: { variant: "destructive", icon: <AlertTriangle className="w-4 h-4" />, className: "bg-red-100 text-red-800 border-red-200"},
    PENDIENTE_FIRMA: { variant: "outline", icon: <AlertTriangle className="w-4 h-4" />, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    ACTIVO: { variant: "success", icon: <CheckCircle className="w-4 h-4" />, className: "bg-green-100 text-green-800 border-green-200" },
    FINALIZADO: { variant: "secondary", icon: <CheckCircle className="w-4 h-4" />, className: "bg-gray-100 text-gray-800 border-gray-200" },
    CANCELADO: { variant: "secondary", icon: <CheckCircle className="w-4 h-4" />, className: "bg-gray-100 text-gray-800 border-gray-200" },
  };

  const currentStatus = statusMap[status] || { variant: "secondary", icon: <CheckCircle className="w-4 h-4" />, className: "bg-gray-100 text-gray-800" };

  return <Badge variant={currentStatus.variant} className={`flex items-center gap-1.5 capitalize font-semibold text-sm px-3 py-1 ${currentStatus.className}`}>{currentStatus.icon} {status.replace(/_/g, ' ').toLowerCase()}</Badge>;
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
      if (data && data.url) {
        window.open(data.url, "_blank");
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600" /> Mis Contratos</h2>
      </div>
      
      {contracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <Card key={contract.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Home className="w-6 h-6 text-blue-500" />
                  {contract.propertyTitle}
                </CardTitle>
                <div className="pt-2">
                  <ContractStatusBadge status={contract.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-lg">
                  <DollarSign className="w-5 h-5 text-green-600"/>
                  <span className="font-bold text-green-700">${new Intl.NumberFormat('es-CO').format(contract.monthlyAmount)}</span>
                  <span className="text-neutral-500">/ mes</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600">
                  <Calendar className="w-5 h-5 text-gray-500"/>
                  <span>{format(new Date(contract.startDate), "dd MMM, yyyy")} - {format(new Date(contract.endDate), "dd MMM, yyyy")}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-gray-50 p-4">
                {contract.status === "PENDIENTE_PAGO" && (
                  <Button
                    onClick={() => handlePayment(contract.id)}
                    disabled={payingContractId === contract.id}
                    className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-md flex items-center gap-2"
                  >
                    {payingContractId === contract.id 
                      ? <><Loader className="w-4 h-4 animate-spin"/> Procesando...</>
                      : <><CreditCard className="w-5 h-5" /> Pagar Primer Mes</>
                    }
                  </Button>
                )}
                 <Button asChild size="sm" variant="outline" className="flex items-center gap-1.5">
                    <Link href={`/panel-inquilino/contratos/${contract.id}`}>
                      <ExternalLink className="w-4 h-4"/> Ver Detalles
                    </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500 bg-white rounded-xl shadow-sm border border-neutral-100">
            <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-300"/>
            <h3 className="text-xl font-semibold text-neutral-700">No tienes contratos aún.</h3>
            <p className="mt-2 text-md">Cuando alquiles una propiedad y completes el pago, tu contrato activo aparecerá aquí.</p>
        </div>
      )}
    </div>
  );
}
