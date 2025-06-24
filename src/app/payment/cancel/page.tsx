"use client";
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleGoToContracts = () => {
    router.push('/panel-inquilino/contratos');
  };

  const handleGoToHome = () => {
    router.push('/panel-inquilino');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Pago Cancelado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-gray-600 text-lg">
              Has cancelado el proceso de pago.
            </p>
            <p className="text-sm text-gray-500">
              Tu contrato permanece en estado pendiente de pago. Puedes intentar realizar el pago nuevamente cuando estés listo.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">
              💡 Tu solicitud de alquiler sigue siendo válida
            </p>
            <p className="text-sm text-blue-700 font-medium">
              🔄 Puedes realizar el pago en cualquier momento
            </p>
            <p className="text-sm text-blue-700 font-medium">
              📞 Contacta a soporte si necesitas ayuda
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleGoToContracts}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Contratos
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
        </CardContent>
      </Card>
    </div>
  );
} 