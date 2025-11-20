# FoodTrack Backend API

Backend REST API for FoodTrack - Sistema de controle de compras de comida.

## Features

- RESTful API with Express.js and TypeScript
- SQL Server database with automated migrations
- Multi-tenancy support with account-based isolation
- Comprehensive error handling and validation
- CORS configuration for frontend integration

## Prerequisites

- Node.js 18+ and npm
- SQL Server instance
- Git

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials and configuration

4. Run database migrations:
   ```bash
   npm run migrate
   ```

## Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Documentation

### Health Check
- **GET** `/health` - Server health status

### API Endpoints
All endpoints are prefixed with `/api/v1`

## Project Structure

```
backend/
├── migrations/           # SQL migration files
├── src/
│   ├── api/            # API controllers
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── migrations/     # Migration runner
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.ts       # Application entry point
└── package.json
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC