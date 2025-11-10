import { Employee } from '../../../domain/entities/Employee.entity';

export interface EmployeeWithCafeInfo {
  id: string;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  gender: string;
  daysWorked: number;
  cafe: string;
}

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  findAllWithCafeInfo(cafeId?: string): Promise<EmployeeWithCafeInfo[]>;
  create(employee: Employee): Promise<Employee>;
  update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}
