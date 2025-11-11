import { injectable, inject } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Cafe } from '../../../core/domain/entities/Cafe.entity';
import { ICafeRepository, CafeWithEmployeeCount } from '../../../core/application/interfaces/repositories/ICafeRepository';

@injectable()
export class CafeRepository implements ICafeRepository {
  private repository: Repository<Cafe>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Cafe);
  }

  async findAll(): Promise<Cafe[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Cafe | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAllWithEmployeeCount(location?: string): Promise<CafeWithEmployeeCount[]> {
    let query = this.dataSource
      .createQueryBuilder()
      .select('cafe.id', 'id')
      .addSelect('cafe.name', 'name')
      .addSelect('cafe.description', 'description')
      .addSelect('cafe.logo', 'logo')
      .addSelect('cafe.location', 'location')
      .addSelect('COUNT(DISTINCT ec.employee_id)', 'employees')
      .from('cafes', 'cafe')
      .leftJoin('employee_cafe', 'ec', 'cafe.id = ec.cafe_id AND ec.end_date IS NULL')
      .groupBy('cafe.id')
      .addGroupBy('cafe.name')
      .addGroupBy('cafe.description')
      .addGroupBy('cafe.logo')
      .addGroupBy('cafe.location');

    if (location) {
      query = query.where('LOWER(cafe.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }

    const results = await query.orderBy('employees', 'DESC').getRawMany();

    return results.map((result) => ({
      id: result.id,
      name: result.name,
      description: result.description,
      logo: result.logo,
      location: result.location,
      employees: parseInt(result.employees, 10),
    }));
  }

  async create(cafe: Cafe): Promise<Cafe> {
    const newCafe = this.repository.create(cafe);
    return this.repository.save(newCafe);
  }

  async update(id: string, cafe: Partial<Cafe>): Promise<Cafe | null> {
    await this.repository.update(id, cafe);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}
