"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateContractTerms } from '@/lib/api-client';

export default function ConfigurarContratoForm({ contractId }: { contractId: string }) {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateContractTerms(parseInt(contractId, 10), { termsAndConditions: terms });
      router.push('/panel-propietario/contratos');
    } catch (err) {
      setError('No se pudieron guardar los términos. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <div className="space-y-4">
        <div>
          <Label htmlFor="terms" className="text-lg font-semibold">
            Términos y Condiciones del Contrato
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            Escriba aquí todas las cláusulas del contrato. Esta información será visible para el inquilino y formará parte del PDF del contrato.
          </p>
          <Textarea
            id="terms"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Ej: 1. El inquilino se compromete a no tener mascotas. 2. El subarriendo está prohibido..."
            className="h-64"
            required
          />
        </div>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Términos y Finalizar
        </Button>
      </div>
    </form>
  );
} 