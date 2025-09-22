# Post-Comments Microservice System

## Assignment Submission

This project demonstrates a **microservice-based post and comments system** built as a technical assignment. The solution showcases modern software architecture principles, clean code practices, and production-ready development standards.

**Key Features:**
- User authentication required for posting and commenting
- Rich text editor for posts and comments
- Comment on any user's posts (not just your own)
- Nested comment replies with proper deletion protection
- Real-time updates and responsive design

## 📹 Demo & Architecture

### Video Demos
**System Architecture Explanation**
I have made a video explaining the system architecture of this assignment
**[🎥 System Design Video](https://www.loom.com/share/f003e6db179d4873ba1410c92014372c?sid=5d9d6257-bb9b-449a-af4e-3880d5ac0072)**

**Application Walkthrough**
Complete walkthrough of the application features and user flow
**[🎥 Application Walkthrough](https://www.loom.com/share/ae421f77a7a04d9f873e3a219df4b72d?sid=9867f860-f98f-4cfe-8d03-026557098e82)**

### System Architecture
![System Architecture](https://github.com/rohithvarma444/Post-Comments-Service/blob/main/Screenshot%202025-09-21%20at%205.22.54%E2%80%AFPM.png)

The diagram above shows the complete microservice architecture with:
- **Frontend** (localhost:8000) interacting with **API Gateway** (localhost:8080)
- **API Gateway** routing requests to three microservices: Auth, Post, and Comment Services
- Each service having its own dedicated PostgreSQL database
- Security implementations and database optimizations highlighted

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

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Post-Comments-Service

# Start all services (automated setup)
./start.sh
```

That's it! The start script will:
- Automatically create the `.env` file from `env.example`
- Start all Docker services
- Display service URLs and useful commands

### Manual Setup (Alternative)
If you prefer manual setup:
```bash
# Copy environment file
cp env.example .env

# Start services
docker-compose up --build -d

# Check status
docker-compose ps
```

### Access Points
- **Frontend**: http://localhost:8000
- **API Gateway**: http://localhost:8080

### Quick User Guide
1. **Start**: Run `./start.sh`
2. **Open**: Go to http://localhost:8000
3. **Register**: Create your account (required for posting/commenting)
4. **Login**: Use your credentials
5. **Post**: Create posts with rich text formatting
6. **Comment**: Comment on any user's posts
7. **Reply**: Join conversations with nested comments

**Note**: Login required for posting/commenting. You can comment on any user's posts.

### Useful Commands
```bash
# Start services
./start.sh

# Stop services
./stop.sh

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

## 📖 How to Use

### Getting Started
**Important**: You must register and login before you can create posts or add comments.

### Basic Usage
1. **Register**: Create account at http://localhost:8000
2. **Login**: Use your credentials
3. **Create Posts**: Click "Create Post" and use rich text editor
4. **Comment**: Comment on any user's posts (not just your own)
5. **Reply**: Create nested comment discussions
6. **Manage**: Edit/delete your own content only

### Features
- **Rich Text**: Bold, italic, underline, links in posts and comments
- **Cross-User Comments**: Comment on any user's posts
- **Nested Replies**: Multi-level comment discussions
- **Search**: Find posts by title or content
- **Pagination**: Navigate through posts and comments

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

