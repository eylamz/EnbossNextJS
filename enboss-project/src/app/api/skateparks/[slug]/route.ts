import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'
import { getCache, setCache } from '@/lib/redis'

// Get skatepark by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()
    
    const slug = params.slug
    
    // Try to get from cache first
    const cacheKey = `skatepark:${slug}`
    const cachedData = await getCache(cacheKey)
    
    if (cachedData) {
      return NextResponse.json(cachedData)
    }
    
    // Get from database
    const skatepark = await Skatepark.findOne({ slug })
    
    if (!skatepark) {
      return NextResponse.json(
        { error: 'Skatepark not found' },
        { status: 404 }
      )
    }
    
    // Cache the result
    await setCache(cacheKey, skatepark, 3600) // Cache for 1 hour
    
    return NextResponse.json(skatepark)
  } catch (error) {
    console.error(`Error fetching skatepark with slug ${params.slug}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch skatepark' },
      { status: 500 }
    )
  }
}