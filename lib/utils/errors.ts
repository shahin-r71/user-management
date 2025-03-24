// src/lib/utils/errors.ts
export function handleDatabaseError(error: any): string {
  console.error('Database error:', error)
  
  // Handle Prisma errors
  if (error.code === 'P2002') {
    return 'A user with this email already exists.'
  }
  
  if (error.code === 'P2025') {
    return 'Record not found.'
  }
  
  // Handle Supabase errors
  if (error.code === '23505') {
    return 'A user with this email already exists.'
  }
  
  // Handle permission errors
  if (error.code === '42501' || error.code === 'P0001') {
    return 'You do not have permission to perform this action.'
  }
  
  // Handle connection errors
  if (error.code?.startsWith('P1')) {
    return 'Database connection error. Please try again later.'
  }
  
  return error.message || 'An unexpected error occurred. Please try again.'
}