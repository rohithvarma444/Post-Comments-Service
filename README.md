# Post-Comments Microservice System

## Assignment Submission

This project demonstrates a **microservice-based post and comments system** built as a technical assignment. The solution showcases modern software architecture principles, clean code practices, and production-ready development standards.

## 🏗️ How This Was Built

### Development Approach
- **Microservice Architecture**: Designed with 4 independent services for better scalability and maintainability
- **Clean Code Principles**: Consistent naming conventions, modular design, and comprehensive error handling
- **Modern Tech Stack**: React 18, Node.js, Express.js, PostgreSQL, Prisma ORM, Docker
- **API-First Design**: RESTful APIs with standardized response formats
- **Security-First**: JWT authentication, input validation, HTML sanitization

### Key Design Decisions
1. **Microservices over Monolith**: Better fault isolation and independent scaling
2. **API Gateway Pattern**: Single entry point for all client requests
3. **Database per Service**: Each service has its own PostgreSQL database
4. **JWT Authentication**: Stateless, scalable authentication across services
5. **Docker Containerization**: Consistent deployment across environments

## 🛠️ Services Overview

### 1. **API Gateway** (Port 8080)
- **Purpose**: Central entry point for all client requests
- **Features**: Request routing, authentication middleware, rate limiting, CORS handling
- **Technology**: Express.js, http-proxy-middleware

### 2. **Auth Service** (Port 3001)
- **Purpose**: User authentication and authorization
- **Features**: User registration/login, JWT token management, password hashing
- **Technology**: Express.js, JWT, bcryptjs, PostgreSQL

### 3. **Post Service** (Port 3002)
- **Purpose**: Post management operations
- **Features**: CRUD operations, search functionality, pagination
- **Technology**: Express.js, Prisma ORM, PostgreSQL

### 4. **Comment Service** (Port 3003)
- **Purpose**: Comment and reply management
- **Features**: Nested comments, rich text processing, pagination
- **Technology**: Express.js, Prisma ORM, PostgreSQL, custom rich text processor

### 5. **Frontend** (Port 8000)
- **Purpose**: User interface
- **Features**: Responsive design, rich text editor, search, pagination
- **Technology**: React 18, Tailwind CSS

## 🔒 Security Overview

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Token Validation**: Middleware validates tokens on protected routes
- **Role-Based Access**: Users can only modify their own content

### Input Validation & Sanitization
- **Express Validator**: Comprehensive input validation on all endpoints
- **HTML Sanitization**: DOMPurify prevents XSS attacks in rich text content
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Rate Limiting**: Protection against abuse and DDoS attacks

### Data Protection
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored in environment variables
- **Database Security**: Separate databases for each service
- **Error Handling**: Secure error messages without sensitive information

## 📈 Scalability Design

### Horizontal Scaling
- **Stateless Services**: Each service can be replicated independently
- **Load Balancing**: API Gateway can distribute requests across service instances
- **Database Separation**: Each service has its own database, preventing bottlenecks
- **Container Orchestration**: Docker containers can be easily scaled with Kubernetes

### Performance Optimizations
- **Database Indexing**: Optimized queries with proper database indexes
- **Pagination**: Efficient data loading with configurable page sizes
- **Connection Pooling**: Database connection management for better performance
- **Caching Ready**: Architecture supports Redis integration for caching


## 🚀 How to Start & Run

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Post-Comments-Service

# Start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access Points
- **Frontend**: http://localhost:8000
- **API Gateway**: http://localhost:8080

### Useful Commands
```bash
# Stop services
docker-compose down

# Restart a service
docker-compose restart frontend

# View specific service logs
docker-compose logs -f auth-service
```

## 📖 How to Use

### User Registration & Login
1. Visit http://localhost:8000
2. Click "Register" to create a new account
3. Login with your credentials

### Creating Posts
1. Click "Create Post" (requires login)
2. Enter title and content with rich text formatting
3. Use **bold**, *italic*, <u>underline</u>, and [links](url)
4. Click "Create Post"

### Managing Comments
1. View any post to see comments
2. Click "Add Comment" to post a comment
3. Use rich text formatting in comments
4. Reply to existing comments (nested replies supported)

### Search & Navigation
1. Use the search bar to find posts by title or content
2. Navigate through pages using pagination
3. Sort posts by date or title

### API Usage
```bash
# Get all posts
GET http://localhost:8080/posts?page=1&page_size=10

# Get specific post
GET http://localhost:8080/posts/1

# Get comments for a post
GET http://localhost:8080/comments/post/1?page=1&page_size=10

# Create post (requires authentication)
POST http://localhost:8080/posts
Authorization: Bearer <jwt-token>
Content-Type: application/json
{
  "title": "Post Title",
  "content": "Post content"
}
```

## 🎯 Why This is a Good Solution

### Technical Excellence
- **Clean Architecture**: Well-structured, maintainable code
- **Modern Practices**: Uses industry-standard tools and patterns
- **Security Focus**: Comprehensive security measures implemented
- **Scalable Design**: Built to handle growth and increased load

### Production Ready
- **Docker Containerization**: Consistent deployment across environments
- **Error Handling**: Comprehensive error management throughout
- **Logging**: Structured logging for monitoring and debugging
- **Validation**: Input validation and sanitization on all endpoints

### Developer Experience
- **Clear Documentation**: Well-documented code and APIs
- **Consistent Patterns**: Uniform code structure across services
- **Easy Setup**: Simple one-command deployment
- **Modular Design**: Easy to extend and modify
