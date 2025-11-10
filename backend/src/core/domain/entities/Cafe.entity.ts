import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EmployeeCafe } from './EmployeeCafe.entity';

@Entity('cafes')
export class Cafe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 256 })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string | null;

  @Column()
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => EmployeeCafe, (employeeCafe) => employeeCafe.cafe)
  employeeCafes?: EmployeeCafe[];

  constructor(name: string, description: string, location: string, logo: string | null = null) {
    this.name = name;
    this.description = description;
    this.location = location;
    this.logo = logo;
  }
}
