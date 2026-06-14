export type User = {
  id: string;
  name: string;
  email: string;
  contact?: string;

  emergencyContact?: {
    name: string;
    phone: string;
  };

  createdAt?: string;
  updatedAt?: string;
};
