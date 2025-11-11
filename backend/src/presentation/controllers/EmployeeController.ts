import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IMediator } from '../../infrastructure/mediator/IMediator';
import { GetEmployeesQuery } from '../../core/application/queries/employee/GetEmployees.query';
import { GetEmployeeByIdQuery } from '../../core/application/queries/employee/GetEmployeeById.query';
import { CreateEmployeeCommand } from '../../core/application/commands/employee/CreateEmployee.command';
import { UpdateEmployeeCommand } from '../../core/application/commands/employee/UpdateEmployee.command';
import { DeleteEmployeeCommand } from '../../core/application/commands/employee/DeleteEmployee.command';

@injectable()
export class EmployeeController {
  constructor(@inject('IMediator') private mediator: IMediator) {}

  async getEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cafe } = req.query;
      const query = new GetEmployeesQuery(cafe as string | undefined);
      const employees = await this.mediator.send(query);
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetEmployeeByIdQuery(id);
      const employee = await this.mediator.send(query);
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, emailAddress, phoneNumber, gender, cafeId } = req.body;
      const command = new CreateEmployeeCommand(
        name,
        emailAddress,
        phoneNumber,
        gender,
        cafeId
      );
      const employee = await this.mediator.send(command);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, emailAddress, phoneNumber, gender, cafeId } = req.body;
      const command = new UpdateEmployeeCommand(
        id,
        name,
        emailAddress,
        phoneNumber,
        gender,
        cafeId
      );
      const employee = await this.mediator.send(command);
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteEmployeeCommand(id);
      await this.mediator.send(command);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
