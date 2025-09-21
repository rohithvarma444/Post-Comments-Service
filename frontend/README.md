# Post Comments Frontend

A modern React frontend for the Post-Comments microservices system.

## Features

- 🔐 **User Authentication** - Login/Register with JWT tokens
- 📝 **Post Management** - Create, view, and delete posts
- 💬 **Comment System** - Nested comments with replies
- 🎨 **Modern UI** - Clean design with Tailwind CSS
- 📱 **Responsive** - Works on desktop and mobile
- ⚡ **Real-time** - Instant updates for posts and comments

## Quick Start

### Development
```bash
cd frontend
npm install
npm start
```

### Production (Docker)
```bash
# From project root
docker-compose up -d
```

The frontend will be available at:
- **Development**: http://localhost:3000
- **Production**: http://localhost:3000 (via Docker)

## API Integration

The frontend connects to your microservices via the API Gateway:
- **Auth Service**: `/auth/*` - User authentication
- **Post Service**: `/posts/*` - Post operations
- **Comment Service**: `/comments/*` - Comment operations

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Nginx** - Production web server

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/          # Login/Register components
│   │   ├── Posts/         # Post-related components
│   │   ├── Comments/      # Comment system
│   │   └── Layout/        # Navigation, layout
│   ├── contexts/          # React contexts (Auth)
│   ├── services/          # API client
│   └── App.js            # Main app component
├── public/               # Static assets
└── Dockerfile           # Production build
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080)

## Features Overview

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- User session management

### Posts
- Create text-only posts
- View post details with comments
- Delete your own posts
- Search functionality
- Pagination support

### Comments
- Add comments to posts
- Reply to comments (nested)
- Edit/delete your comments
- Real-time comment updates
- Threaded conversations

Built with ❤️ for CloudSEK
