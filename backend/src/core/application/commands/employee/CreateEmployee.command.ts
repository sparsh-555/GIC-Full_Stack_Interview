import { IRequest } from '../../../../infrastructure/mediator/IMediator';
import { EmployeeDto } from '../../dtos/EmployeeDto';

export class CreateEmployeeCommand implements IRequest<EmployeeDto> {
  constructor(
    public readonly name: string,
    public readonly emailAddress: string,
    public readonly phoneNumber: string,
    public readonly gender: 'Male' | 'Female',
    public readonly cafeId?: string
  ) {}
}
