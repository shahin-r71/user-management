import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/utils/supabase/server'


export async function POST() {
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

    // Update lastLogin time in our database using authId
    const updatedUser = await prisma.user.update({
      where: {
        authId: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      lastLogin: updatedUser.lastLogin,
    })
  } catch (error) {
    console.error('Error updating last login:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}