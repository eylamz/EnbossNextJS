import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'
import { getCache, setCache } from '@/lib/redis'

// Get all skateparks
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const area = searchParams.get('area')
    const status = searchParams.get('status') || 'active'
    const featured = searchParams.get('featured')
    
    // Build query
    const query: any = {
      status: status === 'all' ? { $in: ['active', 'inactive'] } : status,
    }
    
    if (area) {
      query.area = area
    }
    
    if (featured === 'true') {
      query.isFeatured = true
    }
    
    // Try to get from cache first
    const cacheKey = `skateparks:${JSON.stringify(query)}`
    const cachedData = await getCache<any[]>(cacheKey)
    
    if (cachedData) {
      return NextResponse.json(cachedData)
    }
    
    // Get from database
    const skateparks = await Skatepark.find(query).sort({ name: 1 })
    
    // Cache the results
    await setCache(cacheKey, skateparks, 3600) // Cache for 1 hour
    
    return NextResponse.json(skateparks)
  } catch (error) {
    console.error('Error fetching skateparks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skateparks' },
      { status: 500 }
    )
  }
}