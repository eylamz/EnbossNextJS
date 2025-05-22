// Предполагаемый путь: src/components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: number; // Diameter of the spinner in pixels
  strokeWidth?: number; // Thickness of the spinner line
  className?: string; // Additional classes for positioning, etc. (e.g., from Tailwind CSS)
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 48, // Default size: 48px
  strokeWidth = 4, // Default stroke width: 4px
  className = '',
}) => {
  const viewBoxSize = 50; // SVG viewBox is slightly larger to prevent clipping
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Using a style tag here for the animation keyframes.
  // In a real app, you might put this in your global CSS or a CSS module
  // if preferred, but for a self-contained component, this works.
  const animationStyles = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .animate-spin-custom {
      animation: spin 1.5s linear infinite;
    }
  `;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <style>{animationStyles}</style>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin-custom" // Apply the custom animation class
      >
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke="url(#googleGradient)" // Using a gradient for multiple colors
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75} // Start with a quarter arc
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="googleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4285F4' }} /> {/* Blue */}
            <stop offset="25%" style={{ stopColor: '#DB4437' }} /> {/* Red */}
            <stop offset="50%" style={{ stopColor: '#F4B400' }} /> {/* Yellow */}
            <stop offset="75%" style={{ stopColor: '#0F9D58' }} /> {/* Green */}
            <stop offset="100%" style={{ stopColor: '#4285F4' }} /> {/* Blue again for smooth transition */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
