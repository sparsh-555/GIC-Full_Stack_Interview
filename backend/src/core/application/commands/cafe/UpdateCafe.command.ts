import { IRequest } from '../../../../infrastructure/mediator/IMediator';
import { CafeDto } from '../../dtos/CafeDto';

export class UpdateCafeCommand implements IRequest<CafeDto> {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly location: string,
    public readonly logo: string | null = null
  ) {}
}
