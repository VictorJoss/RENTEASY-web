"use client";
import DetalleContrato from "@/components/shared/DetalleContrato";
import InquilinoDashboardFrame from "@/frames/InquilinoDashboardFrame";
import { Suspense, use } from "react";
import { Loader2 } from "lucide-react";

export default function ContratoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: contractId } = use(params);
  return (
    <InquilinoDashboardFrame>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      }>
        <DetalleContrato contractId={contractId} />
      </Suspense>
    </InquilinoDashboardFrame>
  );
} 