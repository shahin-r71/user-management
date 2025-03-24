// Define a type for database errors
type DatabaseError = {
  code?: string;
  message?: string;
};

export function handleDatabaseError(error: unknown): string {
  console.error('Database error:', error)
  
  // Handle Prisma errors
  if ((error as DatabaseError).code === 'P2002') {
    return 'A user with this email already exists.'
  }
  
  if ((error as DatabaseError).code === 'P2025') {
    return 'Record not found.'
  }
  
  // Handle Supabase errors
  if ((error as DatabaseError).code === '23505') {
    return 'A user with this email already exists.'
  }
  
  // Handle permission errors
  if ((error as DatabaseError).code === '42501' || (error as DatabaseError).code === 'P0001') {
    return 'You do not have permission to perform this action.'
  }
  
  // Handle connection errors
  if ((error as DatabaseError).code?.startsWith('P1')) {
    return 'Database connection error. Please try again later.'
  }
  
  return (error as DatabaseError).message || 'An unexpected error occurred. Please try again.'
}