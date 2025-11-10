import { IRequest } from '../../../../infrastructure/mediator/IMediator';
import { CafeDto } from '../../dtos/CafeDto';

export class GetCafesQuery implements IRequest<CafeDto[]> {
  constructor(public readonly location?: string) {}
}
