import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { DeleteCafeCommand } from './DeleteCafe.command';
import { ICafeRepository } from '../../interfaces/repositories/ICafeRepository';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class DeleteCafeHandler implements IRequestHandler<DeleteCafeCommand, boolean> {
  constructor(
    @inject('ICafeRepository') private cafeRepo: ICafeRepository
  ) {}

  async handle(command: DeleteCafeCommand): Promise<boolean> {
    // Check if café exists
    const exists = await this.cafeRepo.exists(command.id);
    if (!exists) {
      throw new NotFoundException('Café', command.id);
    }

    // Delete café (CASCADE will delete employees and relationships)
    return this.cafeRepo.delete(command.id);
  }
}
