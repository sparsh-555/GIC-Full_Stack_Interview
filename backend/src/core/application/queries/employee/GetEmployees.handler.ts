import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { GetEmployeesQuery } from './GetEmployees.query';
import { EmployeeDto } from '../../dtos/EmployeeDto';
import { IEmployeeRepository } from '../../interfaces/repositories/IEmployeeRepository';

@injectable()
export class GetEmployeesHandler implements IRequestHandler<GetEmployeesQuery, EmployeeDto[]> {
  constructor(
    @inject('IEmployeeRepository') private employeeRepo: IEmployeeRepository
  ) {}

  async handle(query: GetEmployeesQuery): Promise<EmployeeDto[]> {
    const employees = await this.employeeRepo.findAllWithCafeInfo(query.cafe);

    return employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      emailAddress: emp.emailAddress,
      phoneNumber: emp.phoneNumber,
      gender: emp.gender,
      daysWorked: emp.daysWorked,
      cafe: emp.cafe,
    }));
  }
}
