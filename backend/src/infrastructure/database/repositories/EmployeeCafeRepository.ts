import { injectable, inject } from 'tsyringe';
import { DataSource, Repository, IsNull } from 'typeorm';
import { EmployeeCafe } from '../../../core/domain/entities/EmployeeCafe.entity';
import { IEmployeeCafeRepository } from '../../../core/application/interfaces/repositories/IEmployeeCafeRepository';

@injectable()
export class EmployeeCafeRepository implements IEmployeeCafeRepository {
  private repository: Repository<EmployeeCafe>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(EmployeeCafe);
  }

  async findActiveByCafeId(cafeId: string): Promise<EmployeeCafe[]> {
    return this.repository.find({
      where: {
        cafeId,
        endDate: IsNull(),
      },
    });
  }

  async findActiveByEmployeeId(employeeId: string): Promise<EmployeeCafe | null> {
    return this.repository.findOne({
      where: {
        employeeId,
        endDate: IsNull(),
      },
    });
  }

  async create(employeeCafe: EmployeeCafe): Promise<EmployeeCafe> {
    const newRelationship = this.repository.create(employeeCafe);
    return this.repository.save(newRelationship);
  }

  async endActiveRelationship(employeeId: string): Promise<void> {
    await this.repository.update(
      {
        employeeId,
        endDate: IsNull(),
      },
      {
        endDate: new Date(),
      }
    );
  }

  async deleteByCafeId(cafeId: string): Promise<void> {
    await this.repository.delete({ cafeId });
  }

  async hasActiveRelationship(employeeId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        employeeId,
        endDate: IsNull(),
      },
    });
    return count > 0;
  }
}
