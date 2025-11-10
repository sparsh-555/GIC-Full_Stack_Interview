import { IRequest } from '../../../../infrastructure/mediator/IMediator';
import { CafeDto } from '../../dtos/CafeDto';

export class GetCafeByIdQuery implements IRequest<CafeDto> {
  constructor(public readonly id: string) {}
}
