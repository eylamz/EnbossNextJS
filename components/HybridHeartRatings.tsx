// client/src/pages/skateparks/components/HybridHeartRating.tsx
import HybridRating from './HybridRating';

interface HeartRatingProps {
  rating: number;
  totalVotes: number;
  onRate?: (rating: number) => Promise<void>;
  readonly?: boolean;
  userRating?: number | null;
  onVoteComplete?: () => void;
}

const HybridHeartRating = ({
  rating,
  totalVotes,
  onRate,
  readonly = false,
  userRating = null,
  onVoteComplete
}: HeartRatingProps) => {
  // Default empty promise function if onRate is not provided
  const handleRate = onRate || (async () => {});
  
  return (
    <HybridRating
      type="heart"
      rating={rating}
      totalVotes={totalVotes}
      onRate={handleRate}
      readonly={readonly}
      userRating={userRating}
      onVoteComplete={onVoteComplete}
    />
  );
};

export default HybridHeartRating;