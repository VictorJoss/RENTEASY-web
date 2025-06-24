"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { getTenantSummary } from "@/lib/api-client";

interface TenantSummary {
  tenantName: string;
  tenantEmail: string;
  totalContracts: number;
  activeContracts: number;
  pendingPaymentContracts: number;
  finishedContracts: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  currentMonthlyPayment: number;
  totalPaidAmount: number;
  nextPaymentDue: number;
  recentContracts: ContractSummary[];
  recentApplications: ApplicationSummary[];
}

interface ContractSummary {
  id: number;
  propertyTitle: string;
  propertyAddress: string;
  status: string;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
}

interface ApplicationSummary {
  id: number;
  propertyTitle: string;
  propertyAddress: string;
  status: string;
  applicationDate: string;
  propertyPrice: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: { [key: string]: { variant: any, icon: JSX.Element, className: string } } = {
    ACTIVO: { variant: "default", icon: <CheckCircle className="w-3 h-3" />, className: "bg-green-100 text-green-800 border-green-200" },
    PENDIENTE_PAGO: { variant: "destructive", icon: <AlertCircle className="w-3 h-3" />, className: "bg-red-100 text-red-800 border-red-200" },
    FINALIZADO: { variant: "secondary", icon: <CheckCircle className="w-3 h-3" />, className: "bg-gray-100 text-gray-800 border-gray-200" },
    PENDIENTE: { variant: "outline", icon: <Clock className="w-3 h-3" />, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    APROBADA: { variant: "default", icon: <CheckCircle className="w-3 h-3" />, className: "bg-green-100 text-green-800 border-green-200" },
    RECHAZADA: { variant: "destructive", icon: <XCircle className="w-3 h-3" />, className: "bg-red-100 text-red-800 border-red-200" },
  };

  const config = statusConfig[status] || { variant: "secondary", icon: <Clock className="w-3 h-3" />, className: "bg-gray-100 text-gray-800" };

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 text-xs font-medium ${config.className}`}>
      {config.icon}
      {status.replace(/_/g, ' ').toLowerCase()}
    </Badge>
  );
};

export default function ResumenInquilino() {
  const [summary, setSummary] = useState<TenantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getTenantSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el resumen. Por favor, inténtalo de nuevo más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-neutral-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Cargando resumen...</h2>
        <p className="text-neutral-500">Un momento, por favor.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-red-50 rounded-xl shadow-sm border border-red-200 text-red-700">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-semibold">Ocurrió un error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Header de Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold">¡Bienvenido, {summary.tenantName}! 👋</h1>
        <p className="text-blue-100 mt-2">Aquí tienes un resumen de tu actividad en RentEasy</p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Contratos Activos</CardTitle>
            <Home className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{summary.activeContracts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.totalContracts} contratos en total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pago Mensual</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ${new Intl.NumberFormat('es-CO').format(summary.currentMonthlyPayment)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Suma de todos los contratos</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Solicitudes Activas</CardTitle>
            <FileText className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{summary.pendingApplications}</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.totalApplications} solicitudes en total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Próximo Pago</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              ${new Intl.NumberFormat('es-CO').format(summary.nextPaymentDue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Próximo mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Contratos y Solicitudes Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contratos Recientes */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Contratos Recientes
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/panel-inquilino/contratos">
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.recentContracts.length > 0 ? (
              summary.recentContracts.map((contract) => (
                <div key={contract.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{contract.propertyTitle}</h3>
                    <StatusBadge status={contract.status} />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {contract.propertyAddress}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-green-600">
                      ${new Intl.NumberFormat('es-CO').format(contract.monthlyAmount)}/mes
                    </span>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(contract.startDate).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tienes contratos aún</p>
                <p className="text-sm mt-1">Busca propiedades y envía solicitudes</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solicitudes Recientes */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Solicitudes Recientes
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/panel-inquilino/solicitudes">
                  Ver todas <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.recentApplications.length > 0 ? (
              summary.recentApplications.map((application) => (
                <div key={application.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{application.propertyTitle}</h3>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {application.propertyAddress}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-blue-600">
                      ${new Intl.NumberFormat('es-CO').format(application.propertyPrice)}/mes
                    </span>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(application.applicationDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tienes solicitudes aún</p>
                <p className="text-sm mt-1">Explora propiedades disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto py-4 px-6">
              <Link href="/buscar" className="flex flex-col items-center gap-2">
                <Home className="w-6 h-6" />
                <span className="font-medium">Buscar Propiedades</span>
                <span className="text-xs opacity-75">Encuentra tu hogar ideal</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 px-6">
              <Link href="/panel-inquilino/contratos" className="flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <span className="font-medium">Ver Contratos</span>
                <span className="text-xs opacity-75">Gestiona tus alquileres</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 px-6">
              <Link href="/panel-inquilino/pagos" className="flex flex-col items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <span className="font-medium">Historial de Pagos</span>
                <span className="text-xs opacity-75">Revisa tus transacciones</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 