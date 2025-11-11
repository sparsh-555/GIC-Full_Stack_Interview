import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { UpdateCafeCommand } from './UpdateCafe.command';
import { CafeDto } from '../../dtos/CafeDto';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class UpdateCafeHandler implements IRequestHandler<UpdateCafeCommand, CafeDto> {
  constructor(
    @inject('ICafeRepository') private cafeRepo: ICafeRepository
  ) {}

  async handle(command: UpdateCafeCommand): Promise<CafeDto> {
    // Check if café exists
    const exists = await this.cafeRepo.exists(command.id);
    if (!exists) {
      throw new NotFoundException('Café', command.id);
    }

    // Validate
    if (command.name.length < 6 || command.name.length > 10) {
      throw new ValidationException('Café name must be between 6 and 10 characters');
    }

    if (command.description.length > 256) {
      throw new ValidationException('Description must not exceed 256 characters');
    }

    // Update café
    const updatedCafe = await this.cafeRepo.update(command.id, {
      name: command.name,
      description: command.description,
      location: command.location,
      logo: command.logo,
    });

    if (!updatedCafe) {
      throw new NotFoundException('Café', command.id);
    }

    return {
      id: updatedCafe.id,
      name: updatedCafe.name,
      description: updatedCafe.description,
      logo: updatedCafe.logo,
      location: updatedCafe.location,
    };
  }
}
