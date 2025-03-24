import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { handleDatabaseError } from '@/lib/utils/errors'
import { createClient } from '@/lib/utils/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-admin'



// Get all users
export async function GET() {
  try {
    // Get the current user from Supabase auth
    const supabase = await createClient()
    const {data: { user },error} = await supabase.auth.getUser()

    if (!user || error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if current user is active
    const currentUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        status: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all users, sorted by lastLogin
    const users = await prisma.user.findMany({
      orderBy: {
        email: 'asc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error getting users:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Delete users
export async function DELETE(request: Request) {
  try {
    // Get the current user from Supabase auth
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user information from our database
    const currentUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const url = new URL(request.url)
    const idsParam = url.searchParams.get('ids')

    if (!idsParam) {
      return NextResponse.json(
        { error: 'No user IDs provided' },
        { status: 400 }
      )
    }

    // Parse IDs from comma-separated string
    const ids = idsParam.split(',')

    // Validate IDs
    if (!ids.length) {
      return NextResponse.json(
        { error: 'No valid user IDs provided' },
        { status: 400 }
      )
    }

    // If current user is being deleted, sign them out
    if (ids.includes(currentUser.id)) {
      await supabase.auth.signOut()
    }
    console.log('Deleting users, IDs:', ids)

  

    try {
      // First, get the auth IDs for all users we want to delete
      const usersToDelete = await prisma.user.findMany({
        where: {
          id: {
            in: ids
          }
        },
        select: {
          id: true,
          authId: true,
          email: true
        }
      })

      // Delete each user from Supabase auth using the admin client
      for (const user of usersToDelete) {
        try {
          // Skip if authId is missing
          if (!user.authId) {
            console.warn(`User ${user.email} has no authId, skipping auth deletion`)
            continue
          }

          // Delete from Supabase auth
          const { error } = await supabaseAdmin.auth.admin.deleteUser(user.authId)
          
          if (error) console.error(`Error deleting user ${user.id} from auth:`, error)
        } catch (userError) {
          console.error(`Error processing user ${user.id}:`, userError)
        }
      }
      
      // Force revalidation to ensure fresh data
      revalidatePath('/dashboard')
      
      return NextResponse.json({
        message: `Successfully deleted users`,
        status: 200
      })
    } catch (err) {
      const errorMessage = handleDatabaseError(err)
      console.error('Error deleting users:', err)
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting users:', error)
    const errorMessage = handleDatabaseError(error)
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}