'use client'

import { Card } from '@/components/ui/Card'
import { Icon } from '@/assets/icons'
import HeartRating from './HeartRating'
import { updateRating } from '@/app/actions/rating'
import { useRouter } from 'next/navigation'

interface RatingCardProps {
  skateparkId: string
  rating: number
  totalVotes: number
  isClosed?: boolean
  title: string
  subtitle?: string
  onHeartRatePark?: (parkId: string, rating: number) => Promise<void>
}

export function RatingCard({ skateparkId, rating, totalVotes, isClosed = false, title, subtitle, onHeartRatePark }: RatingCardProps) {
  const router = useRouter()

  const handleRate = async (rating: number) => {
    console.log('=== RATING CARD DEBUG ===')
    console.log('Current park rating:', rating)
    console.log('Current total votes:', totalVotes)
    console.log('Skatepark ID:', skateparkId)
    console.log('User voted:', rating)

    // Get previous rating from localStorage
    let previousRating = null;
    if (typeof window !== 'undefined') {
      try {
        const ratings = JSON.parse(localStorage.getItem('skateparkRatings') || '{}');
        previousRating = ratings[skateparkId] || null;
        console.log('Previous rating from localStorage:', previousRating)
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }

    if (onHeartRatePark) {
      try {
        await onHeartRatePark(skateparkId, rating)
        console.log('=== RATING CARD UPDATE DEBUG ===')
        console.log('Update completed')
        console.log('Current rating state:', { rating, totalVotes })
        console.log('=== END RATING CARD UPDATE DEBUG ===')
        
        // Force a hard refresh to ensure we get the latest data
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      } catch (error) {
        console.error('Error in handleRate:', error)
      }
    }
    console.log('=== END RATING CARD DEBUG ===')
  }

  return (
    <div className="max-w-6xl h-full w-full mx-auto mb-8">
      <Card className="flex flex-col justify-between h-full p-4 backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70 transform-gpu">
        <div className="flex items-center justify-between mb-3 text-text dark:text-[#b3b3b3]">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-[#f2f2f2]">
              <Icon name="heartBold" category="ui" className="w-5 h-5 dark:text-[#f2f2f2]" />
              {title}
            </h2>
            {subtitle && (
              <p className="text-text dark:text-[#b3b3b3] mt-1 px-3">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <HeartRating
          rating={rating}
          totalVotes={totalVotes}
          onRate={handleRate}
          readonly={isClosed}
          skateparkId={skateparkId}
          className=""
        />
      </Card>
    </div>
  )
} 