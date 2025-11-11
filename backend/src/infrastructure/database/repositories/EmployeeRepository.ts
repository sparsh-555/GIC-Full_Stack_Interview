import { injectable, inject } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Employee } from '../../../core/domain/entities/Employee.entity';
import { IEmployeeRepository, EmployeeWithCafeInfo } from '../../../core/application/interfaces/repositories/IEmployeeRepository';

@injectable()
export class EmployeeRepository implements IEmployeeRepository {
  private repository: Repository<Employee>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Employee | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAllWithCafeInfo(cafeId?: string): Promise<EmployeeWithCafeInfo[]> {
    let query = this.dataSource
      .createQueryBuilder()
      .select('emp.id', 'id')
      .addSelect('emp.name', 'name')
      .addSelect('emp.email_address', 'emailAddress')
      .addSelect('emp.phone_number', 'phoneNumber')
      .addSelect('emp.gender', 'gender')
      .addSelect('COALESCE(cafe.name, \'\')', 'cafe')
      .addSelect(
        'CASE WHEN ec.start_date IS NOT NULL THEN (CURRENT_DATE - ec.start_date)::int ELSE 0 END',
        'daysWorked'
      )
      .from('employees', 'emp')
      .leftJoin('employee_cafe', 'ec', 'emp.id = ec.employee_id AND ec.end_date IS NULL')
      .leftJoin('cafes', 'cafe', 'ec.cafe_id = cafe.id');

    if (cafeId) {
      query = query.where('cafe.id = :cafeId', { cafeId });
    }

    const results = await query.orderBy('"daysWorked"', 'DESC').getRawMany();

    return results.map((result) => ({
      id: result.id,
      name: result.name,
      emailAddress: result.emailAddress,
      phoneNumber: result.phoneNumber,
      gender: result.gender,
      daysWorked: result.daysWorked || 0,
      cafe: result.cafe || '',
    }));
  }

  async create(employee: Employee): Promise<Employee> {
    const newEmployee = this.repository.create(employee);
    return this.repository.save(newEmployee);
  }

  async update(id: string, employee: Partial<Employee>): Promise<Employee | null> {
    await this.repository.update(id, employee);
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

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { emailAddress: email } });
    return count > 0;
  }
}
