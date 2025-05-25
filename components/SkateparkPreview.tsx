// client/src/pages/skateparks/components/SkateparkPreview.tsx
import React, { useState, useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { X } from 'lucide-react';

interface PreviewImage {
  url: string;
  isFeatured?: boolean;
}

interface SkateparkPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PreviewImage[];
  parkName: string;
}

interface TransformStyle {
  transform: string;
  transition: string;
}

// Creates optimized thumbnail versions of Cloudinary images for preview
const getPreviewThumbnailUrl = (originalUrl: string, width: number = 200, quality: number = 70): string => {
  // Check if this is a Cloudinary URL
  if (originalUrl && originalUrl.includes('cloudinary.com')) {
    // Parse the URL to get the upload part
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      // Insert transformation parameters for thumbnails - use small size and lower quality
      return `${urlParts[0]}/upload/w_${width},h_${width},c_fill,q_${quality}/${urlParts[1]}`;
    }
  }
  // Return the original URL if it's not a Cloudinary URL or format is unexpected
  return originalUrl;
};

const SkateparkPreview: React.FC<SkateparkPreviewProps> = ({ 
  isOpen, 
  onClose, 
  photos, 
  parkName 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Find the featured photo index
  useEffect(() => {
    const featuredIndex = photos.findIndex(photo => photo.isFeatured);
    setActiveIndex(featuredIndex >= 0 ? featuredIndex : 0);
  }, [photos]);

  // Reset loaded images state when photos change
  useEffect(() => {
    setLoadedImages({});
  }, [photos]);

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
      setIsDragging(true);
      setDragOffset(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    // If vertical swipe is more prominent, don't interfere with page scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsDragging(false);
      return;
    }

    // Prevent default to stop page scrolling when swiping horizontally
    e.preventDefault();
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const swipeThreshold = 50; // Minimum swipe distance to change image
    
    if (dragOffset > swipeThreshold) {
      // Swipe right - go to previous image
      setActiveIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
    } else if (dragOffset < -swipeThreshold) {
      // Swipe left - go to next image
      setActiveIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  // Handle background click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === previewRef.current) {
      onClose();
    }
  };

  // Handle image load
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Calculate transition styles
  const getTransformStyle = (index: number): TransformStyle => {
    if (!isDragging) {
      // Normal positioning when not dragging
      const position = (index - activeIndex) * 100;
      return {
        transform: `translateX(${position}%)`,
        transition: 'transform 0.3s ease'
      };
    } else {
      // Apply drag offset during dragging
      const position = (index - activeIndex) * 100;
      const dragPercentage = (dragOffset / (previewRef.current?.offsetWidth || 1)) * 100;
      return {
        transform: `translateX(${position + dragPercentage}%)`,
        transition: 'none'
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={previewRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
        aria-label="Close preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white/80 text-sm z-10">
        {activeIndex + 1} / {photos.length}
      </div>

      {/* Preview Container */}
      <div 
        className="relative w-full h-64 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full"
            style={getTransformStyle(index)}
          >
            {!loadedImages[index] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
            <img
              src={getPreviewThumbnailUrl(photo.url)}
              alt={`${parkName} - preview ${index + 1}`}
              className={`w-full h-full object-contain ${loadedImages[index] ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => handleImageLoad(index)}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Preview dots */}
      <div className="flex justify-center mt-4 gap-1.5">
        {photos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === activeIndex ? 'bg-white' : 'bg-white/40'
            } transition-all duration-300`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SkateparkPreview;