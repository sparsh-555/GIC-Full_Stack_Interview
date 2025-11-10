export interface CafeDto {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  location: string;
  employees?: number;
}

export interface CreateCafeDto {
  name: string;
  description: string;
  logo?: string | null;
  location: string;
}

export interface UpdateCafeDto {
  id: string;
  name: string;
  description: string;
  logo?: string | null;
  location: string;
}
