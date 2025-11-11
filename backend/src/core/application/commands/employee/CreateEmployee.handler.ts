import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { CreateEmployeeCommand } from './CreateEmployee.command';
import { EmployeeDto } from '../../dtos/EmployeeDto';
import { IEmployeeRepository } from '../../interfaces/repositories/IEmployeeRepository';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';
import { IEmployeeCafeRepository } from '../../interfaces/repositories/IEmployeeCafeRepository';
import { Employee } from '../../../domain/entities/Employee.entity';
import { EmployeeCafe } from '../../../domain/entities/EmployeeCafe.entity';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class CreateEmployeeHandler implements IRequestHandler<CreateEmployeeCommand, EmployeeDto> {
  constructor(
    @inject('IEmployeeRepository') private employeeRepo: IEmployeeRepository,
    @inject('ICafeRepository') private cafeRepo: ICafeRepository,
    @inject('IEmployeeCafeRepository') private employeeCafeRepo: IEmployeeCafeRepository
  ) {}

  async handle(command: CreateEmployeeCommand): Promise<EmployeeDto> {
    // Validate
    if (command.name.length < 6 || command.name.length > 10) {
      throw new ValidationException('Employee name must be between 6 and 10 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(command.emailAddress)) {
      throw new ValidationException('Invalid email address format');
    }

    const phoneRegex = /^[89]\d{7}$/;
    if (!phoneRegex.test(command.phoneNumber)) {
      throw new ValidationException('Phone number must start with 8 or 9 and have 8 digits');
    }

    // Validate café exists if provided
    if (command.cafeId) {
      const cafeExists = await this.cafeRepo.exists(command.cafeId);
      if (!cafeExists) {
        throw new NotFoundException('Café', command.cafeId);
      }
    }

    // Generate employee ID
    const employeeId = await this.generateEmployeeId();

    // Create employee
    const employee = new Employee(
      employeeId,
      command.name,
      command.emailAddress,
      command.phoneNumber,
      command.gender
    );

    const savedEmployee = await this.employeeRepo.create(employee);

    // Assign to café if provided
    if (command.cafeId) {
      const relationship = new EmployeeCafe(savedEmployee.id, command.cafeId, new Date(), null);
      await this.employeeCafeRepo.create(relationship);
    }

    return {
      id: savedEmployee.id,
      name: savedEmployee.name,
      emailAddress: savedEmployee.emailAddress,
      phoneNumber: savedEmployee.phoneNumber,
      gender: savedEmployee.gender,
      daysWorked: 0,
      cafe: '',
    };
  }

  private async generateEmployeeId(): Promise<string> {
    const prefix = 'UI';
    let id: string;
    let exists = true;

    while (exists) {
      const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      id = `${prefix}${randomNum}`;
      exists = await this.employeeRepo.exists(id);
    }

    return id!;
  }
}
