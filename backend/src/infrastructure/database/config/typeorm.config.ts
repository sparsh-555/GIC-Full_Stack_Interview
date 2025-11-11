import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Employee } from '../../../core/domain/entities/Employee.entity';
import { Cafe } from '../../../core/domain/entities/Cafe.entity';
import { EmployeeCafe } from '../../../core/domain/entities/EmployeeCafe.entity';

dotenv.config();

// Use DATABASE_URL if available (Heroku), otherwise use individual env vars
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'cafe_manager',
  };
};

export const AppDataSource = new DataSource({
  ...getDatabaseConfig(),
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [Employee, Cafe, EmployeeCafe],
  migrations: ['src/infrastructure/database/migrations/**/*.ts'],
  subscribers: [],
});
