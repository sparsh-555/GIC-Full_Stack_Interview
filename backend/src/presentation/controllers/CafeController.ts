import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { IMediator } from '../../infrastructure/mediator/IMediator';
import { GetCafesQuery } from '../../core/application/queries/cafe/GetCafes.query';
import { GetCafeByIdQuery } from '../../core/application/queries/cafe/GetCafeById.query';
import { CreateCafeCommand } from '../../core/application/commands/cafe/CreateCafe.command';
import { UpdateCafeCommand } from '../../core/application/commands/cafe/UpdateCafe.command';
import { DeleteCafeCommand } from '../../core/application/commands/cafe/DeleteCafe.command';

@injectable()
export class CafeController {
  constructor(@inject('IMediator') private mediator: IMediator) {}

  async getCafes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { location } = req.query;
      const query = new GetCafesQuery(location as string | undefined);
      const cafes = await this.mediator.send(query);
      res.json(cafes);
    } catch (error) {
      next(error);
    }
  }

  async getCafeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const query = new GetCafeByIdQuery(id);
      const cafe = await this.mediator.send(query);
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  async createCafe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, location } = req.body;
      const logoPath = req.file ? `/uploads/${req.file.filename}` : null;
      const command = new CreateCafeCommand(name, description, location, logoPath);
      const cafe = await this.mediator.send(command);
      res.status(201).json(cafe);
    } catch (error) {
      next(error);
    }
  }

  async updateCafe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, description, location } = req.body;
      const logoPath = req.file ? `/uploads/${req.file.filename}` : req.body.logo;
      const command = new UpdateCafeCommand(id, name, description, location, logoPath);
      const cafe = await this.mediator.send(command);
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  async deleteCafe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const command = new DeleteCafeCommand(id);
      await this.mediator.send(command);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
