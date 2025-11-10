import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { GetCafesQuery } from './GetCafes.query';
import { CafeDto } from '../../dtos/CafeDto';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';

@injectable()
export class GetCafesHandler implements IRequestHandler<GetCafesQuery, CafeDto[]> {
  constructor(
    @inject('ICafeRepository') private cafeRepo: ICafeRepository
  ) {}

  async handle(query: GetCafesQuery): Promise<CafeDto[]> {
    const cafes = await this.cafeRepo.findAllWithEmployeeCount(query.location);
    return cafes;
  }
}
