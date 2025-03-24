import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { handleDatabaseError } from '@/lib/utils/errors'
import { createClient } from '@/lib/utils/supabase/server'


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

    // Get user information from our database using email
    const CurrentUser = await prisma.user.findUnique({
        where: {
        email: user.email,
        },
        select: {
        id: true,
        status: true,
        },
    })

    if (!CurrentUser) {
        return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
        )
    }

    return NextResponse.json({
        id: user.id,
        status: CurrentUser.status,
    })
    } catch (error) {
    console.error('Error checking user status:', error)
    return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
    )
    }
}

export async function PATCH(request: Request) {
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

    if (!currentUser || currentUser.status === 'blocked') {
        return NextResponse.json(
        { message: 'Your account has been deactivated. Please contact support.' },
        { status: 401 }
        )
    }

    // Parse the request body
    const body = await request.json()
    const { ids, status } = body

    if (!ids || !Array.isArray(ids) || !status) {
        return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
        )
    }

    // Update user status
    const updatedUsers = await prisma.user.updateMany({
        where: {
        id: {
            in: ids,
        },
        },
        data: {
        status,
        },
    })

    return NextResponse.json({
        success: true,
        count: updatedUsers.count,
    })
    } catch (error) {
    console.error('Error updating user status:', error)
    const errorMessage = handleDatabaseError(error)

    return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
    )
    }
}