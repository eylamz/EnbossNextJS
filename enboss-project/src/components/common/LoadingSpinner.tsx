// Предполагаемый путь: src/components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: number; // Diameter of the spinner in pixels
  strokeWidth?: number; // Thickness of the spinner line
  className?: string; // Additional classes for positioning, etc. (e.g., from Tailwind CSS)
  variant?: 'default' | 'black' | 'error' | 'info' | 'header'; // Color variant
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 48, // Default size: 48px
  strokeWidth = 4, // Default stroke width: 4px
  className = '',
  variant = 'default',
}) => {
  const viewBoxSize = 50; // SVG viewBox is slightly larger to prevent clipping
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getGradientId = () => {
    switch (variant) {
      case 'black':
        return 'blackGradient';
      case 'error':
        return 'errorGradient';
      case 'info':
        return 'infoGradient';
      case 'header':
        return 'headerGradient';
      default:
        return 'googleGradient';
    }
  };

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
          stroke={`url(#${getGradientId()})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75} // Start with a quarter arc
          strokeLinecap="round"
        />
        <defs>
          {/* Default gradient */}
          <linearGradient id="googleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'red' }} /> {/* Blue */}
            <stop offset="25%" style={{ stopColor: 'blue' }} /> {/* Red */}
            <stop offset="50%" style={{ stopColor: 'green' }} /> {/* Yellow */}
            <stop offset="75%" style={{ stopColor: '#326111' }} /> {/* Green */}
            <stop offset="100%" style={{ stopColor: '#6bff00' }} /> {/* Blue again for smooth transition */}
          </linearGradient>

          {/* Black gradient */}
          <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#000000' }} />
            <stop offset="50%" style={{ stopColor: '#333333' }} />
            <stop offset="100%" style={{ stopColor: '#000000' }} />
          </linearGradient>

          {/* Error gradient */}
          <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#DC2626' }} /> {/* Red-600 */}
            <stop offset="50%" style={{ stopColor: '#EF4444' }} /> {/* Red-500 */}
            <stop offset="100%" style={{ stopColor: '#DC2626' }} /> {/* Red-600 */}
          </linearGradient>

          {/* Info gradient */}
          <linearGradient id="infoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0284C7' }} /> {/* Sky-600 */}
            <stop offset="50%" style={{ stopColor: '#0EA5E9' }} /> {/* Sky-500 */}
            <stop offset="100%" style={{ stopColor: '#0284C7' }} /> {/* Sky-600 */}
          </linearGradient>

          {/* Header gradient */}
          <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1F2937' }} /> {/* Gray-800 */}
            <stop offset="50%" style={{ stopColor: '#374151' }} /> {/* Gray-700 */}
            <stop offset="100%" style={{ stopColor: '#1F2937' }} /> {/* Gray-800 */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
