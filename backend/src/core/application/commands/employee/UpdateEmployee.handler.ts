import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { UpdateEmployeeCommand } from './UpdateEmployee.command';
import { EmployeeDto } from '../../dtos/EmployeeDto';
import { IEmployeeRepository } from '../../interfaces/repositories/IEmployeeRepository';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';
import { IEmployeeCafeRepository } from '../../interfaces/repositories/IEmployeeCafeRepository';
import { EmployeeCafe } from '../../../domain/entities/EmployeeCafe.entity';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class UpdateEmployeeHandler implements IRequestHandler<UpdateEmployeeCommand, EmployeeDto> {
  constructor(
    @inject('IEmployeeRepository') private employeeRepo: IEmployeeRepository,
    @inject('ICafeRepository') private cafeRepo: ICafeRepository,
    @inject('IEmployeeCafeRepository') private employeeCafeRepo: IEmployeeCafeRepository
  ) {}

  async handle(command: UpdateEmployeeCommand): Promise<EmployeeDto> {
    // Check if employee exists
    const exists = await this.employeeRepo.exists(command.id);
    if (!exists) {
      throw new NotFoundException('Employee', command.id);
    }

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

    // Update employee
    const updatedEmployee = await this.employeeRepo.update(command.id, {
      name: command.name,
      emailAddress: command.emailAddress,
      phoneNumber: command.phoneNumber,
      gender: command.gender,
    });

    if (!updatedEmployee) {
      throw new NotFoundException('Employee', command.id);
    }

    // Update café assignment
    const currentAssignment = await this.employeeCafeRepo.findActiveByEmployeeId(command.id);

    if (command.cafeId) {
      // If employee has a current assignment and it's different, update it
      if (!currentAssignment || currentAssignment.cafeId !== command.cafeId) {
        // End current assignment if exists
        if (currentAssignment) {
          await this.employeeCafeRepo.endActiveRelationship(command.id);
        }
        // Create new assignment
        const relationship = new EmployeeCafe(command.id, command.cafeId, new Date(), null);
        await this.employeeCafeRepo.create(relationship);
      }
    } else {
      // If no café provided but employee has an assignment, end it
      if (currentAssignment) {
        await this.employeeCafeRepo.endActiveRelationship(command.id);
      }
    }

    return {
      id: updatedEmployee.id,
      name: updatedEmployee.name,
      emailAddress: updatedEmployee.emailAddress,
      phoneNumber: updatedEmployee.phoneNumber,
      gender: updatedEmployee.gender,
    };
  }
}
