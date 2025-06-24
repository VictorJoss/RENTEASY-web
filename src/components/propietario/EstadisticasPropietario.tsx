"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Home, 
  Users, 
  DollarSign, 
  FileText, 
  BarChart3,
  AlertCircle,
  Loader2,
  Download,
  Building,
  Target
} from "lucide-react";
import { getOwnerStatistics } from "@/lib/api-client";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface OwnerStatistics {
  // Estadísticas generales
  totalProperties: number;
  occupiedProperties: number;
  availableProperties: number;
  totalMonthlyIncome: number;
  totalReceivedPayments: number;
  averageOccupancyRate: number;
  
  // Contratos
  totalContracts: number;
  activeContracts: number;
  pendingPaymentContracts: number;
  finishedContracts: number;
  
  // Aplicaciones
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  
  // Detalles por propiedad
  propertyStats: PropertyStats[];
  
  // Evolución mensual
  monthlyIncomeHistory: MonthlyIncome[];
  
  // Ranking de propiedades
  propertyRanking: PropertyRanking[];
}

interface PropertyStats {
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  status: string;
  monthlyPrice: number;
  totalEarned: number;
  tenantName?: string;
  monthsOccupied: number;
  occupancyRate: number;
}

interface MonthlyIncome {
  month: string;
  monthName: string;
  income: number;
  activeContracts: number;
}

interface PropertyRanking {
  propertyId: number;
  propertyTitle: string;
  totalIncome: number;
  contractsCount: number;
  averageMonthlyIncome: number;
}

export default function EstadisticasPropietario() {
  const [statistics, setStatistics] = useState<OwnerStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const data = await getOwnerStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las estadísticas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-sm border border-neutral-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-neutral-700">Cargando estadísticas...</h2>
        <p className="text-neutral-500">Un momento, por favor.</p>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="flex flex-col justify-center items-center h-80 bg-red-50 rounded-xl shadow-sm border border-red-200 text-red-700">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-semibold">Error al cargar datos</h2>
        <p>{error}</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Configuración del gráfico de evolución de ingresos
  const chartData = {
    labels: statistics.monthlyIncomeHistory.map(m => m.monthName),
    datasets: [
      {
        label: "Ingresos Mensuales",
        data: statistics.monthlyIncomeHistory.map(m => m.income),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: "Evolución de Ingresos (Últimos 6 Meses)",
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  function exportarCSV() {
    const rows = [
      ["Mes", "Ingresos", "Contratos Activos"],
      ...statistics.monthlyIncomeHistory.map(m => [m.monthName, m.income, m.activeContracts])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "estadisticas-propietario.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Estadísticas del Propietario
        </h1>
        <p className="text-blue-100 mt-2">Panel de análisis y métricas de tu negocio inmobiliario</p>
      </div>

      {/* Tarjetas de resumen principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-700">Ingresos Mensuales</h3>
              <div className="text-2xl font-bold text-green-800">{formatCurrency(statistics.totalMonthlyIncome)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-700">Propiedades Totales</h3>
              <div className="text-2xl font-bold text-blue-800">{statistics.totalProperties}</div>
              <div className="text-xs text-blue-600">{statistics.occupiedProperties} ocupadas</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500 text-white p-3 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-700">Tasa de Ocupación</h3>
              <div className="text-2xl font-bold text-purple-800">{formatPercentage(statistics.averageOccupancyRate)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 text-white p-3 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-orange-700">Contratos Activos</h3>
              <div className="text-2xl font-bold text-orange-800">{statistics.activeContracts}</div>
              <div className="text-xs text-orange-600">de {statistics.totalContracts} totales</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Estadísticas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Estado de Propiedades
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ocupadas</span>
              <span className="font-semibold text-green-600">{statistics.occupiedProperties}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Disponibles</span>
              <span className="font-semibold text-blue-600">{statistics.availableProperties}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${statistics.totalProperties > 0 ? (statistics.occupiedProperties / statistics.totalProperties) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Estado de Contratos
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Activos</span>
              <span className="font-semibold text-green-600">{statistics.activeContracts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendiente pago</span>
              <span className="font-semibold text-yellow-600">{statistics.pendingPaymentContracts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Finalizados</span>
              <span className="font-semibold text-gray-600">{statistics.finishedContracts}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Solicitudes
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="font-semibold text-yellow-600">{statistics.pendingApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aprobadas</span>
              <span className="font-semibold text-green-600">{statistics.approvedApplications}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rechazadas</span>
              <span className="font-semibold text-red-600">{statistics.rejectedApplications}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de evolución de ingresos */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Evolución de Ingresos
          </h3>
          <Button onClick={exportarCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
        <Line data={chartData} options={chartOptions} />
      </Card>

      {/* Ranking de propiedades */}
      {statistics.propertyRanking.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Ranking de Propiedades por Ingresos
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos Totales
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contratos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio Mensual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statistics.propertyRanking.map((property, index) => (
                  <tr key={property.propertyId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.propertyTitle}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">{formatCurrency(property.totalIncome)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.contractsCount}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(property.averageMonthlyIncome)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detalles por propiedad */}
      {statistics.propertyStats.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            Detalles por Propiedad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistics.propertyStats.map((property) => (
              <div key={property.propertyId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">{property.propertyTitle}</h4>
                <p className="text-sm text-gray-600 mb-3">{property.propertyAddress}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Estado</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      property.status === 'RENTADO' ? 'bg-green-100 text-green-800' :
                      property.status === 'DISPONIBLE' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Precio mensual</span>
                    <span className="text-xs font-medium">{formatCurrency(property.monthlyPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total ganado</span>
                    <span className="text-xs font-medium text-green-600">{formatCurrency(property.totalEarned)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Ocupación</span>
                    <span className="text-xs font-medium">{formatPercentage(property.occupancyRate)}</span>
                  </div>
                  
                  {property.tenantName && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Inquilino</span>
                      <span className="text-xs font-medium">{property.tenantName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 