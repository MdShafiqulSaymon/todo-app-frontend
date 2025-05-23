# 🧠 Collaborative ToDo Application - Frontend

A modern, responsive frontend application built with **Next.js** for collaborative task management. This application provides an intuitive interface for users to create multiple ToDo apps, collaborate with team members, and manage tasks with role-based permissions.

## 🚀 Features

### ✅ Completed Features

#### 🔐 User Authentication
- **Sign Up**: Create new user accounts with secure password hashing
- **Login/Logout**: JWT-based authentication system
- **Protected Routes**: Secure access to authenticated pages
- **Session Management**: Persistent login sessions

#### 📋 ToDo App Management
- **Multiple ToDo Apps**: Users can create and manage multiple ToDo applications (e.g., "Work Tasks", "Project Alpha")
- **App Overview**: Dashboard showing all accessible ToDo apps
- **App Creation**: Simple interface to create new ToDo apps
- **App Deletion**: Only owners can delete entire ToDo apps

#### ✏️ Task CRUD Operations
- **Create Tasks**: Add new tasks with descriptions
- **Read Tasks**: View all tasks within a ToDo app
- **Update Tasks**: Edit task details and descriptions
- **Delete Tasks**: Remove tasks from the list
- **Task Status Management**: Mark tasks as:
  - 🔄 In Progress
  - ✅ Completed
  - ⏸️ Stale

#### 👥 Collaboration & Permissions
- **User Invitations**: ToDo app owners can invite other users via email
- **Role-Based Access Control**:
  - **Owner**: Full control (manage permissions, delete app, all task operations)
  - **Editor**: Can add, edit, delete, and mark tasks
  - **Viewer**: Read-only access to tasks
- **Permission Management**: Owners can modify user roles and remove collaborators
- **Access Control**: UI elements dynamically shown/hidden based on user permissions

#### 💾 Persistent Storage
- **Database Integration**: MongoDB for reliable data persistence
- **Relational Data Modeling**: Proper relationships between users, ToDo apps, and tasks
- **Data Integrity**: Foreign key constraints and validation

#### 🎨 Frontend UX (Next.js)
- **Responsive Design**: Mobile-friendly interface
- **Intuitive Navigation**: Easy switching between ToDo apps
- **Role-Based UI**: Controls and options displayed based on user permissions
- **User Management Interface**: Streamlined invitation and role management system
- **Real-time Feedback**: Loading states and success/error notifications


## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and management
- **Context API**: State management
- **React Query/SWR**: Server state management and caching

## 🏗️ Project Structure

```
collaborative-todo-frontend/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── dashboard/      # Main dashboard
│   │   ├── todo-apps/      # ToDo app pages
│   │   ├── page.tsx        # ToDo app pages
│   │   └── layout.tsx      # Root layout
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── auth/           # Authentication components
│   │   ├── todo-app/       # ToDo related components
│   │   └── layout/         # Layout components
│   ├── context/            # Context API
│   │   ├── AuthContext.tsx # Context API for Authentication
│   ├── lib/                # Utilities and configurations
│   │   ├── api.ts          # API client setup
│   │   └── type.ts         # Use to define Types
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API server running (separate repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone origin https://github.com/MdShafiqulSaymon/todo-app-frontend.git
   cd todo-app-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```bash
   # .env.local
   NEST_PUBLIC_API_URL="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3001"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3001

### Build for Production
```bash
npm run build
npm start
```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create a new account or login with existing credentials
2. **Create ToDo App**: Click "New ToDo App" to create your first task list
3. **Add Tasks**: Start adding tasks with descriptions and status
4. **Invite Collaborators**: Use the "Manage Users" feature to invite team members
5. **Assign Roles**: Set appropriate permissions (Viewer/Editor) for collaborators

### Role Permissions
| Action | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| View Tasks | ✅ | ✅ | ✅ |
| Create Tasks | ✅ | ✅ | ❌ |
| Edit Tasks | ✅ | ✅ | ❌ |
| Delete Tasks | ✅ | ✅ | ❌ |
| Mark Task Status | ✅ | ✅ | ❌ |
| Invite Users | ✅ | ❌ | ❌ |
| Manage Permissions | ✅ | ❌ | ❌ |
| Delete ToDo App | ✅ | ❌ | ❌ |

## 🧪 Frontend Architecture

### Component Hierarchy
```
todo-app-frontend/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── todo-app/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   │   └── task/
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [taskId]/
│   │   │           └── edit/
│   │   │               └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── todo-app/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── CollaboratorManagement.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Badge.tsx
│       ├── Spinner.tsx
│       └── Modal.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── api.ts
│   └── types.ts
├── public/
│   └── (static assets, e.g., favicon.ico)
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### API Layer Structure
```typescript
// lib/api.ts
class ApiClient {
  // Authentication endpoints
  auth: {
    login: (credentials) => Promise<AuthResponse>
    signup: (userData) => Promise<AuthResponse>
    logout: () => Promise<void>
  }
  
  // Todo Apps endpoints
  todoApps: {
    getAll: () => Promise<TodoApp[]>
    create: (data) => Promise<TodoApp>
    update: (id, data) => Promise<TodoApp>
    delete: (id) => Promise<void>
    getUsers: (id) => Promise<User[]>
    inviteUser: (id, userData) => Promise<void>
  }
  
  // Tasks endpoints
  tasks: {
    getByApp: (appId) => Promise<Task[]>
    create: (appId, data) => Promise<Task>
    update: (id, data) => Promise<Task>
    delete: (id) => Promise<void>
    updateStatus: (id, status) => Promise<Task>
  }
}
```

## 🎯 Key Frontend Features Demonstrated

### React & Next.js Expertise
- **App Router**: Modern Next.js 13+ routing with server and client components
- **Server-Side Rendering (SSR)**: Optimized page loading and SEO
- **Client-Side Navigation**: Smooth transitions between pages
- **TypeScript Integration**: Full type safety across components and API calls
- **Custom Hooks**: Reusable logic for data fetching and state management

### UI/UX Implementation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Modular, reusable component system
- **Conditional Rendering**: Role-based UI components and permissions
- **Form Handling**: Advanced form validation with React Hook Form
- **Loading States**: Skeleton loaders and loading indicators
- **Error Boundaries**: Graceful error handling and user feedback


## 🚀 Deployment

### Recommended Deployment Stack
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas

### Environment Variables
Ensure all environment variables are properly configured in your deployment platform.


⭐ **Star this repository if you found it helpful!**
