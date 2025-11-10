import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { GetEmployeeByIdQuery } from './GetEmployeeById.query';
import { EmployeeDto } from '../../dtos/EmployeeDto';
import { IEmployeeRepository } from '../../interfaces/repositories/IEmployeeRepository';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class GetEmployeeByIdHandler implements IRequestHandler<GetEmployeeByIdQuery, EmployeeDto> {
  constructor(
    @inject('IEmployeeRepository') private employeeRepo: IEmployeeRepository
  ) {}

  async handle(query: GetEmployeeByIdQuery): Promise<EmployeeDto> {
    const employee = await this.employeeRepo.findById(query.id);
    if (!employee) {
      throw new NotFoundException('Employee', query.id);
    }

    return {
      id: employee.id,
      name: employee.name,
      emailAddress: employee.emailAddress,
      phoneNumber: employee.phoneNumber,
      gender: employee.gender,
    };
  }
}
