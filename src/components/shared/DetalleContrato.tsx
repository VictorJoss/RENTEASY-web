"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, User, Home, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getContractById, apiClient } from '@/lib/api-client';

// Definimos la interfaz aquí para reutilizarla
interface ContractDetails {
    id: number;
    propertyTitle: string;
    tenantName: string;
    ownerName: string;
    status: string;
    startDate: string;
    endDate: string;
    monthlyAmount: number;
    termsAndConditions: string;
    property: {
        address: string;
        description: string;
    }
}

export default function DetalleContrato({ contractId }: { contractId: string }) {
    const [contract, setContract] = useState<ContractDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const data = await getContractById(parseInt(contractId, 10));
                setContract(data);
            } catch (err) {
                setError('No se pudo cargar el contrato.');
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [contractId]);

    const downloadPdf = async () => {
        try {
            setDownloading(true);
            
            const response = await apiClient.get(`/api/contracts/${contract?.id}/download-pdf`, {
                responseType: 'blob',
            });

            // Crear un enlace temporal para descargar el archivo
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `contrato-${contract?.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
            alert('Error al descargar el PDF. Por favor, inténtalo de nuevo.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    if (error) return <div className="text-red-500 text-center p-10">{error}</div>;
    if (!contract) return null;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600" />Detalles del Contrato</span>
                    <Button onClick={downloadPdf} disabled={downloading}>
                        {downloading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="mr-2 h-4 w-4" />
                        )}
                        {downloading ? 'Descargando...' : 'Descargar PDF'}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Información de la Propiedad</h3>
                    <p><strong>Propiedad:</strong> {contract.propertyTitle}</p>
                    <p><strong>Dirección:</strong> {contract.property.address}</p>
                    <p><strong>Descripción:</strong> {contract.property.description}</p>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Partes Involucradas</h3>
                    <p><strong>Arrendador (Propietario):</strong> {contract.ownerName}</p>
                    <p><strong>Arrendatario (Inquilino):</strong> {contract.tenantName}</p>
                </div>
                <div className="md:col-span-2 space-y-4">
                     <h3 className="font-semibold text-lg border-b pb-2">Condiciones del Contrato</h3>
                     <p><strong>Monto Mensual:</strong> ${new Intl.NumberFormat('es-CO').format(contract.monthlyAmount)}</p>
                     <p><strong>Fecha de Inicio:</strong> {format(new Date(contract.startDate), 'dd MMMM, yyyy', { locale: es })}</p>
                     <p><strong>Fecha de Finalización:</strong> {format(new Date(contract.endDate), 'dd MMMM, yyyy', { locale: es })}</p>
                </div>
                 <div className="md:col-span-2 space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-2">Términos y Condiciones</h3>
                    <div className="p-4 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap">
                        {contract.termsAndConditions}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 