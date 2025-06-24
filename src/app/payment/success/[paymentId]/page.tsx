"use client";
import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Home, Loader2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContractById, forceActivateContract } from '@/lib/api-client';

interface PaymentStatus {
  success: boolean;
  loading: boolean;
  contractStatus: string | null;
  error: string | null;
  canForceActivate: boolean;
}

export default function PaymentSuccessPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    success: false,
    loading: true,
    contractStatus: null,
    error: null,
    canForceActivate: false
  });
  const [forceActivating, setForceActivating] = useState(false);

  // Obtener el contract_id de los parámetros URL si está disponible
  const contractId = searchParams.get('contract_id') || paymentId;

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setPaymentStatus(prev => ({ ...prev, loading: true }));
        
        // Verificar el estado real del contrato
        const contractData = await getContractById(parseInt(contractId, 10));
        
        const isSuccess = contractData.status === 'ACTIVO';
        const isPending = contractData.status === 'PENDIENTE_PAGO';
        
        setPaymentStatus({
          success: isSuccess,
          loading: false,
          contractStatus: contractData.status,
          error: null,
          canForceActivate: isPending
        });

        // Redireccionar automáticamente solo si el pago fue exitoso
        if (isSuccess) {
          const timer = setTimeout(() => {
            router.push('/panel-inquilino/contratos');
          }, 8000);
          return () => clearTimeout(timer);
        }
        
      } catch (error) {
        console.error('Error verificando estado del pago:', error);
        setPaymentStatus({
          success: false,
          loading: false,
          contractStatus: null,
          error: 'No se pudo verificar el estado del pago',
          canForceActivate: false
        });
      }
    };

    // Esperar un poco para que el webhook procese
    const initialDelay = setTimeout(() => {
      checkPaymentStatus();
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, [contractId, router]);

  const handleForceActivate = async () => {
    try {
      setForceActivating(true);
      await forceActivateContract(parseInt(contractId, 10));
      
      // Recargar el estado después de la activación forzada
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al forzar activación:', error);
      alert('Error al activar el contrato. Inténtalo de nuevo.');
    } finally {
      setForceActivating(false);
    }
  };

  const handleGoToContracts = () => {
    router.push('/panel-inquilino/contratos');
  };

  const handleGoToHome = () => {
    router.push('/panel-inquilino');
  };

  const handleRetryPayment = () => {
    router.push('/panel-inquilino/contratos');
  };

  if (paymentStatus.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-800">
              Verificando Pago...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos verificando el estado de tu pago. Un momento por favor...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Error de Verificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {paymentStatus.error}
            </p>
            <Button onClick={handleGoToContracts} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Volver a Mis Contratos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              ¡Pago Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-gray-600 text-lg">
                Tu pago ha sido procesado correctamente.
              </p>
              <p className="text-sm text-gray-500">
                Tu contrato ha sido activado automáticamente. Ya puedes disfrutar de tu nueva propiedad.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">
                ✓ Contrato activado
              </p>
              <p className="text-sm text-green-700 font-medium">
                ✓ Propiedad reservada
              </p>
              <p className="text-sm text-green-700 font-medium">
                ✓ Notificaciones enviadas
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleGoToContracts}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Ver Mis Contratos
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoToHome}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir al Panel Principal
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              Serás redirigido automáticamente en unos segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pago fallido o estado pendiente
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-800">
            Pago Realizado - Procesando...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-600 text-lg">
              Tu pago fue procesado por Wompi, pero aún no se ha activado el contrato.
            </p>
            <p className="text-sm text-gray-500">
              Estado del contrato: <span className="font-bold">{paymentStatus.contractStatus}</span>
            </p>
            {paymentStatus.canForceActivate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-3">
                  Si realizaste el pago exitosamente y no se activó automáticamente, puedes forzar la activación:
                </p>
                <Button 
                  onClick={handleForceActivate}
                  disabled={forceActivating}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {forceActivating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Activando...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Activar Contrato Manualmente</>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={handleGoToContracts}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver a Mis Contratos
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRetryPayment}
              className="w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Intentar Pago Nuevamente
            </Button>
          </div>

          <p className="text-xs text-gray-400">
            El sistema verificará automáticamente el estado cada pocos segundos...
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 