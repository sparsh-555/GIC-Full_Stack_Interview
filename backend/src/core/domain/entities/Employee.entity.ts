import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EmployeeCafe } from './EmployeeCafe.entity';

@Entity('employees')
export class Employee {
  @PrimaryColumn({ length: 10 })
  id: string;

  @Column({ length: 10 })
  name: string;

  @Column({ name: 'email_address', unique: true })
  emailAddress: string;

  @Column({ name: 'phone_number', length: 8, unique: true })
  phoneNumber: string;

  @Column({ length: 10 })
  gender: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => EmployeeCafe, (employeeCafe) => employeeCafe.employee)
  employeeCafes?: EmployeeCafe[];

  constructor(
    id: string,
    name: string,
    emailAddress: string,
    phoneNumber: string,
    gender: string
  ) {
    this.id = id;
    this.name = name;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.gender = gender;
  }
}
