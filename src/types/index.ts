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

