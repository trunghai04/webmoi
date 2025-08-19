const Product = require('../models/Product');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

// Get all products with filters
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    const filters = {
      category_id: req.query.category_id,
      brand: req.query.brand,
      min_price: req.query.min_price,
      max_price: req.query.max_price,
      search: req.query.search,
      is_featured: req.query.is_featured === 'true',
      is_flash_sale: req.query.is_flash_sale === 'true',
      sort_by: req.query.sort_by,
      sort_order: req.query.sort_order
    };
    
    const result = await Product.getAll(page, limit, filters);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.getById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.getFeatured(limit);
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get flash sale products
const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.getFlashSale();
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get flash sale products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    const result = await Product.getByCategory(categoryId, page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Từ khóa tìm kiếm không được để trống'
      });
    }
    
    const result = await Product.search(q.trim(), page, limit);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get product brands
const getProductBrands = async (req, res) => {
  try {
    const brands = await Product.getBrands();
    
    res.json({
      success: true,
      data: { brands }
    });
  } catch (error) {
    console.error('Get product brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get price range
const getPriceRange = async (req, res) => {
  try {
    const priceRange = await Product.getPriceRange();
    
    res.json({
      success: true,
      data: { priceRange }
    });
  } catch (error) {
    console.error('Get price range error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Add product review
const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1 đến 5 sao'
      });
    }
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề đánh giá không được để trống'
      });
    }
    
    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nội dung đánh giá không được để trống'
      });
    }
    
    // Check if product exists
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    const reviewId = await Product.addReview(id, userId, {
      rating,
      title: title.trim(),
      comment: comment.trim()
    });
    
    res.status(201).json({
      success: true,
      message: 'Đánh giá sản phẩm thành công!',
      data: { reviewId }
    });
  } catch (error) {
    console.error('Add product review error:', error);
    
    if (error.message.includes('đã đánh giá')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Create product
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    const productId = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công!',
      data: { productId }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const success = await Product.update(id, productData);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await Product.delete(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công!'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Get all products for management
const getAllProductsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const filters = {
      search: req.query.search,
      category_id: req.query.category_id,
      is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined
    };
    
    const result = await Product.getAllForAdmin(page, limit, filters);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get all products for admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getFlashSaleProducts,
  getProductsByCategory,
  searchProducts,
  getProductBrands,
  getPriceRange,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsForAdmin
};
