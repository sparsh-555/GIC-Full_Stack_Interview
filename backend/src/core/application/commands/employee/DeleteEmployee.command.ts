import { IRequest } from '../../../../infrastructure/mediator/IMediator';

export class DeleteEmployeeCommand implements IRequest<boolean> {
  constructor(public readonly id: string) {}
}
