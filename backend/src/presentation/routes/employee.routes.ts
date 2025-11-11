import { Router } from 'express';
import { container } from 'tsyringe';
import { EmployeeController } from '../controllers/EmployeeController';

const router = Router();
const employeeController = container.resolve(EmployeeController);

router.get('/', (req, res, next) => employeeController.getEmployees(req, res, next));
router.get('/:id', (req, res, next) => employeeController.getEmployeeById(req, res, next));
router.post('/', (req, res, next) => employeeController.createEmployee(req, res, next));
router.put('/', (req, res, next) => employeeController.updateEmployee(req, res, next));
router.delete('/:id', (req, res, next) => employeeController.deleteEmployee(req, res, next));

export default router;
