import { injectable, inject } from 'tsyringe';
import { IEmployeeIdGenerator } from '../../core/application/interfaces/services/IEmployeeIdGenerator';
import { IEmployeeRepository } from '../../core/application/interfaces/repositories/IEmployeeRepository';

@injectable()
export class EmployeeIdGenerator implements IEmployeeIdGenerator {
  private readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  constructor(
    @inject('IEmployeeRepository') private employeeRepo: IEmployeeRepository
  ) {}

  async generate(): Promise<string> {
    let id: string;
    let exists = true;

    while (exists) {
      id = 'UI';
      for (let i = 0; i < 7; i++) {
        id += this.CHARS.charAt(Math.floor(Math.random() * this.CHARS.length));
      }
      exists = await this.employeeRepo.exists(id);
    }

    return id!;
  }
}
