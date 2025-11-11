import 'reflect-metadata';
import { AppDataSource } from '../config/typeorm.config';
import { Employee } from '../../../core/domain/entities/Employee.entity';
import { Cafe } from '../../../core/domain/entities/Cafe.entity';
import { EmployeeCafe } from '../../../core/domain/entities/EmployeeCafe.entity';

async function seed() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established');

    const employeeRepo = AppDataSource.getRepository(Employee);
    const cafeRepo = AppDataSource.getRepository(Cafe);
    const employeeCafeRepo = AppDataSource.getRepository(EmployeeCafe);

    // Clear existing data (child tables first due to foreign key constraints)
    console.log('Clearing existing data...');
    await AppDataSource.query('TRUNCATE TABLE employee_cafe CASCADE');
    await AppDataSource.query('TRUNCATE TABLE employees CASCADE');
    await AppDataSource.query('TRUNCATE TABLE cafes CASCADE');

    // Create cafes
    console.log('Creating cafes...');
    const cafe1 = cafeRepo.create({
      name: 'Coffee Haven',
      description: 'A cozy café with the best artisan coffee in town',
      location: 'Orchard Road',
      logo: null,
    });

    const cafe2 = cafeRepo.create({
      name: 'Tea Garden',
      description: 'Traditional tea house with modern ambiance',
      location: 'Marina Bay',
      logo: null,
    });

    const cafe3 = cafeRepo.create({
      name: 'Brew & Bites',
      description: 'Coffee and delicious pastries all day long',
      location: 'Raffles Place',
      logo: null,
    });

    const cafe4 = cafeRepo.create({
      name: 'Urban Café',
      description: 'Hip and trendy café for the modern crowd',
      location: 'Clarke Quay',
      logo: null,
    });

    await cafeRepo.save([cafe1, cafe2, cafe3, cafe4]);
    console.log('Cafes created');

    // Create employees
    console.log('Creating employees...');
    const employee1 = employeeRepo.create({
      id: 'UIABC1234',
      name: 'JohnDoe',
      emailAddress: 'john.doe@example.com',
      phoneNumber: '91234567',
      gender: 'Male',
    });

    const employee2 = employeeRepo.create({
      id: 'UIXYZ5678',
      name: 'JaneSmith',
      emailAddress: 'jane.smith@example.com',
      phoneNumber: '82345678',
      gender: 'Female',
    });

    const employee3 = employeeRepo.create({
      id: 'UILMN9012',
      name: 'AliceTan',
      emailAddress: 'alice.tan@example.com',
      phoneNumber: '93456789',
      gender: 'Female',
    });

    const employee4 = employeeRepo.create({
      id: 'UIPQR3456',
      name: 'BobLee',
      emailAddress: 'bob.lee@example.com',
      phoneNumber: '84567890',
      gender: 'Male',
    });

    const employee5 = employeeRepo.create({
      id: 'UISTU7890',
      name: 'CarolWong',
      emailAddress: 'carol.wong@example.com',
      phoneNumber: '95678901',
      gender: 'Female',
    });

    const employee6 = employeeRepo.create({
      id: 'UIVWX1122',
      name: 'DavidKoh',
      emailAddress: 'david.koh@example.com',
      phoneNumber: '86789012',
      gender: 'Male',
    });

    const employee7 = employeeRepo.create({
      id: 'UIYZA3344',
      name: 'EvaLim',
      emailAddress: 'eva.lim@example.com',
      phoneNumber: '97890123',
      gender: 'Female',
    });

    const employee8 = employeeRepo.create({
      id: 'UIBCD5566',
      name: 'FrankNg',
      emailAddress: 'frank.ng@example.com',
      phoneNumber: '88901234',
      gender: 'Male',
    });

    await employeeRepo.save([
      employee1,
      employee2,
      employee3,
      employee4,
      employee5,
      employee6,
      employee7,
      employee8,
    ]);
    console.log('Employees created');

    // Create employee-cafe relationships
    console.log('Creating employee-cafe relationships...');

    // Calculate start dates (various days in the past)
    const today = new Date();
    const daysAgo = (days: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      return date;
    };

    const relationship1 = employeeCafeRepo.create({
      employeeId: employee1.id,
      cafeId: cafe1.id,
      startDate: daysAgo(365), // 1 year ago
      endDate: null,
    });

    const relationship2 = employeeCafeRepo.create({
      employeeId: employee2.id,
      cafeId: cafe1.id,
      startDate: daysAgo(180), // 6 months ago
      endDate: null,
    });

    const relationship3 = employeeCafeRepo.create({
      employeeId: employee3.id,
      cafeId: cafe1.id,
      startDate: daysAgo(90), // 3 months ago
      endDate: null,
    });

    const relationship4 = employeeCafeRepo.create({
      employeeId: employee4.id,
      cafeId: cafe2.id,
      startDate: daysAgo(270), // 9 months ago
      endDate: null,
    });

    const relationship5 = employeeCafeRepo.create({
      employeeId: employee5.id,
      cafeId: cafe2.id,
      startDate: daysAgo(150), // 5 months ago
      endDate: null,
    });

    const relationship6 = employeeCafeRepo.create({
      employeeId: employee6.id,
      cafeId: cafe3.id,
      startDate: daysAgo(450), // 1.2 years ago
      endDate: null,
    });

    const relationship7 = employeeCafeRepo.create({
      employeeId: employee7.id,
      cafeId: cafe3.id,
      startDate: daysAgo(60), // 2 months ago
      endDate: null,
    });

    await employeeCafeRepo.save([
      relationship1,
      relationship2,
      relationship3,
      relationship4,
      relationship5,
      relationship6,
      relationship7,
    ]);
    console.log('Employee-cafe relationships created');

    console.log('\nSeed data summary:');
    console.log(`- Cafes: ${await cafeRepo.count()}`);
    console.log(`- Employees: ${await employeeRepo.count()}`);
    console.log(`- Active relationships: ${await employeeCafeRepo.count()}`);
    console.log('\nSeed completed successfully!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
