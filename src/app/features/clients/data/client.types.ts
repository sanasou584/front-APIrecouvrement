export interface Client {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientFilters {
  search: string;
}
