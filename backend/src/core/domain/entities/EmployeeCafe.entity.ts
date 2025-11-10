import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Employee } from './Employee.entity';
import { Cafe } from './Cafe.entity';

@Entity('employee_cafe')
@Index('unique_active_employee_cafe', ['employeeId'], {
  unique: true,
  where: 'end_date IS NULL'
})
export class EmployeeCafe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id', length: 10 })
  employeeId: string;

  @Column({ name: 'cafe_id', type: 'uuid' })
  cafeId: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.employeeCafes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @ManyToOne(() => Cafe, (cafe) => cafe.employeeCafes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cafe_id' })
  cafe?: Cafe;

  constructor(employeeId: string, cafeId: string, startDate: Date = new Date(), endDate: Date | null = null) {
    this.employeeId = employeeId;
    this.cafeId = cafeId;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
