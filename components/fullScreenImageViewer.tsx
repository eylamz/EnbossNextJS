// client/src/pages/skateparks/components/fullScreenImageViewer.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';


// Create inline animation styles
const animationStylesElement = (
  <style>
    {`
      @keyframes slideUpFadeIn {
        0% {
          opacity: 0;
          transform: translate(-50%, 20px);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      @keyframes fadeOut {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }

      .helper-text-animation {
        animation: slideUpFadeIn 0.5s ease-out forwards;
      }

      .helper-text-fade-out {
        animation: fadeOut 0.5s ease-out forwards;
      }
    `}
  </style>
);


interface FullscreenImageViewerProps {
  images: { url: string }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

// Creates optimized versions of Cloudinary images for thumbnails
const getOptimizedThumbnailUrl = (originalUrl: string, width: number = 100, quality: number = 80): string => {
  // Check if this is a Cloudinary URL
  if (originalUrl && originalUrl.includes('cloudinary.com')) {
    // Parse the URL to get the upload part
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      // Insert transformation parameters for thumbnails
      return `${urlParts[0]}/upload/w_${width},h_${width},c_fill,q_${quality}/${urlParts[1]}`;
    }
  }
  // Return the original URL if it's not a Cloudinary URL or format is unexpected
  return originalUrl;
};

// Creates high-quality versions of Cloudinary images for zooming
const getHighQualityImageUrl = (originalUrl: string, quality: number = 100): string => {
  if (originalUrl && originalUrl.includes('cloudinary.com')) {
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      // Insert transformation parameters for high quality
      return `${urlParts[0]}/upload/q_${quality}/${urlParts[1]}`;
    }
  }
  return originalUrl;
};

const FullscreenImageViewer = ({ 
  images, 
  initialIndex, 
  isOpen, 
  onClose 
}: FullscreenImageViewerProps) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // States for helper text animation
  const [showHelperText, setShowHelperText] = useState(false);
  const [isHelperFadingOut, setIsHelperFadingOut] = useState(false);
  
  // Add touch device detection
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Refs for gesture handling
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const mainImageWrapperRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const pinchStartDistanceRef = useRef(0);
  const startScaleRef = useRef(1);
  const touchTimeoutRef = useRef<number | null>(null);

  // Swipe handling
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const minSwipeDistance = 50;

  // Double tap handling
  const lastTapTimeRef = useRef(0);
  const lastTapPositionRef = useRef({ x: 0, y: 0 });
  const doubleTapDelay = 300; // milliseconds

  // Preload high-quality image
  const highQualityImageRef = useRef<HTMLImageElement | null>(null);

  // Double click handling
  const lastClickTimeRef = useRef(0);
  const lastClickPositionRef = useRef({ x: 0, y: 0 });
  const doubleClickDelay = 300; // milliseconds


  // Reset zoom and position
  const resetZoom = useCallback(() => {
    console.log("Resetting zoom from", scale, "to 1");
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [scale]);


  
  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
      setIsHighQualityLoaded(false);
      setImageLoading(true);
      
      // Show helper text with animation when the viewer is opened
      setShowHelperText(true);
      setIsHelperFadingOut(false);
      
      // Set a timer to start fading out the helper text after 5 seconds
      const helperTextTimer = setTimeout(() => {
        setIsHelperFadingOut(true);
        
        // After fade-out animation completes, hide the element completely
        setTimeout(() => {
          setShowHelperText(false);
        }, 500); // This should match the fadeOut animation duration
      }, 5000);
      
      // Cleanup function to clear the timer
      return () => {
        clearTimeout(helperTextTimer);
        if (touchTimeoutRef.current) {
          clearTimeout(touchTimeoutRef.current);
        }
      };
      
      // Preload high quality image
      if (images[initialIndex]) {
        const img = new Image();
        img.src = getHighQualityImageUrl(images[initialIndex].url);
        img.onload = () => {
          setIsHighQualityLoaded(true);
        };
        highQualityImageRef.current = img;
      }
    }
  }, [initialIndex, isOpen, images]);
  
  
  // Reset loading state when current index changes
  useEffect(() => {
    setImageLoading(true);
  }, [currentIndex]);

  
  // Body scroll lock effect
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling on the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Maintain scrollbar to prevent layout shift
    } else {
      // Restore scrolling and scroll position when viewer closes
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Clean up in case component unmounts while open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (scale === 1) {
            setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
            resetZoom();
          }
          break;
        case 'ArrowRight':
          if (scale === 1) {
            setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
            resetZoom();
          }
          break;
        case 'Escape':
          onClose();
          break;
        case '0':
        case 'r':
          resetZoom();
          break;
        case '+':
          handleZoom(Math.min(scale + 0.5, 4));
          break;
        case '-':
          handleZoom(Math.max(scale - 0.5, 1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose, scale, resetZoom]);

  // Change image and reset zoom
  const navigate = useCallback((direction: 'prev' | 'next', e?: React.MouseEvent) => {
    // If event exists, prevent default behavior
    if (e) {
      e.stopPropagation();
    }
    
    // Only navigate if we're not zoomed in
    if (scale > 1) return;
    
    if (direction === 'prev') {
      setCurrentIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : images.length - 1;
        // Preload high quality image for the new index
        preloadHighQualityImage(newIndex);
        return newIndex;
      });
    } else {
      setCurrentIndex(prev => {
        const newIndex = prev < images.length - 1 ? prev + 1 : 0;
        // Preload high quality image for the new index
        preloadHighQualityImage(newIndex);
        return newIndex;
      });
    }
    resetZoom();
    setImageLoading(true);
  }, [images.length, resetZoom, scale]);

  // Preload high quality image
  const preloadHighQualityImage = (index: number) => {
    setIsHighQualityLoaded(false);
    if (images[index]) {
      const img = new Image();
      img.src = getHighQualityImageUrl(images[index].url);
      img.onload = () => {
        setIsHighQualityLoaded(true);
      };
      highQualityImageRef.current = img;
    }
  };

  // Zoom handling
  const handleZoom = (newScale: number) => {
    setScale(newScale);
    
    // If zooming out all the way, reset position
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Zoom buttons
  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoom(Math.min(scale + 0.5, 4));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleZoom(Math.max(scale - 0.5, 1));
  };

  // Mobile double-tap handler
  const handleDoubleTap = (x: number, y: number) => {
    // Toggle between 1x and 2.5x zoom
    if (scale > 1) {
      resetZoom();
    } else {
      handleZoom(2.5);
      
      // Center zoom on the tap point
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        
        // Calculate tap position relative to the image center
        const offsetX = x - (rect.left + rect.width / 2);
        const offsetY = y - (rect.top + rect.height / 2);
        
        // Set position to center the zoom on the tap point
        setPosition({
          x: -offsetX * (2.5 - 1),
          y: -offsetY * (2.5 - 1)
        });
      }
    }
  };

  

  // Zoom to point (for double-click zoom)
  // const zoomToPoint = (e: React.MouseEvent) => {
  //   if (!imageContainerRef.current || !imageRef.current) return;
    
  //   const container = imageContainerRef.current;
  //   const image = imageRef.current;
    
  //   // Get container dimensions and position
  //   const rect = container.getBoundingClientRect();
    
  //   // Calculate click position relative to the image center
  //   const offsetX = (e.clientX - rect.left) - (rect.width / 2);
  //   const offsetY = (e.clientY - rect.top) - (rect.height / 2);
    
  //   // Set position to center the zoom on the click point
  //   setPosition({
  //     x: -offsetX * (2.5 - 1),
  //     y: -offsetY * (2.5 - 1)
  //   });
  // };

  // Check if a click/touch is on the main image element
  const isClickOnMainImage = (element: EventTarget): boolean => {
    if (!imageRef.current) return false;
    
    // Check if the clicked element is the image or a descendant of the image
    return element === imageRef.current || imageRef.current.contains(element as Node);
  };

  // Mouse down handler for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.stopPropagation();
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY };
      lastPositionRef.current = { ...position };
    }
  };

  // Mouse move handler for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && scale > 1) {
      e.preventDefault();
      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      
      setPosition({
        x: lastPositionRef.current.x + deltaX,
        y: lastPositionRef.current.y + deltaY
      });
    }
  };

  // Mouse up handler for panning
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Swipe handlers for image navigation
  // const handleSwipeStart = (e: React.TouchEvent) => {
  // // Only start swipe handling when not zoomed in and touching the main image
  // if (e.touches.length === 1 && scale === 1 && isClickOnMainImage(e.target)) {
  //   // Check if the touch is on the main image
  //   if (e.touches.length === 1 && scale === 1 && isClickOnMainImage(e.target)) {
  //       const touch = e.touches[0];
  //       touchStartXRef.current = touch.clientX;
  //       touchStartYRef.current = touch.clientY;
  //       setIsSwiping(true);
  //     } else {
  //       // Touch is not on the main image, don't start swiping
  //       setIsSwiping(false);
  //     }
  //   }
  // };

  const handleSwipeMove = (e: React.TouchEvent) => {
    // If we're swiping with one finger and not zoomed in
  if (isSwiping && e.touches.length === 1 && scale === 1) {
      touchEndXRef.current = e.touches[0].clientX;
    }
  };

  const handleSwipeEnd = () => {
    if (isSwiping && scale === 1) {
      const distanceX = touchEndXRef.current - touchStartXRef.current;
      const isLeftSwipe = distanceX < -minSwipeDistance;
      const isRightSwipe = distanceX > minSwipeDistance;
      
      // Only navigate if it's a significant swipe (over the minimum distance)
      // This prevents single taps from being interpreted as swipes
      if (isLeftSwipe) {
        navigate('prev'); // Swipe left to go to previous image
      } else if (isRightSwipe) {
        navigate('next'); // Swipe right to go to next image
      }
      
      setIsSwiping(false);
    }
  };
  
  

  // Touch handlers for panning and pinching
  const handleTouchStart = (e: React.TouchEvent) => {
    // For single touch - handle tap, swipe and pan
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      
      // Check if touch is on the image itself
      if (isClickOnMainImage(e.target)) {
        // Double tap detection
        const currentTime = new Date().getTime();
        const tapPosition = { x: touch.clientX, y: touch.clientY };
        
        // Calculate distance between taps to ensure they are in roughly the same spot
        const distanceBetweenTaps = Math.hypot(
          tapPosition.x - lastTapPositionRef.current.x,
          tapPosition.y - lastTapPositionRef.current.y
        );
        
        // Check if this is a double tap (time between taps is short and position is close)
        if (currentTime - lastTapTimeRef.current < doubleTapDelay && distanceBetweenTaps < 30) {
          // This is a double tap
          e.preventDefault();
          e.stopPropagation();
          
          // Execute double tap action
          handleDoubleTap(touch.clientX, touch.clientY);
          
          // Reset tracking
          lastTapTimeRef.current = 0;
          setIsSwiping(false);
        } else {
          // This is a first tap or too far from the last tap
          // Start swipe tracking only if not zoomed in
          if (scale === 1) {
            touchStartXRef.current = touch.clientX;
            touchEndXRef.current = touch.clientX; // Initialize end position to same as start
            touchStartYRef.current = touch.clientY;
            setIsSwiping(true);
          }
          
          // Update last tap time and position for next tap
          lastTapTimeRef.current = currentTime;
          lastTapPositionRef.current = tapPosition;
        }
      }
    }
    
    // Handle pinch to zoom
    if (e.touches.length === 2) {
      e.stopPropagation();
      e.preventDefault();
      setIsSwiping(false);
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate distance between pinch points
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      pinchStartDistanceRef.current = distance;
      startScaleRef.current = scale;
    }
    // Handle panning when zoomed in
    else if (e.touches.length === 1 && scale > 1) {
      e.stopPropagation();
      setIsPanning(true);
      setIsSwiping(false);
      
      panStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      lastPositionRef.current = { ...position };
    }
  };
  
  
  
  

  const handleTouchMove = (e: React.TouchEvent) => {
    // Handle swipe - allow swiping even during image loading
    if (e.touches.length === 1 && isSwiping && scale === 1) {
      touchEndXRef.current = e.touches[0].clientX;
    }
    const currentDistance = Math.abs(touchEndXRef.current - touchStartXRef.current);
    if (currentDistance > 10) { // Small threshold to confirm user is actually swiping
      // Optional: You could add visual feedback here to indicate swiping is active
    }

    
    if (isClickOnMainImage(e.target)) {
      handleSwipeMove(e);
    }
    
    // Handle pinch to zoom
    if (e.touches.length === 2) {
      // Always stop propagation and prevent default for pinch gestures
      e.stopPropagation();
      e.preventDefault();
      
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate new distance
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate new scale based on distance change
      const pinchScale = distance / pinchStartDistanceRef.current;
      let newScale = Math.max(1, Math.min(4, startScaleRef.current * pinchScale));
      
      // Update scale
      setScale(newScale);
      
      // If zooming in, adjust position to center the pinch point
      if (newScale > 1) {
        // Calculate the pinch center
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        if (imageContainerRef.current) {
          const rect = imageContainerRef.current.getBoundingClientRect();
          
          // Calculate position relative to center
          const offsetX = centerX - (rect.left + rect.width / 2);
          const offsetY = centerY - (rect.top + rect.height / 2);
          
          // Adjust position proportionally to scale change
          setPosition({
            x: -offsetX * (newScale / startScaleRef.current - 1) + lastPositionRef.current.x,
            y: -offsetY * (newScale / startScaleRef.current - 1) + lastPositionRef.current.y
          });
        }
      } else {
        // If zoomed all the way out, reset position
        setPosition({ x: 0, y: 0 });
      }
    }
    // Handle panning while zoomed
    else if (e.touches.length === 1 && isPanning && scale > 1) {
      // Prevent default behavior to avoid page scrolling while panning
      e.preventDefault();
      e.stopPropagation();
      
      const deltaX = e.touches[0].clientX - panStartRef.current.x;
      const deltaY = e.touches[0].clientY - panStartRef.current.y;
      
      setPosition({
        x: lastPositionRef.current.x + deltaX,
        y: lastPositionRef.current.y + deltaY
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Handle swipe end
    if (isClickOnMainImage(e.target)) {
      handleSwipeEnd();
    }
    
    // If one finger is still on screen and we were pinching, update pan start position
    if (e.touches.length === 1 && pinchStartDistanceRef.current > 0) {
      panStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      lastPositionRef.current = { ...position };
      pinchStartDistanceRef.current = 0;
    }
    // If no fingers on screen, end panning
    else if (e.touches.length === 0) {
      setIsPanning(false);
      pinchStartDistanceRef.current = 0;
    }
  };

  const getImageSrc = () => {
    if (!images[currentIndex]) return '';
    
    // Use high quality version if available, otherwise use regular version
    return isHighQualityLoaded && scale > 1.5
      ? getHighQualityImageUrl(images[currentIndex].url)
      : images[currentIndex].url;
  };

  // Handle image load complete
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Handle background click to close the viewer
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // If the click target is the backdrop itself (not a child element),
    // then close the viewer
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle double click zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    
    const currentTime = new Date().getTime();
    const clickPosition = { x: e.clientX, y: e.clientY };
    
    // Calculate distance between clicks to ensure they are in roughly the same spot
    const distanceBetweenClicks = Math.hypot(
      clickPosition.x - lastClickPositionRef.current.x,
      clickPosition.y - lastClickPositionRef.current.y
    );
    
    // Check if this is a double click (time between clicks is short and position is close)
    if (currentTime - lastClickTimeRef.current < doubleClickDelay && distanceBetweenClicks < 30) {
      // This is a double click
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle between 1x and 2.5x zoom
      if (scale > 1) {
        resetZoom();
      } else {
        handleZoom(2.5);
        
        // Center zoom on the click point
        const rect = imageContainerRef.current.getBoundingClientRect();
        
        // Calculate click position relative to the image center
        const offsetX = clickPosition.x - (rect.left + rect.width / 2);
        const offsetY = clickPosition.y - (rect.top + rect.height / 2);
        
        // Set position to center the zoom on the click point
        setPosition({
          x: -offsetX * (2.5 - 1),
          y: -offsetY * (2.5 - 1)
        });
      }
      
      // Reset tracking
      lastClickTimeRef.current = 0;
    } else {
      // This is a first click or too far from the last click
      lastClickTimeRef.current = currentTime;
      lastClickPositionRef.current = clickPosition;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center select-none"
      onClick={handleBackgroundClick}
    >
      {/* Include animation styles */}
      {animationStylesElement}
      
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
        aria-label="Close fullscreen view"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Image counter and zoom controls */}
      <div 
        className="absolute top-4 left-4 text-white/80 z-50 flex flex-col items-end gap-2 select-none"
        onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the viewer
      >
        {/* Zoom controls in the top row */}
        <div className="navMdShadow flex flex-row-reverse items-center justify-left gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomOut(e);
            }}
            className={`p-1 rounded-full ${scale <= 1 ? 'text-white/40 cursor-not-allowed' : 'text-white/80 hover:text-white hover:bg-white/10'} transition-colors`}
            disabled={scale <= 1}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-6 h-6" />
          </button>
          <span className="text-white/80 min-w-[2.5rem] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              zoomIn(e);
            }}
            className={`p-1 rounded-full ${scale >= 4 ? 'text-white/40 cursor-not-allowed' : 'text-white/80 hover:text-white hover:bg-white/10'} transition-colors`}
            disabled={scale >= 4}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-6 h-6" />
          </button>
          {scale > 1 && (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                resetZoom(); 
              }}
              className="ml-2 text-sm text-white/80 hover:text-white hover:underline transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        
        {/* Image counter below zoom controls */}
        <div className="navMdShadow text-white/80 text-sm pl-10">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Main content wrapper - covers the full viewport */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Interactive image container */}
        <div 
          ref={imageContainerRef}
          className="relative flex items-center justify-center w-full h-full"
          onClick={(e) => {
            // Only close if clicking directly on this container (not its children)
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Image wrapper - contains the actual image and navigation buttons */}
          <div 
            ref={mainImageWrapperRef}
            className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              touchAction: 'none',
              userSelect: 'none', 
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            {/* Main image container with loading spinner for each image */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Loading spinner - always centered on the image */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <LoadingSpinner />
                </div>
              )}
            
            {/* Main image with zoom and pan transformations */}
            <img
                ref={imageRef}
                src={getImageSrc()}
                alt={`Image ${currentIndex + 1}`}
                className={`max-h-[90vh] max-w-[90vw] object-contain rounded-xl saturate-[120%] select-none ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: scale > 1 ? 'grab' : 'pointer',
                  transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                  willChange: 'transform',
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: 'auto'
                }}
                onLoad={handleImageLoad}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick(e);
                }}
                draggable={false}
              />
            </div>
            
            {/* Helper text for zoom gestures - only on touch devices */}
            {showHelperText && (
              <div 
                className={`flex justify-center items-center fixed bottom-[6rem] left-1/2 text-white/60 text-sm bg-black/20 py-1 px-3 w-full max-w-[200px] rounded-full select-none ${isHelperFadingOut ? 'helper-text-fade-out' : 'helper-text-animation'}`}
                style={{ 
                  transform: `translateX(-50%)`,
                  backfaceVisibility: 'hidden'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {isTouchDevice ? t('common:common.tapToZoom') : t('common:common.doubleClickToZoom')}
              </div>
            )}

          </div>
          
          {/* Navigation buttons - positioned outside the image wrapper */}
          {scale === 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('next', e);
                }}
                className="absolute left-4 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('prev', e);
                }}
                className="absolute right-4 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail strip - with responsive scaling */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 p-2 bg-black/50 rounded-lg max-w-[95vw] overflow-x-auto scrollbar-none select-none z-20"
        onClick={(e) => e.stopPropagation()} // Prevent thumbnail strip clicks from closing the viewer
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          userSelect: 'none'
        }}
      >
        <div className="flex gap-1 sm:gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                resetZoom();
                preloadHighQualityImage(index);
                setImageLoading(true); // Set loading state when changing images
              }}
              className={cn(
                "flex-shrink-0 w-12 h-9 sm:w-16 sm:h-12 rounded-md overflow-hidden transition-all",
                currentIndex === index ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"
              )}
            >
              <img
                src={getOptimizedThumbnailUrl(image.url, 100, 80)}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover saturate-[125%] select-none"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullscreenImageViewer;
