export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'collector' | 'viewer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'collector' | 'viewer';
  password?: string;
  isActive: boolean;
}

export interface UserFilters {
  search: string;
  roleFilter?: string;
}

export type UserRole = 'admin' | 'manager' | 'collector' | 'viewer';
