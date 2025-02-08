import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
    const { userId } = await request.json()
    const client = await clerkClient()
    console.log(client.users.getUser(userId))

//   await client.users.updateUserMetadata(userId, {
//     publicMetadata: {
//       stripeId: stripeId,
//     },
//   })

  return NextResponse.json({ success: true })
}