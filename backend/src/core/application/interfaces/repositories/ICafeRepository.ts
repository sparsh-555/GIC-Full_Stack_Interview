import { Cafe } from '../../../domain/entities/Cafe.entity';

export interface CafeWithEmployeeCount {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  location: string;
  employees: number;
}

export interface ICafeRepository {
  findAll(): Promise<Cafe[]>;
  findById(id: string): Promise<Cafe | null>;
  findAllWithEmployeeCount(location?: string): Promise<CafeWithEmployeeCount[]>;
  create(cafe: Cafe): Promise<Cafe>;
  update(id: string, cafe: Partial<Cafe>): Promise<Cafe | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
