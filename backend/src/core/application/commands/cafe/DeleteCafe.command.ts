import { IRequest } from '../../../../infrastructure/mediator/IMediator';

export class DeleteCafeCommand implements IRequest<boolean> {
  constructor(public readonly id: string) {}
}
