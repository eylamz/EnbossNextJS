'use client'

import { Card } from '@/components/ui/Card'
import { Icon } from '@/assets/icons'
import HeartRating from './HeartRating'
import { updateRating } from '@/app/actions/rating'

interface RatingCardProps {
  skateparkId: string
  rating: number
  totalVotes: number
  isClosed: boolean
  title: string
}

export function RatingCard({ skateparkId, rating, totalVotes, isClosed, title }: RatingCardProps) {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <Card className="p-4 backdrop-blur-custom bg-background/80 dark:bg-background-secondary-dark/70 transform-gpu">
        <div className="flex items-center justify-between mb-3 text-text dark:text-[#7991a0]">
          <h2 className="text-lg font-semibold flex items-center">
            <Icon name="heartBold" category="ui" className="w-5 h-5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            {title}
          </h2>
        </div>
        <HeartRating
          rating={rating}
          totalVotes={totalVotes}
          onRate={async (rating: number) => {
            const formData = new FormData()
            formData.append('skateparkId', skateparkId)
            formData.append('rating', rating.toString())
            await updateRating(formData)
          }}
          readonly={isClosed}
        />
      </Card>
    </div>
  )
} 