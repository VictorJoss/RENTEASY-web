"use client";
import { useState, useEffect } from "react";
import { getTenantApplications } from "@/lib/api-client";
import { Loader2, FileText, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MisSolicitudes() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getTenantApplications();
        setApplications(data);
      } catch (err) {
        setError("No se pudieron cargar tus solicitudes. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APROBADA":
        return "success";
      case "RECHAZADA":
        return "destructive";
      case "PENDIENTE":
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APROBADA":
        return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
      case "RECHAZADA":
        return <XCircle className="w-4 h-4 mr-2 text-red-500" />;
      case "PENDIENTE":
      default:
        return <Clock className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-2">Cargando tus solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Ocurrió un error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Mis Solicitudes de Alquiler
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Propiedad</TableHead>
                <TableHead>Fecha de Solicitud</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.propertyTitle}</TableCell>
                  <TableCell>
                    {new Date(app.applicationDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(app.status)}>
                      <div className="flex items-center">
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Aún no has enviado ninguna solicitud de alquiler.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 