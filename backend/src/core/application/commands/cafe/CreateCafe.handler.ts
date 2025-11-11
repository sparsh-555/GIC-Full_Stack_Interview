import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { CreateCafeCommand } from './CreateCafe.command';
import { CafeDto } from '../../dtos/CafeDto';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';
import { Cafe } from '../../../domain/entities/Cafe.entity';
import { ValidationException } from '../../../domain/exceptions/ValidationException';

@injectable()
export class CreateCafeHandler implements IRequestHandler<CreateCafeCommand, CafeDto> {
  constructor(
    @inject('ICafeRepository') private cafeRepo: ICafeRepository
  ) {}

  async handle(command: CreateCafeCommand): Promise<CafeDto> {
    // Validate
    if (command.name.length < 6 || command.name.length > 10) {
      throw new ValidationException('Café name must be between 6 and 10 characters');
    }

    if (command.description.length > 256) {
      throw new ValidationException('Description must not exceed 256 characters');
    }

    // Create café
    const cafe = new Cafe(command.name, command.description, command.location, command.logo);
    const savedCafe = await this.cafeRepo.create(cafe);

    return {
      id: savedCafe.id,
      name: savedCafe.name,
      description: savedCafe.description,
      logo: savedCafe.logo,
      location: savedCafe.location,
      employees: 0,
    };
  }
}
