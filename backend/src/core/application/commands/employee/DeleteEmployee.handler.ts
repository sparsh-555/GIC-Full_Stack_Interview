import { injectable, inject } from 'tsyringe';
import { IRequestHandler } from '../../../../infrastructure/mediator/IMediator';
import { DeleteEmployeeCommand } from './DeleteEmployee.command';
import { IEmployeeRepository } from '../../interfaces/repositories/IEmployeeRepository';
import { NotFoundException } from '../../../domain/exceptions/NotFoundException';

@injectable()
export class DeleteEmployeeHandler implements IRequestHandler<DeleteEmployeeCommand, boolean> {
  constructor(
    @inject('IEmployeeRepository') private employeeRepo: IEmployeeRepository
  ) {}

  async handle(command: DeleteEmployeeCommand): Promise<boolean> {
    // Check if employee exists
    const exists = await this.employeeRepo.exists(command.id);
    if (!exists) {
      throw new NotFoundException('Employee', command.id);
    }

    // Delete employee (CASCADE will delete cafe assignments)
    return this.employeeRepo.delete(command.id);
  }
}
