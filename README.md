# Banner Printing Platform

A complete, production-ready full-stack application for an online banner printing business built with modern technologies.

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Query (TanStack Query)** for server state management
- **Zustand** for client state management
- **React Router v6** for routing
- **React Hook Form** for form handling

### Backend
- **FastAPI** with async/await support
- **SQLAlchemy 2.x** with async support
- **PostgreSQL** database
- **Alembic** for database migrations
- **JWT** authentication with refresh tokens
- **MinIO/S3** for file storage
- **bcrypt** for password hashing

### Infrastructure
- **Docker & Docker Compose** for containerization
- **PostgreSQL** database container
- **MinIO** S3-compatible storage container

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Banner_site

# Copy environment files
cp .env.example .env
cd frontend && cp .env.example .env && cd ..

# Edit .env files with your specific values:
# - Set a strong SECRET_KEY for production
# - Configure email settings if needed (optional)
# - Adjust CORS_ORIGINS for your domain
```

### 2. Start with Docker Compose
```bash
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **MinIO Console**: http://localhost:9001 (admin/admin)

### 3. Database Setup

#### For Docker (PostgreSQL):
```bash
# Enter backend container
docker-compose exec backend bash

# Create initial migration (first time only)
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

#### For Local Development (SQLite - Default):
```bash
# Database file will be created automatically on first run
# No additional setup required
```

## 🛠️ Local Development

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (if not done already)
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (SQLite will auto-create)
alembic upgrade head

# Create uploads directory (for local file storage)
mkdir -p uploads  # On Windows: mkdir uploads

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
```

#### Frontend Tests (when implemented)
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
Banner_site/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client and calls
│   │   ├── state/          # State management
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── repositories/   # Data access layer
│   │   ├── services/       # Business logic layer
│   │   ├── controllers/    # API controllers
│   │   ├── schemas/        # Pydantic schemas
│   │   └── utils/          # Utility functions
│   ├── tests/              # Test files
│   ├── alembic/            # Database migrations
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml        # Multi-service orchestration
├── .env.example             # Environment variables template
└── README.md
```

## 🔐 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt
- **File Upload Validation** (MIME type, size, dimensions)
- **CORS Configuration** for cross-origin requests
- **SQL Injection Protection** via SQLAlchemy ORM
- **Input Validation** using Pydantic schemas

## 📊 Database Schema

### Core Models
- **User**: User accounts with admin privileges
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual banner items in orders
- **BannerConfig**: Banner specifications and pricing
- **FileRecord**: Uploaded file metadata and S3 references

### Relationships
- User → Orders (One-to-Many)
- Order → OrderItems (One-to-Many)
- OrderItem → BannerConfig (Many-to-One)
- OrderItem → FileRecord (Many-to-One)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Orders
- `GET /api/orders/me` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `POST /api/orders/calculate-price` - Calculate banner price
- `PATCH /api/orders/{id}/status` - Update order status (admin)
- `GET /api/orders/{id}/items/{item_id}/file` - Download file (admin)

## 🎨 Frontend Features

### User Features
- **Authentication**: Login/Register with form validation
- **Banner Configuration**: Interactive form with real-time pricing
- **File Upload**: Drag-and-drop with preview and validation
- **Shopping Cart**: Local storage with persistent state
- **Order History**: View past orders with status tracking
- **Responsive Design**: Mobile-first approach

### Admin Features
- **Order Management**: View and update all orders
- **File Downloads**: Access customer artwork files
- **Status Updates**: Change order status with real-time updates
- **Dashboard Statistics**: Order counts by status

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database - SQLite for local testing, PostgreSQL for production
DATABASE_URL=sqlite+aiosqlite:///./banner_test.db
# DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/banner_db

# JWT Configuration
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7


# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=[".jpg", ".jpeg", ".png", ".pdf"]

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Email Configuration (Optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
BUSINESS_EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Frontend (.env)
```env
VITE_API_BASE=http://localhost:8000/api
```

## 🚀 Production Deployment

### 1. Environment Setup
- Set strong `SECRET_KEY` for JWT tokens
- Configure production database URL
- Set up production S3 bucket or MinIO instance
- Configure CORS origins for production domains

### 2. Database Migration
```bash
alembic upgrade head
```

### 3. Build and Deploy
```bash
# Build frontend
cd frontend && npm run build

# Build backend container
cd backend && docker build -t banner-backend .

# Deploy using your preferred method (AWS, GCP, Azure, etc.)
```

## 🧪 Testing

### Backend Testing
- **Unit Tests**: Service layer business logic
- **Integration Tests**: API endpoints with test database
- **Authentication Tests**: JWT token handling
- **File Upload Tests**: Validation and S3 integration

### Test Coverage
```bash
cd backend
pytest --cov=app tests/
```

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Async SQLAlchemy with connection pooling
- **File Storage**: S3-compatible storage for scalability
- **Caching**: React Query for client-side caching
- **Lazy Loading**: Code splitting with React Router

## 🔍 Monitoring & Logging

- **Health Check Endpoints**: `/health` for service monitoring
- **Structured Logging**: JSON logs for production
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database credentials

2. **File Upload Issues**
   - Check MinIO is running and accessible
   - Verify S3 credentials in .env
   - Ensure bucket exists and has proper permissions

3. **CORS Errors**
   - Update CORS_ORIGINS in backend .env
   - Ensure frontend URL is included in allowed origins

4. **Authentication Issues**
   - Check SECRET_KEY is set
   - Verify JWT token expiration settings
   - Clear browser localStorage if needed

### Getting Help

- Check the API documentation at http://localhost:8000/docs
- Review logs in Docker containers: `docker-compose logs [service-name]`
- Ensure all services are healthy: `docker-compose ps`

## 🎉 Features Implemented

✅ User authentication with JWT tokens  
✅ Banner configuration with real-time pricing  
✅ File upload with validation and S3 storage  
✅ Shopping cart with localStorage persistence  
✅ Order management and tracking  
✅ Admin dashboard with order management  
✅ Responsive design with TailwindCSS  
✅ Production-ready Docker setup  
✅ Database migrations with Alembic  
✅ Comprehensive test suite  
✅ Type-safe API with TypeScript  
✅ Security best practices implemented