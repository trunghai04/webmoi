// Image utility functions for handling missing images and placeholders

/**
 * Get a placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display on placeholder
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (width = 80, height = 80, text = 'No Image') => {
  const params = new URLSearchParams({
    text: encodeURIComponent(text),
    bg: 'f0f0f0',
    color: '666666'
  });
  return `/api/placeholder/${width}/${height}?${params}`;
};

/**
 * Get a fallback image URL for products
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Fallback image URL
 */
export const getProductImage = (imageUrl, width = 300, height = 300) => {
  if (!imageUrl || imageUrl === '/uploads/products/default.svg') {
    return getPlaceholderImage(width, height, 'Product');
  }
  
  // Check if the image URL is relative and starts with /uploads
  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl;
  }
  
  // If it's an external URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Fallback to placeholder
  return getPlaceholderImage(width, height, 'Product');
};

/**
 * Get a fallback image URL for user avatars
 * @param {string} avatarUrl - Original avatar URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Fallback image URL
 */
export const getAvatarImage = (avatarUrl, width = 80, height = 80) => {
  if (!avatarUrl || avatarUrl === '/uploads/avatars/default-avatar.svg') {
    return getPlaceholderImage(width, height, 'User');
  }
  
  // Check if the avatar URL is relative and starts with /uploads
  if (avatarUrl.startsWith('/uploads/')) {
    return avatarUrl;
  }
  
  // If it's an external URL, return as is
  if (avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  
  // Fallback to placeholder
  return getPlaceholderImage(width, height, 'User');
};

/**
 * Handle image error by setting a fallback
 * @param {Event} event - Image error event
 * @param {string} fallbackUrl - Fallback image URL
 */
export const handleImageError = (event, fallbackUrl) => {
  event.target.src = fallbackUrl;
  event.target.onerror = null; // Prevent infinite loop
};
