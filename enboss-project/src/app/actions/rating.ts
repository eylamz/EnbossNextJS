'use server'

import dbConnect from '@/lib/mongodb'
import Skatepark from '@/models/Skatepark'

export async function updateRating(formData: FormData) {
  const skateparkId = formData.get('skateparkId') as string
  const ratingStr = formData.get('rating') as string
  const previousRatingStr = formData.get('previousRating') as string

  console.log('=== RATING ACTION DEBUG ===')
  console.log('Raw skateparkId:', skateparkId)
  console.log('Raw rating:', ratingStr)
  console.log('Raw previousRating:', previousRatingStr)

  // Validate inputs
  if (!skateparkId) {
    throw new Error('Skatepark ID is required')
  }

  const rating = parseFloat(ratingStr)
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Invalid rating value')
  }

  const previousRating = previousRatingStr ? parseFloat(previousRatingStr) : null
  if (previousRatingStr && (isNaN(parseFloat(previousRatingStr)) || previousRating === null)) {
    console.log('Invalid previous rating, treating as new vote')
  }

  console.log('Parsed rating:', rating)
  console.log('Parsed previousRating:', previousRating)

  try {
    await dbConnect()
    
    const skatepark = await Skatepark.findById(skateparkId)
    if (!skatepark) {
      throw new Error('Skatepark not found')
    }

    console.log('Found skatepark:', skatepark.nameEn)
    console.log('Current rating from DB:', skatepark.rating)
    console.log('Current ratingCount from DB:', skatepark.ratingCount)

    // Validate and sanitize current rating
    let currentRating = parseFloat(skatepark.rating) || 0
    if (!isFinite(currentRating) || isNaN(currentRating)) {
      console.log('Invalid current rating detected, resetting to 0')
      currentRating = 0
    }
    
    const currentVotes = parseInt(skatepark.ratingCount) || 0
    
    let newRating: number
    let newVotes: number

    // Check if this is an update or new vote
    const isUpdate = previousRating !== null && !isNaN(previousRating) && currentVotes > 0

    if (isUpdate) {
      console.log('=== UPDATING EXISTING VOTE ===')
      // User is updating their existing vote
      newVotes = currentVotes // Keep same vote count
      
      // Calculate total points, remove old rating, add new rating
      const currentTotalPoints = currentRating * currentVotes
      const newTotalPoints = currentTotalPoints - previousRating + rating
      
      // Validate calculation
      if (currentVotes === 0 || isNaN(newTotalPoints) || !isFinite(newTotalPoints)) {
        console.error('Invalid calculation during update:', {
          currentTotalPoints,
          previousRating,
          rating,
          newTotalPoints
        })
        throw new Error('Invalid rating calculation during update')
      }
      
      newRating = newTotalPoints / currentVotes
      
      console.log('Current total points:', currentTotalPoints)
      console.log('Removing previous rating:', previousRating)
      console.log('Adding new rating:', rating)
      console.log('New total points:', newTotalPoints)
      console.log('New average:', newRating)
    } else {
      console.log('=== ADDING NEW VOTE ===')
      // User is voting for the first time
      newVotes = currentVotes + 1
      
      if (currentVotes === 0) {
        // Very first vote for this skatepark
        newRating = rating
        console.log('First vote ever, setting rating to:', rating)
      } else {
        // Adding to existing votes
        const currentTotalPoints = currentRating * currentVotes
        const newTotalPoints = currentTotalPoints + rating
        
        // Validate calculation
        if (isNaN(newTotalPoints) || !isFinite(newTotalPoints)) {
          console.error('Invalid calculation during new vote:', {
            currentTotalPoints,
            rating,
            newTotalPoints
          })
          throw new Error('Invalid rating calculation during new vote')
        }
        
        newRating = newTotalPoints / newVotes
        
        console.log('Current total points:', currentTotalPoints)
        console.log('Adding new rating:', rating)
        console.log('New total points:', newTotalPoints)
        console.log('New average:', newRating)
      }
    }

    // Final validation
    if (!isFinite(newRating) || isNaN(newRating)) {
      console.error('Calculated rating is invalid:', newRating)
      throw new Error('Rating calculation failed')
    }

    // Clamp rating to valid range
    newRating = Math.max(0, Math.min(5, newRating))
    
    console.log('Final rating to save:', newRating)
    console.log('Final votes to save:', newVotes)

    // Update the database
    const updateResult = await Skatepark.findByIdAndUpdate(
      skateparkId, 
      {
        rating: parseFloat(newRating.toFixed(2)),
        ratingCount: newVotes
      }, 
      { new: true }
    )

    if (!updateResult) {
      throw new Error('Failed to update skatepark')
    }

    console.log('Successfully updated!')
    console.log('New rating in DB:', updateResult.rating)
    console.log('New ratingCount in DB:', updateResult.ratingCount)
    console.log('Full updated document:', JSON.stringify({
      _id: updateResult._id,
      rating: updateResult.rating,
      ratingCount: updateResult.ratingCount
    }))
    console.log('=== END RATING ACTION DEBUG ===')

    return { 
      success: true,
      newRating: parseFloat(newRating.toFixed(2)),
      newVotes: newVotes
    }
  } catch (error) {
    console.error('Error in updateRating:', error)
    throw error
  }
} 