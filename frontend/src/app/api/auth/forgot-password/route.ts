import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/resend'
import crypto from 'crypto'

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const inputEmail = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email: inputEmail } }).catch(() => null)

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 3600000) // 1 hour

      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: resetToken,
          expires,
        },
      }).catch(() => {})

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const resetUrl = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`

      if (process.env.RESEND_API_KEY) {
        await sendPasswordResetEmail({ to: user.email, resetUrl }).catch((err) =>
          console.error('Failed to send password reset email via Resend:', err)
        )
      } else {
        console.log(`[Dev Mode] Password reset URL for ${user.email}: ${resetUrl}`)
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent.',
    })
  } catch (error: any) {
    console.error('Forgot Password API Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
