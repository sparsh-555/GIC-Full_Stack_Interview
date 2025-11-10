import { IRequest } from '../../../../infrastructure/mediator/IMediator';
import { EmployeeDto } from '../../dtos/EmployeeDto';

export class GetEmployeesQuery implements IRequest<EmployeeDto[]> {
  constructor(public readonly cafe?: string) {}
}
