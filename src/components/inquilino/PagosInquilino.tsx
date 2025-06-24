"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getPaymentHistory } from "@/lib/api-client";

interface PaymentHistory {
  id: number;
  contractId: number;
  propertyTitle: string;
  propertyAddress: string;
  amount: number;
  paymentDate: string | null;
  dueDate: string;
  status: string;
  paymentMethod: string;
  transactionId: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: { [key: string]: { icon: JSX.Element, className: string } } = {
    COMPLETADO: { icon: <CheckCircle className="w-3 h-3" />, className: "bg-green-100 text-green-800 border-green-200" },
    PENDIENTE: { icon: <Clock className="w-3 h-3" />, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  };

  const config = statusConfig[status] || { icon: <Clock className="w-3 h-3" />, className: "bg-gray-100 text-gray-800" };

  return (
    <Badge className={`flex items-center gap-1 text-xs font-medium ${config.className}`}>
      {config.icon}
      {status.toLowerCase()}
    </Badge>
  );
};

export default function PagosInquilino() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const data = await getPaymentHistory();
        setPayments(data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el historial de pagos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-neutral-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Cargando historial de pagos...</h2>
        <p className="text-neutral-500">Un momento, por favor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-red-50 rounded-xl shadow-sm border border-red-200 text-red-700">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-semibold">Error al cargar datos</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Historial de Pagos
        </h1>
        <p className="text-green-100 mt-2">Revisa todos tus pagos de alquiler</p>
      </div>

      {/* Tabla de Pagos */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Historial de Pagos ({payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transacción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.propertyTitle}</div>
                          <div className="text-sm text-gray-500">{payment.propertyAddress}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${new Intl.NumberFormat('es-CO').format(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentDate 
                          ? new Date(payment.paymentDate).toLocaleDateString('es-CO')
                          : 'Pendiente'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentMethod || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.transactionId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No hay pagos registrados</h3>
              <p>Aún no tienes pagos en tu historial.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 