import 'reflect-metadata';
import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import { AppDataSource } from './infrastructure/database/config/typeorm.config';
import { setupContainer } from './di/container';
import { corsMiddleware } from './presentation/middleware/cors';
import { errorHandler } from './presentation/middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads with CORS headers
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('/app/uploads'));

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connection established');

    console.log('Setting up dependency injection...');
    await setupContainer();
    console.log('Dependency injection configured');

    // Import routes AFTER DI container is set up
    const routes = (await import('./presentation/routes')).default;
    app.use('/api', routes);

    // Error handling
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
