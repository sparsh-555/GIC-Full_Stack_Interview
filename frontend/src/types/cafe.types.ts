export interface Cafe {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  location: string;
  employees?: number;
}

export interface CreateCafeInput {
  name: string;
  description: string;
  logo?: string | null;
  location: string;
}

export interface UpdateCafeInput {
  id: string;
  name: string;
  description: string;
  logo?: string | null;
  location: string;
}
