# Café Employee Manager

A full-stack application for managing cafés and their employees, built with modern web technologies following Clean Architecture principles and CQRS pattern.

## Live Application

- https://cafe-manager-web-gic-34c0655bd402.herokuapp.com/

## Features

- Café Management: Create, read, update, and delete cafés
- Employee Management: Manage employee records and assignments
- Logo Upload: Upload and display café logos
- Location-based Filtering: Filter cafés by location
- Café-based Filtering: View employees by café
- Employee Count Tracking: See how many employees work at each café
- Days Worked Calculation: Automatic calculation of employee tenure
- Single Café Constraint: Employees can only be assigned to one café at a time
- Cascading Deletes: Deleting a café removes all its employees
- Real-time Validation: Form validation with instant feedback
- Unsaved Changes Warning: Prevents accidental data loss
- Responsive Design: Works seamlessly on desktop and mobile

## Architecture

### Backend
- Framework: Node.js 22.x + TypeScript + Express.js
- Database: PostgreSQL 16.x with TypeORM
- Architecture: Clean Architecture + CQRS + Mediator Pattern
- Dependency Injection: TSyringe
- Validation: Domain value objects with custom validators
- File Upload: Multer for logo uploads

### Frontend
- Framework: React 18 + TypeScript + Vite
- UI Components: Ant Design + Custom Tailwind CSS
- Data Tables: AG Grid Community
- State Management: TanStack Query (React Query)
- Forms: React Hook Form + Zod validation
- Routing: React Router v6

## Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher
- PostgreSQL 16.x or higher (for local development)
- Docker & Docker Compose (for containerized deployment)

## Installation & Setup

### Option 1: Docker (Recommended)

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd GIC-Full_Stack_Interview
   ```

2. Start all services
   ```bash
   docker-compose up -d
   ```

3. Run database migrations and seed data
   ```bash
   docker exec -it cafe-manager-backend npm run seed
   ```

4. Access the application
   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000/api
   - Health Check: http://localhost:3000/api/health

### Option 2: Local Development

#### Backend Setup

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment
   ```bash
   cp .env.example .env
   ```
   Update .env with your PostgreSQL credentials

4. Create PostgreSQL database
   ```bash
   createdb cafe_manager
   ```

5. Run database migrations and seed
   ```bash
   npm run seed
   ```

6. Start development server
   ```bash
   npm run dev
   ```
   Backend will run on http://localhost:3000

#### Frontend Setup

1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment
   ```bash
   cp .env.example .env
   ```
   Update VITE_API_URL to point to your backend

4. Start development server
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Database Schema Constraints

- Employee can only have one active café assignment (partial unique index: employee_id WHERE end_date IS NULL)
- Cascading deletes for café removal (deleting café removes all its employees)
- Unique email addresses for employees (prevents duplicate accounts)
- Unique phone numbers for employees (one person = one employee record)


## Validation Rules

### Café
- Name: 6-10 characters (required)
- Description: Max 256 characters (required)
- Location: Required
- Logo: Optional, image files only (JPEG, PNG, GIF), max 2MB

### Employee
- Name: 6-10 characters (required)
- Email: Valid email format (required, unique)
- Phone: Singapore format - starts with 8 or 9, exactly 8 digits (required, unique)
- Gender: Male or Female (required)
- Café Assignment: Optional

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove all data (including database)
docker-compose down -v
```

## Project Structure

```
GIC-Full_Stack_Interview/
├── backend/
│   ├── src/
│   │   ├── core/                    # Domain & Application layers
│   │   │   ├── domain/              # Entities, Value Objects, Exceptions
│   │   │   └── application/         # CQRS Commands, Queries, DTOs
│   │   ├── infrastructure/          # Database, Repositories, Services
│   │   ├── presentation/            # Controllers, Routes, Middleware
│   │   ├── di/                      # Dependency Injection
│   │   └── app.ts                   # Application entry point
│   ├── uploads/                     # User-uploaded files (logos)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API clients & hooks
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── utils/                   # Utility functions
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── start-nginx.sh
├── docker-compose.yml
└── README.md
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in .env file
- Verify database exists: psql -l

### Port Already in Use
- Change ports in .env file
- Kill process using the port: lsof -ti:3000 | xargs kill

### Docker Issues
- Clean up: docker system prune -a
- Check logs: docker-compose logs \<service-name\>
- Restart services: docker-compose restart

### Module Not Found Errors
- Delete node_modules and reinstall: rm -rf node_modules && npm install
- Clear npm cache: npm cache clean --force

## License

MIT

## Author

Sparsh Jain
