'use server'

import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'

export async function updateRating(formData: FormData) {
  const skateparkId = formData.get('skateparkId') as string
  const rating = Number(formData.get('rating'))

  if (!skateparkId || !rating || isNaN(rating)) {
    throw new Error('Invalid input data')
  }

  try {
    await dbConnect()
    
    const skatepark = await Skatepark.findById(skateparkId)
    if (!skatepark) {
      throw new Error('Skatepark not found')
    }

    const currentRating = parseFloat(skatepark.rating) || 0
    const currentVotes = parseInt(skatepark.totalVotes) || 0
    const newVotes = currentVotes + 1
    const newRating = ((currentRating * currentVotes) + rating) / newVotes

    await Skatepark.findByIdAndUpdate(skateparkId, {
      $inc: { totalVotes: 1 },
      $set: { rating: parseFloat(newRating.toFixed(2)) }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating rating:', error)
    throw error
  }
} 