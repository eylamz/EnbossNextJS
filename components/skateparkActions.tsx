import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/config/icons';

interface SkateparkActionsProps {
  parkId: string;
  parkName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const SkateparkActions = ({ parkId, parkName, coordinates }: SkateparkActionsProps) => {
  const { toast } = useToast();
  
  // Favorites handling
  const [isFavorite, setIsFavorite] = React.useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteSkateparks') || '[]');
    return favorites.includes(parkId);
  });

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteSkateparks') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== parkId);
      toast({
        description: "Removed from favorites",
      });
    } else {
      newFavorites = [...favorites, parkId];
      toast({
        description: "Added to favorites",
      });
    }
    
    localStorage.setItem('favoriteSkateparks', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Sharing functionality
  const shareOptions = [
    {
      name: 'Copy Link',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
          description: "Link copied to clipboard",
        });
      }
    },
    {
      name: 'Share on WhatsApp',
      action: () => {
        window.open(`https://wa.me/?text=Check out ${parkName} on Skateparks: ${window.location.href}`);
      }
    },
    {
      name: 'View on Google Maps',
      action: () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`);
      }
    }
  ];

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFavorite}
        className={isFavorite ? 'text-red-500' : ''}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {shareOptions.map((option) => (
            <DropdownMenuItem
              key={option.name}
              onClick={option.action}
            >
              {option.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`)}
      >
        <Icon 
           name="location" 
           category="navigation" 
           className="w-5 h-5"
         />
      </Button>
    </div>
  );
};

export default SkateparkActions;