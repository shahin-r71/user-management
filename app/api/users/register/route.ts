import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { handleDatabaseError } from '@/lib/utils/errors'

export async function POST(request: Request) {
  
    try {
    const body = await request.json();
    const { name, email, authId, description } = body;

    // Create user in our database
    const user = await prisma.user.create({
        data: {
        name,
        email,
        authId,
        description,
        status: 'active',
        lastLogin: new Date(),
        },
    })

    return NextResponse.json({
        success: true,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        },
    })
    } catch (error: unknown) {
    console.error('Error registering user:', error)

    // Handle known database errors
    const errorMessage = handleDatabaseError(error)

    return NextResponse.json(
        { error: errorMessage },
        { status: (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') ? 409 : 500 }
    )
    }
}