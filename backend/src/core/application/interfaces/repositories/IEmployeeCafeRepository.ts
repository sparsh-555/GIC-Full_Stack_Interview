import { EmployeeCafe } from '../../../domain/entities/EmployeeCafe.entity';

export interface IEmployeeCafeRepository {
  findActiveByCafeId(cafeId: string): Promise<EmployeeCafe[]>;
  findActiveByEmployeeId(employeeId: string): Promise<EmployeeCafe | null>;
  create(employeeCafe: EmployeeCafe): Promise<EmployeeCafe>;
  endActiveRelationship(employeeId: string): Promise<void>;
  deleteByCafeId(cafeId: string): Promise<void>;
  hasActiveRelationship(employeeId: string): Promise<boolean>;
}
