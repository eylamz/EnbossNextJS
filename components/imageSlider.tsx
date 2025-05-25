// client/pages/skateparks/components/imageSlider.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import FullscreenImageViewer from './fullScreenImageViewer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ImageSliderProps {
  images: { url: string; isFeatured?: boolean }[];
  className?: string;
}

// Creates optimized versions of Cloudinary images
const getOptimizedImageUrl = (originalUrl: string, width: number = 600, quality: number = 90): string => {
  // Check if this is a Cloudinary URL
  if (originalUrl && originalUrl.includes('cloudinary.com')) {
    // Parse the URL to get the upload part
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      // Insert transformation parameters with higher quality
      return `${urlParts[0]}/upload/w_${width},q_${quality},c_fill/${urlParts[1]}`;
    }
  }
  // Return the original URL if it's not a Cloudinary URL or format is unexpected
  return originalUrl;
};

// Create a memoized image component to handle loading state
const OptimizedImage = React.memo(({ 
  url, 
  index, 
  onClick 
}: { 
  url: string; 
  index: number; 
  onClick: (index: number, e: React.MouseEvent) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative w-full h-full">
      {/* Loading spinner shown until image is loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bakdrop-blur-lg bg-background/75 dark:bg-background-dark/75">
          <LoadingSpinner />
        </div>
      )}
      <img
        src={getOptimizedImageUrl(url, 600, 90)}
        alt={`Image ${index + 1}`}
        className={`w-full h-full object-cover select-none transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        draggable={false}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onClick={(e) => onClick(index, e)}
      />
    </div>
  );
});

const ImageSlider = ({ images }: ImageSliderProps) => {
  // State for tracking slider position and interaction
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [showRightButton, setShowRightButton] = useState(false); // Hide right button initially
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchStartTime = useRef(0);
  const touchEndTime = useRef(0);
  const touchMoved = useRef(false);
  
  // Check if device is touch-capable on mount
  useEffect(() => {
    const isTouchCapable = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          (navigator as any).msMaxTouchPoints > 0;
    setIsTouchDevice(isTouchCapable);
  }, []);
  
  // Effect to initially scroll to the right when component mounts
  useEffect(() => {
    if (sliderRef.current) {
      // Wait for images to load before scrolling
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.scrollLeft = 0; // In RTL, 0 puts us at the right side
        }
      }, 100);
    }
  }, [images]);
  
  // Add scroll event listener to detect manual scrolling
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Handler function to check scroll position and show the right button
    const handleScroll = () => {
      if (slider.scrollLeft !== 0 && !showRightButton) {
        setShowRightButton(true);
      }
    };

    // Add the scroll event listener
    slider.addEventListener('scroll', handleScroll);
    
    // Clean up the listener when component unmounts
    return () => {
      slider.removeEventListener('scroll', handleScroll);
    };
  }, [showRightButton]);
  
  // Function to check if we're at the beginning or end of scroll
  const checkScrollPosition = () => {
    if (!sliderRef.current) return { isAtStart: false, isAtEnd: true };
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    // In RTL, scrollLeft is negative as you scroll right
    // 0 means all the way to the right, -maxScroll means all the way to the left
    return {
      isAtStart: Math.abs(scrollLeft) <= 10, // Threshold for start position (right side in RTL)
      isAtEnd: Math.abs(scrollLeft) >= maxScroll - 10, // Threshold for end position (left side in RTL)
    };
  };

  // Mouse event handlers - Only for desktop
  const handleMouseDown = (_e: React.MouseEvent) => {
    if (isTouchDevice) return; // Skip on touch devices
    isDragging.current = true;
    startX.current = _e.pageX;
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (_e: React.MouseEvent) => {
    if (!isDragging.current || isTouchDevice) return; // Skip on touch devices
    _e.preventDefault();
    if (!sliderRef.current) return;
    
    const x = _e.pageX;
    const walk = (startX.current - x) * 0.5;
    sliderRef.current.scrollLeft = scrollLeft.current + walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch event handlers
  const handleTouchStart = (_e: React.TouchEvent) => {
    touchStartTime.current = Date.now();
    touchMoved.current = false;
    startX.current = _e.touches[0].pageX;
    // We don't need to set isDragging for touch events
    // Let the browser handle natural scrolling
  };

  const handleTouchMove = (_e: React.TouchEvent) => {
    touchMoved.current = true;
    // Don't manually control scroll for touch - let browser handle it natively
  };

  const handleTouchEnd = (_e: React.TouchEvent) => {
    touchEndTime.current = Date.now();
    // Used for detecting tap vs. scroll
  };

  // Image click handler - We need to determine if it was a tap or a scroll
  const handleImageClick = (index: number, _e: React.MouseEvent) => {
    // For desktop, check if we were dragging
    if (!isTouchDevice && isDragging.current) {
      return; // Was dragging, don't open fullscreen
    }
    
    // For mobile, we'll use the fact that touchMoved is set in handleTouchMove
    if (isTouchDevice && touchMoved.current) {
      return; // Was scrolling, don't open fullscreen
    }
    
    // It was a genuine click/tap, open the fullscreen viewer
    setSelectedImageIndex(index);
    setIsFullscreenOpen(true);
  };

  // Scroll function with bounce animation (adjusted for RTL)
  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const { isAtStart, isAtEnd } = checkScrollPosition();
  
    // Show right button after left button is clicked at least once
    if (direction === 'right' && !showRightButton) {
      setShowRightButton(true);
    }
    
    // If trying to scroll right at the beginning or left at the end, show bounce animation
    if ((direction === 'right' && isAtEnd) || (direction === 'left' && isAtStart)) {
      // Play bounce animation
      setAnimationDirection(direction);
      setIsAnimating(true);
      
      // Reset animation after it completes
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 400); // Match CSS animation duration
      
      return;
    }
    
    // Normal scroll behavior (for RTL)
    const amount = 300;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? amount : -amount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full relative" style={{ direction: 'rtl' }}>
      <div className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden">
        <div className="container w-fit max-w-[100vw] mx-auto relative">
          {/* Slider container with bounce animation classes */}
          <div 
            ref={sliderRef}
            className={cn(
                "flex gap-4 overflow-x-auto scroll-smooth py-4 lg:-mx-2 pl-7 pr-4",
                "scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]",
                "[&::-webkit-scrollbar]:hidden",
                "relative saturate-[125%] w-full lg:max-w-[100vw]",
                "select-none",
                isTouchDevice ? "overflow-x-scroll" : "", // Explicitly enable scrolling on touch devices
                isAnimating && animationDirection === 'left' && "animate-bounce-left",
                isAnimating && animationDirection === 'right' && "animate-bounce-right"
              )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ userSelect: 'none' }} // Prevent images from being selected in mobile selection
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-[266px] h-[175px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 border-white dark:border-border-dark hover:scale-[1.02] hover:saturate-150 shadow-image hover:shadow-imageHover dark:shadow-imageDark dark:hover:shadow-imageDarkHover"
                style={{
                  background: 'rgba(0,0,0,0.05)', // Light background to ensure visibility
                  willChange: 'transform', // Hint to browser that this element will change
                }}
              >
                <OptimizedImage 
                  url={image.url} 
                  index={index} 
                  onClick={handleImageClick}
                />
              </div>
            ))}
          </div>

          {/* Navigation buttons - conditionally shown based on device type */}
          {(!isTouchDevice || window.innerWidth > 768) && (
            <>
              {/* Left navigation button (visual right in RTL) - always visible */}
              <button
                onClick={() => scroll('right')}
                className="absolute top-1/2 -translate-y-1/2 left-12 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center text-white backdrop-blur-sm z-10 shadow-imageDarkHvover dark:shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Right navigation button (visual left in RTL) - only visible after left button is clicked */}
              {showRightButton && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute top-1/2 -translate-y-1/2 right-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center text-white backdrop-blur-sm z-10 shadow-imageDarkHvover dark:shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <FullscreenImageViewer
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </div>
  );
};

export default ImageSlider;