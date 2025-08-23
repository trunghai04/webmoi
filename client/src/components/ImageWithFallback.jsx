import React from 'react';
import { getPlaceholderImage, handleImageError } from '../utils/imageUtils';

/**
 * Create an image component with error handling
 * @param {Object} props - Image props
 * @returns {JSX.Element} Image component with error handling
 */
const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  width = 80, 
  height = 80, 
  fallbackText = 'Image',
  ...props 
}) => {
  const fallbackUrl = getPlaceholderImage(width, height, fallbackText);
  
  const handleError = (event) => {
    handleImageError(event, fallbackUrl);
  };
  
  return (
    <img
      src={src || fallbackUrl}
      alt={alt || fallbackText}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
