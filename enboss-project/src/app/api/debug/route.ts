import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'

export async function GET() {
  try {
    await dbConnect()
    
    // Get total count
    const totalCount = await Skatepark.countDocuments({})
    
    // Get all parks with minimal fields
    const allParks = await Skatepark.find({}, {
      _id: 1,
      nameEn: 1,
      nameHe: 1,
      area: 1,
      closingYear: 1
    })
    
    // Group parks by area
    const parksByArea = allParks.reduce((acc: any, park) => {
      const area = park.area || 'unknown'
      if (!acc[area]) {
        acc[area] = []
      }
      acc[area].push({
        id: park._id,
        nameEn: park.nameEn,
        nameHe: park.nameHe,
        closingYear: park.closingYear
      })
      return acc
    }, {})
    
    return NextResponse.json({
      totalParks: totalCount,
      parksByArea,
      allParks: allParks.map(park => ({
        id: park._id,
        nameEn: park.nameEn,
        nameHe: park.nameHe,
        area: park.area,
        closingYear: park.closingYear
      }))
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 })
  }
} 