import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  className?: string;
  isInteractive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRate,
  size = 16,
  className = '',
  isInteractive = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate: number) => {
    if (isInteractive && onRate) {
      onRate(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (isInteractive) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };
  
  const displayRating = hoverRating || Math.round(rating);

  return (
    <div className={`flex items-center ${className} ${isInteractive ? 'cursor-pointer' : ''}`}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <Star
          key={star}
          size={size}
          className={`transition-colors duration-150 ${
            star <= displayRating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          } ${isInteractive ? 'hover:text-yellow-300 hover:fill-yellow-300' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default StarRating;