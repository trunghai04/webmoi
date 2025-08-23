const express = require('express');
const router = express.Router();

// Placeholder image generator endpoint
router.get('/:width/:height', (req, res) => {
  const { width = 80, height = 80 } = req.params;
  const { text = 'No Image', bg = 'f0f0f0', color = '666666' } = req.query;
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bg}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="12" 
            fill="#${color}" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.send(svg);
});

module.exports = router;
