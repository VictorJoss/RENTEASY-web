export interface IRentalApplication {
    id: number;
    propertyId: number;
    propertyTitle: string;
    tenantId: number;
    tenantName: string;
    status: string;
    applicationDate: string;
}

export interface IContract {
    id: number;
    propertyId: number;
    propertyTitle: string;
    tenantId: number;
    tenantName: string;
    ownerId: number;
    ownerName: string;
    monthlyAmount: number;
    startDate: string;
    endDate: string;
    status: string;
    wompiPaymentId: string;
    createdAt: string;
}

export interface IOwnerStatistics {
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
  propertyStats: IPropertyStats[];
  
  // Evolución mensual
  monthlyIncomeHistory: IMonthlyIncome[];
  
  // Ranking de propiedades
  propertyRanking: IPropertyRanking[];
}

export interface IPropertyStats {
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

export interface IMonthlyIncome {
  month: string;
  monthName: string;
  income: number;
  activeContracts: number;
}

export interface IPropertyRanking {
  propertyId: number;
  propertyTitle: string;
  totalIncome: number;
  contractsCount: number;
  averageMonthlyIncome: number;
}

