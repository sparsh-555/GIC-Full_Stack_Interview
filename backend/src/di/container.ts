import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../infrastructure/database/config/typeorm.config';

// Infrastructure
import { Mediator } from '../infrastructure/mediator/Mediator';
import { IMediator } from '../infrastructure/mediator/IMediator';
import { CafeRepository } from '../infrastructure/database/repositories/CafeRepository';
import { EmployeeRepository } from '../infrastructure/database/repositories/EmployeeRepository';
import { EmployeeCafeRepository } from '../infrastructure/database/repositories/EmployeeCafeRepository';
import { EmployeeIdGenerator } from '../infrastructure/services/EmployeeIdGenerator.service';

// Repositories
import { ICafeRepository } from '../core/application/interfaces/repositories/ICafeRepository';
import { IEmployeeRepository } from '../core/application/interfaces/repositories/IEmployeeRepository';
import { IEmployeeCafeRepository } from '../core/application/interfaces/repositories/IEmployeeCafeRepository';
import { IEmployeeIdGenerator } from '../core/application/interfaces/services/IEmployeeIdGenerator';

// Command Handlers - Cafe
import { CreateCafeHandler } from '../core/application/commands/cafe/CreateCafe.handler';
import { UpdateCafeHandler } from '../core/application/commands/cafe/UpdateCafe.handler';
import { DeleteCafeHandler } from '../core/application/commands/cafe/DeleteCafe.handler';

// Command Handlers - Employee
import { CreateEmployeeHandler } from '../core/application/commands/employee/CreateEmployee.handler';
import { UpdateEmployeeHandler } from '../core/application/commands/employee/UpdateEmployee.handler';
import { DeleteEmployeeHandler } from '../core/application/commands/employee/DeleteEmployee.handler';

// Query Handlers - Cafe
import { GetCafesHandler } from '../core/application/queries/cafe/GetCafes.handler';
import { GetCafeByIdHandler } from '../core/application/queries/cafe/GetCafeById.handler';

// Query Handlers - Employee
import { GetEmployeesHandler } from '../core/application/queries/employee/GetEmployees.handler';
import { GetEmployeeByIdHandler } from '../core/application/queries/employee/GetEmployeeById.handler';

// Commands
import { CreateCafeCommand } from '../core/application/commands/cafe/CreateCafe.command';
import { UpdateCafeCommand } from '../core/application/commands/cafe/UpdateCafe.command';
import { DeleteCafeCommand } from '../core/application/commands/cafe/DeleteCafe.command';
import { CreateEmployeeCommand } from '../core/application/commands/employee/CreateEmployee.command';
import { UpdateEmployeeCommand } from '../core/application/commands/employee/UpdateEmployee.command';
import { DeleteEmployeeCommand } from '../core/application/commands/employee/DeleteEmployee.command';

// Queries
import { GetCafesQuery } from '../core/application/queries/cafe/GetCafes.query';
import { GetCafeByIdQuery } from '../core/application/queries/cafe/GetCafeById.query';
import { GetEmployeesQuery } from '../core/application/queries/employee/GetEmployees.query';
import { GetEmployeeByIdQuery } from '../core/application/queries/employee/GetEmployeeById.query';

export async function setupContainer(): Promise<void> {
  // Register DataSource
  container.register<DataSource>('DataSource', {
    useValue: AppDataSource,
  });

  // Register Repositories
  container.register<ICafeRepository>('ICafeRepository', {
    useClass: CafeRepository,
  });

  container.register<IEmployeeRepository>('IEmployeeRepository', {
    useClass: EmployeeRepository,
  });

  container.register<IEmployeeCafeRepository>('IEmployeeCafeRepository', {
    useClass: EmployeeCafeRepository,
  });

  // Register Services
  container.register<IEmployeeIdGenerator>('IEmployeeIdGenerator', {
    useClass: EmployeeIdGenerator,
  });

  // Register Mediator
  const mediator = new Mediator();
  container.register<IMediator>('IMediator', {
    useValue: mediator,
  });

  // Register Command Handlers
  const createCafeHandler = container.resolve(CreateCafeHandler);
  const updateCafeHandler = container.resolve(UpdateCafeHandler);
  const deleteCafeHandler = container.resolve(DeleteCafeHandler);
  const createEmployeeHandler = container.resolve(CreateEmployeeHandler);
  const updateEmployeeHandler = container.resolve(UpdateEmployeeHandler);
  const deleteEmployeeHandler = container.resolve(DeleteEmployeeHandler);

  mediator.registerHandler(CreateCafeCommand, createCafeHandler);
  mediator.registerHandler(UpdateCafeCommand, updateCafeHandler);
  mediator.registerHandler(DeleteCafeCommand, deleteCafeHandler);
  mediator.registerHandler(CreateEmployeeCommand, createEmployeeHandler);
  mediator.registerHandler(UpdateEmployeeCommand, updateEmployeeHandler);
  mediator.registerHandler(DeleteEmployeeCommand, deleteEmployeeHandler);

  // Register Query Handlers
  const getCafesHandler = container.resolve(GetCafesHandler);
  const getCafeByIdHandler = container.resolve(GetCafeByIdHandler);
  const getEmployeesHandler = container.resolve(GetEmployeesHandler);
  const getEmployeeByIdHandler = container.resolve(GetEmployeeByIdHandler);

  mediator.registerHandler(GetCafesQuery, getCafesHandler);
  mediator.registerHandler(GetCafeByIdQuery, getCafeByIdHandler);
  mediator.registerHandler(GetEmployeesQuery, getEmployeesHandler);
  mediator.registerHandler(GetEmployeeByIdQuery, getEmployeeByIdHandler);
}

export { container };
