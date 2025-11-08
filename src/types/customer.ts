export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  mowerDetails: {
    brand: string;
    model: string;
    serialNumber?: string;
    purchaseYear?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceHistory {
  id?: string;
  customerId: string;
  date: Date;
  serviceType: string;
  description: string;
  technician: string;
  cost: number;
  parts?: string;
  status: 'completed' | 'pending' | 'scheduled';
  createdAt: Date;
}

export interface Note {
  id?: string;
  customerId: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
