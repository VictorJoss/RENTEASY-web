"use client";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Home, FileText, AlertTriangle, BarChart2, Users, AlertCircle, Settings, HelpCircle, History, FileText as FileTextIcon, MessageSquare } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



const menuItems = [
  { label: "Dashboard", href: "/panel-admin", icon: <BarChart2 size={20} /> },
  { label: "Usuarios", href: "/panel-admin/usuarios", icon: <Users size={20} /> },
  { label: "Soporte", href: "/panel-admin/soporte", icon: <MessageSquare size={20} /> },
  { label: "Auditoría", href: "/panel-admin/auditoria", icon: <History size={20} /> },
  { label: "Reportes", href: "/panel-admin/reportes", icon: <FileTextIcon size={20} /> },
  { label: "Contenido", href: "/panel-admin/contenido", icon: <Settings size={20} /> },
];

const actividad = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Nuevos usuarios",
      data: [10, 15, 12, 18, 20, 22],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.1)",
      tension: 0.3,
    },
    {
      label: "Contratos firmados",
      data: [5, 8, 7, 10, 12, 14],
      borderColor: "#f59e42",
      backgroundColor: "rgba(245,158,66,0.1)",
      tension: 0.3,
    },
  ],
};

const actividadOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: true, text: "Actividad reciente" },
  },
};

interface AdminDashboardFrameProps {
  children: ReactNode;
}

export default function AdminDashboardFrame({ children }: AdminDashboardFrameProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Menú lateral */}
      <div className="w-64 bg-white border-r border-neutral-200 p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-600">RentEasy</h2>
          <p className="text-sm text-neutral-500">Panel de administración</p>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Panel de administrador</h1>
        {/* Cards de resumen */}

        {/* Gráfico de actividad */}
        {/* <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-3xl mx-auto" style={{ minHeight: 350, maxHeight: 400 }}>
          <Line data={actividad} options={actividadOptions} height={120} />
        </div> */}
        {/* Contenido específico de cada página */}
        {children}
      </div>
    </div>
  );
}
