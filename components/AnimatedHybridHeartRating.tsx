// client/src/pages/skateparks/components/AnimatedHybridHeartRating.tsx
import AnimatedHybridRating from './AnimatedHybridRating';

interface HeartRatingProps {
  rating: number;
  totalVotes: number;
  onRate?: (rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
  hideVotesCount?: boolean;
}

const AnimatedHybridHeartRating = ({
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete,
  hideVotesCount = false
}: HeartRatingProps) => {
  // Default empty promise function if onRate is not provided
  const handleRate = onRate || (async () => {});
  
  return (
    <AnimatedHybridRating
      type="heart"
      rating={rating}
      totalVotes={totalVotes}
      onRate={handleRate}
      readonly={readonly}
      userRating={userRating}
      onVoteComplete={onVoteComplete}
      hideVotesCount={hideVotesCount}
    />
  );
};

export default AnimatedHybridHeartRating;