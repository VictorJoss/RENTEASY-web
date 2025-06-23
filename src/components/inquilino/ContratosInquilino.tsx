"use client";
import { useEffect, useState } from "react";
import { getTenantContracts, getContractPaymentUrl } from "@/lib/api-client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IContract } from "@/types";
import { format } from "date-fns";

const ContractStatusBadge = ({ status }: { status: string }) => {
    const statusMap: { [key: string]: string } = {
        PENDIENTE_PAGO: "destructive",
        ACTIVO: "success",
        FINALIZADO: "secondary",
        CANCELADO: "secondary",
    };

    return <Badge variant={statusMap[status] || "default"}>{status.replace('_', ' ')}</Badge>;
};

export default function ContratosInquilino() {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [payingContractId, setPayingContractId] = useState<number | null>(null);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setLoading(true);
                const data = await getTenantContracts();
                setContracts(data);
            } catch (err) {
                setError("No se pudieron cargar los contratos. Inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, []);

    const handlePayment = async (contractId: number) => {
        setPayingContractId(contractId);
        try {
            const { url } = await getContractPaymentUrl(contractId);
            if (url) {
                window.open(url, "_blank");
            } else {
                // Manejar caso de URL nula o indefinida
                setError("No se pudo obtener la URL de pago.");
            }
        } catch (err) {
            setError("Error al procesar el pago. Inténtalo de nuevo.");
        } finally {
            setPayingContractId(null);
        }
    };

    if (loading) return <p>Cargando contratos...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Mis Contratos</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Propiedad</TableHead>
                        <TableHead>Monto Mensual</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha de Inicio</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contracts.length > 0 ? (
                        contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell>{contract.propertyTitle}</TableCell>
                                <TableCell>${new Intl.NumberFormat('es-CO').format(contract.monthlyAmount)}</TableCell>
                                <TableCell>
                                    <ContractStatusBadge status={contract.status} />
                                </TableCell>
                                <TableCell>{format(new Date(contract.startDate), "dd/MM/yyyy")}</TableCell>
                                <TableCell>
                                    {contract.status === "PENDIENTE_PAGO" && (
                                        <Button
                                            onClick={() => handlePayment(contract.id)}
                                            disabled={payingContractId === contract.id}
                                        >
                                            {payingContractId === contract.id ? "Procesando..." : "Pagar"}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No tienes contratos.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
