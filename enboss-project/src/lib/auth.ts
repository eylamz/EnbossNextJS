import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { IUser } from '@/models/User'
import mongoose from 'mongoose'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret-dont-use-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

// Compare password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate token
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  )
}

// Set auth cookie
export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    sameSite: 'strict',
  })
}

// Clear auth cookie
export const clearAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

// Get token from request
export const getTokenFromRequest = (request: NextRequest): string | null => {
  // Check Authorization header first
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1]
  }
  
  // Then check cookies
  const cookieToken = request.cookies.get('auth_token')?.value
  return cookieToken || null
}

// Verify token and get user data
export const verifyToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string }
  } catch (error) {
    return null
  }
}

// Current user type
export type CurrentUser = {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

// Extract user data from the full user object
export const getUserData = (user: IUser & { _id: mongoose.Types.ObjectId }): CurrentUser => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}