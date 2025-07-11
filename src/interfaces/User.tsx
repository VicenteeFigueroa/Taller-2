export interface User {
  firtsName: string;
  lastName: string;
  email: string;
  thelephone: string;
  street?: string;
  number?: string;
  commune?: string;
  region?: string;
  postalCode?: string;
  birthDate?: string; // Puedes usar string y luego parsear con Date
  registeredAt: string;
  lastAccess?: string;
  isActive: boolean;
}

export interface ShippingAddress {
  addressID?: number;
  street?: string;
  number?: string;
  commune?: string;
  region?: string;
  postalCode?: string;
  userId?: number;
}

export interface UpdateProfileDto {
  firtsName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string; // Puede ser Date o string según tu backend
  phone?: string;
}
