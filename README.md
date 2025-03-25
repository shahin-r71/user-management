# User Management System

A full-stack web application for user management with authentication, registration, and admin capabilities.

## Live Site: *[https://user-management-taupe-six.vercel.app/]()*

## Live Video Demo: *[https://youtu.be/BPAHDsEYTmY]()*

## Features

### User Authentication

* Secure login and registration
* No email confirmation required
* Password protection (supports any non-empty password)

### User Management Dashboard

* Comprehensive user table with sorting capabilities
* Multiple user selection with checkboxes (including select all/deselect all)
* Visual indicators for blocked users (strikethrough names and dimmed text)
* Last seen time with tooltip showing exact timestamp

### Admin Actions

* Block users with a single click
* Unblock previously blocked users
* Permanently delete users (complete removal from Supabase auth.users table)
* Bulk actions for multiple selected users

### Security Features

* Blocked users cannot access the system
* Automatic redirection to login page for unauthorized access
* Server-side validation for all actions
* Unique email enforcement at database level

### User Experience

* Responsive design for desktop and mobile
* Tooltips for action buttons
* Success and error notifications
* Clean, modern UI with TailwindCSS

## Technology Stack

### Frontend

* Next.js 15.2.3
* React 19
* TailwindCSS 4
* TanStack React Table for data display
* React Hook Form for form handling
* React Hot Toast for notifications

### Backend

* Next.js API Routes
* Supabase for authentication
* Prisma ORM for database access

### Database

* PostgreSQL with Supabase
* Unique indices for email enforcement
* Proper schema design with relationships

## Local Setup

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* PostgreSQL database (or Supabase account)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_postgres_database_url

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/shahin-r71/user-management.git
   cd user-management
   ```
2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   ```
4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
user-management/
├── app/                    # Next.js App Router
│   ├── api/                # API endpoints
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   └── register/           # Registration page
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   └── utils/              # Helper utilities
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## Database Schema

The application uses a PostgreSQL database with the following main tables:

* **User** - Stores user information with fields:
  * id (UUID, primary key)
  * email (String, unique)
  * name (String)
  * status (String: active/blocked)
  * lastLogin (DateTime)
  * createdAt (DateTime)
  * updatedAt (DateTime)
  * authId (UUID, foreign key to Supabase auth.users)

The database includes a unique index on the email field to prevent duplicate emails at the database level.

## API Endpoints

* **/api/users**

  * GET: Fetch all users
  * DELETE: Delete selected users (completely removes users from Supabase auth.users)
* **/api/users/register**

  * POST: Register a new user
* **/api/users/login**

  * POST: Authenticate a user
* **/api/users/status**

  * PATCH: Update user status (block/unblock)

## Error Handling

The application implements robust error handling:

* Database errors are properly caught and user-friendly messages are displayed
* Type-safe error handling with TypeScript
* Consistent error messages across the application

## Responsive Design

The application is fully responsive and works well on:

* Desktop browsers
* Tablets
* Mobile devices

## Deployment

The application can be deployed to various platforms:

1. **Vercel** (recommended for Next.js apps)

   * Connect your GitHub repository
   * Configure environment variables
   * Deploy with a single click
2. **Other Platforms**

   * Netlify
   * AWS
   * Azure
   * Any platform supporting Node.js applications
