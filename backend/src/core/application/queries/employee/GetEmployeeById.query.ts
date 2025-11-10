import { IRequest } from '../../../../infrastructure/mediator/IMediator';
import { EmployeeDto } from '../../dtos/EmployeeDto';

export class GetEmployeeByIdQuery implements IRequest<EmployeeDto> {
  constructor(public readonly id: string) {}
}
