import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: Role
      vendorId?: string | null
    }
  }
  interface User {
    role: Role
    vendorId?: string | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // ------------------------------------------------------------------
        // Fallback admin login for local testing without a database
        // ------------------------------------------------------------------
        if (
          !process.env.DATABASE_URL &&
          credentials.email === 'admin@vaapi.in' &&
          credentials.password === 'admin'
        ) {
          return {
            id: 'mock-admin-id',
            name: 'Demo Admin',
            email: 'admin@vaapi.in',
            role: 'SUPER_ADMIN',
            vendorId: null,
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null
        if (user.isBlocked) throw new Error('Account is blocked. Contact support.')

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          vendorId: user.vendorId,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.vendorId = user.vendorId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
        session.user.vendorId = token.vendorId as string | null
      }
      return session
    },
  },
})

// Helper: check if user has admin access
export function isAdminRole(role: Role): boolean {
  return role === 'SUPER_ADMIN' || role === 'STAFF' || role === 'VENDOR'
}

export function isSuperAdmin(role: Role): boolean {
  return role === 'SUPER_ADMIN'
}
