import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para enviar cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function register(data: { name: string; email: string; password: string; document: string; role: string }) {
  try {
    const response = await apiClient.post('/api/auth/signup', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al registrar usuario');
    }
    throw new Error('Error de red o del servidor');
  }
}

export async function login(data: { email: string; password: string }): Promise<{ role: string }> {
  try {
    const response = await apiClient.post('/api/auth/signin', data);
    const userData = response.data;

    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      roles: userData.roles,
      token: userData.token,
    }));

    const mainRole = userData.roles[0].replace('ROLE_', '').toLowerCase();
    return { role: mainRole };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error("Credenciales incorrectas");
      }
      throw new Error(error.response.data.message || `Error: ${error.response.status}`);
    }
    throw new Error('Error de red o del servidor');
  }
}

export async function recoverPassword(data: { email: string }) {
  // TODO: Implementar la llamada al endpoint de recuperación de contraseña cuando exista.
  console.log("Recover password for", data.email);
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

// --- Helper functions ---

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/signout');
  } catch (error) {
    console.error("Error al cerrar sesión en el servidor:", error);
  } finally {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

// Se puede crear una instancia de apiClient exportada para usar en otras partes
export { apiClient };

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data);
};

export const getMyProperties = () => apiClient.get('/api/properties/my-properties');

export const getPropertyById = (id: string) => apiClient.get(`/api/properties/${id}`);

export const createProperty = (data: any) => {
  const { images, ...rest } = data;
  return uploadFiles(images).then(imageUrls => {
    return apiClient.post('/api/properties', { ...rest, images: imageUrls });
  });
};

export const updateProperty = (id: string, data: any) => apiClient.put(`/api/properties/${id}`, data);

export const archiveProperty = (id: number) => apiClient.delete(`/api/properties/${id}`);

export const uploadFiles = (files: FileList) => {
  const uploadPromises: Promise<string>[] = [];
  for (let i = 0; i < files.length; i++) {
    uploadPromises.push(uploadFile(files[i]));
  }
  return Promise.all(uploadPromises);
};

export const getFeaturedProperties = () => apiClient.get('/api/properties/random');

export const getPublicPropertyById = (id: string) => apiClient.get(`/api/properties/public/${id}`);

export const searchProperties = (filters: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
}) => {
  const params = new URLSearchParams();
  
  if (filters.city) params.append('city', filters.city);
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
  if (filters.search) params.append('search', filters.search);
  
  return apiClient.get(`/api/properties/search?${params.toString()}`);
};

export const createRentalApplication = (propertyId: number) => {
    return apiClient.post('/api/rental-applications', { propertyId });
};

export const getOwnerApplications = async () => {
  const response = await apiClient.get('/api/rental-applications/owner');
  return response.data;
};

export const getTenantApplications = async () => {
  const response = await apiClient.get('/api/rental-applications/tenant');
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string) => {
  const response = await apiClient.put(`/api/rental-applications/${id}/status`, { status });
  return response.data;
};

export const updateContractTerms = async (id: number, data: { termsAndConditions: string }) => {
  const response = await apiClient.put(`/api/contracts/${id}/terms`, data);
  return response.data;
};

export const getContractById = async (id: number) => {
  const response = await apiClient.get(`/api/contracts/${id}`);
  return response.data;
};

export const getTenantContracts = async () => {
  const response = await apiClient.get('/api/contracts/tenant');
  return response.data;
};

export const getOwnerContracts = async () => {
  const response = await apiClient.get('/api/contracts/owner');
  return response.data;
};

export const getContractPaymentUrl = async (contractId: number) => {
  const response = await apiClient.get(`/api/contracts/${contractId}/payment-url`);
  return response.data;
};

export const createContract = async (contractData: any) => {
  // ... existing code ...
};

// Funciones para debugging y testing
export const debugContracts = async () => {
  const response = await apiClient.get('/api/contracts/debug');
  return response.data;
};

export const forceActivateContract = async (contractId: number) => {
  const response = await apiClient.post(`/api/contracts/${contractId}/force-activate`);
  return response.data;
};

// Función para obtener resumen del inquilino
export const getTenantSummary = async () => {
  const response = await apiClient.get('/api/contracts/tenant/summary');
  return response.data;
};

// Función para obtener historial de pagos del inquilino
export const getPaymentHistory = async () => {
  const response = await apiClient.get('/api/contracts/tenant/payment-history');
  return response.data;
};
