"use client";

import { useEffect, useState } from 'react';
import { getOwnerApplications, updateApplicationStatus } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
    id: number;
    propertyTitle: string;
    tenantName: string;
    status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
    applicationDate: string;
}

export default function ListaSolicitudes() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getOwnerApplications();
            setApplications(data);
        } catch (err) {
            setError('No se pudieron cargar las solicitudes.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: 'APROBADA' | 'RECHAZADA') => {
        setUpdatingId(id);
        try {
            const updatedApplication = await updateApplicationStatus(id, status);
            setApplications(apps => apps.map(app => app.id === id ? updatedApplication : app));
        } catch (err) {
            // TODO: Add better error handling, like a toast notification
            console.error(`Error updating application ${id} to ${status}`, err);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status: Application['status']) => {
        switch (status) {
            case 'APROBADA':
                return <Badge variant="default" className="bg-green-500">Aprobada</Badge>;
            case 'RECHAZADA':
                return <Badge variant="destructive">Rechazada</Badge>;
            case 'PENDIENTE':
            default:
                return <Badge variant="secondary">Pendiente</Badge>;
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-8">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Solicitudes de Alquiler Recibidas</h2>
            {applications.length === 0 ? (
                <p>No tienes solicitudes pendientes.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Propiedad</TableHead>
                            <TableHead>Inquilino</TableHead>
                            <TableHead>Fecha Solicitud</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.propertyTitle}</TableCell>
                                <TableCell>{app.tenantName}</TableCell>
                                <TableCell>{format(new Date(app.applicationDate), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                <TableCell className="text-right">
                                    {app.status === 'PENDIENTE' && (
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleUpdateStatus(app.id, 'APROBADA')}
                                                disabled={updatingId === app.id}
                                            >
                                                {updatingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleUpdateStatus(app.id, 'RECHAZADA')}
                                                disabled={updatingId === app.id}
                                            >
                                                {updatingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
} 