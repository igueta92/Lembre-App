# Replit.md

## Overview

Lembre is a domestic task management application designed for Brazilian families. The system gamifies household chores through a points-based system, allowing family members to create, assign, and complete tasks while tracking their progress on leaderboards. The application emphasizes emotional connection and family collaboration through its warm, caring interface design.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with proper error handling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with connection pooling
- **Migrations**: Drizzle Kit for schema migrations
- **Connection**: @neondatabase/serverless with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **User Management**: Automatic user creation/updates on login
- **Authorization**: Route-level authentication middleware

### Database Schema
```typescript
// Core entities
- users: User profiles with points and home associations
- homes: Family/household groups
- tasks: Task management with assignments and completion tracking
- sessions: Express session storage
```

### Task Management
- **Creation**: Users can create tasks with priority, deadlines, and point values
- **Assignment**: Tasks assigned to specific family members
- **Completion**: Point rewards upon task completion
- **Tracking**: Real-time status updates and progress monitoring

### Gamification System
- **Points**: Reward system for completed tasks (1-50 points)
- **Rankings**: Family leaderboards based on accumulated points
- **Progress Tracking**: Visual indicators for task completion rates

## Data Flow

1. **Authentication Flow**:
   - User initiates login via Replit Auth
   - OpenID Connect handles authentication
   - User profile created/updated in database
   - Session established with PostgreSQL storage

2. **Task Management Flow**:
   - Authenticated users create/view tasks
   - Tasks assigned to family members
   - Real-time updates via React Query
   - Point allocation upon completion

3. **Family Management Flow**:
   - Users create or join existing homes
   - Home invitation system via shareable links
   - Member management and role assignment
   - Ranking calculations and display

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **express**: Web framework
- **passport** & **openid-client**: Authentication
- **connect-pg-simple**: Session storage

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **lucide-react**: Icon library
- **react-hook-form**: Form handling
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 provisioned by Replit
- **Development Server**: Vite dev server with HMR
- **Process Management**: `tsx` for TypeScript execution

### Production Deployment
- **Platform**: Replit Autoscale deployment
- **Build Process**: 
  1. Vite builds client assets to `dist/public`
  2. esbuild bundles server code to `dist/index.js`
- **Runtime**: Node.js production server serving static assets
- **Database**: Persistent PostgreSQL with connection pooling

### Environment Configuration
```bash
# Required environment variables
DATABASE_URL=postgresql://...        # Database connection string
SESSION_SECRET=...                   # Session encryption key
REPL_ID=...                         # Replit environment identifier
ISSUER_URL=https://replit.com/oidc  # OpenID Connect issuer
REPLIT_DOMAINS=...                  # Allowed domains for auth
```

## Changelog
```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

Preferred communication style: Simple, everyday language.