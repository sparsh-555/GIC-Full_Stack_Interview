import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { GetCafeByIdQuery } from './GetCafeById.query';
import { CafeDto } from '../../dtos/CafeDto';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class GetCafeByIdHandler implements IRequestHandler<GetCafeByIdQuery, CafeDto> {
  constructor(
    @inject('ICafeRepository') private cafeRepo: ICafeRepository
  ) {}

  async handle(query: GetCafeByIdQuery): Promise<CafeDto> {
    const cafe = await this.cafeRepo.findById(query.id);
    if (!cafe) {
      throw new NotFoundException('Café', query.id);
    }

    return {
      id: cafe.id,
      name: cafe.name,
      description: cafe.description,
      logo: cafe.logo,
      location: cafe.location,
    };
  }
}
