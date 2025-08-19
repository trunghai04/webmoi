const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await Cart.getByUserId(userId);
    const cartCount = await Cart.getCartCount(userId);
    const cartTotal = await Cart.getCartTotal(userId);
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        count: cartCount,
        total: cartTotal
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;
    
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'ID sản phẩm không được để trống'
      });
    }
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }
    
    const cartItemId = await Cart.addItem(userId, product_id, quantity);
    
    // Get updated cart info
    const cartCount = await Cart.getCartCount(userId);
    const cartTotal = await Cart.getCartTotal(userId);
    
    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm vào giỏ hàng thành công!',
      data: {
        cartItemId,
        count: cartCount,
        total: cartTotal
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error.message.includes('không tồn tại') || error.message.includes('không đủ')) {
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

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng không được âm'
      });
    }
    
    const success = await Cart.updateQuantity(userId, product_id, quantity);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }
    
    // Get updated cart info
    const cartItems = await Cart.getByUserId(userId);
    const cartCount = await Cart.getCartCount(userId);
    const cartTotal = await Cart.getCartTotal(userId);
    
    res.json({
      success: true,
      message: 'Cập nhật giỏ hàng thành công!',
      data: {
        items: cartItems,
        count: cartCount,
        total: cartTotal
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    
    if (error.message.includes('không tồn tại') || error.message.includes('không đủ')) {
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

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.params;
    
    const success = await Cart.removeItem(userId, product_id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }
    
    // Get updated cart info
    const cartItems = await Cart.getByUserId(userId);
    const cartCount = await Cart.getCartCount(userId);
    const cartTotal = await Cart.getCartTotal(userId);
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
      data: {
        items: cartItems,
        count: cartCount,
        total: cartTotal
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const success = await Cart.clearCart(userId);
    
    res.json({
      success: true,
      message: 'Xóa giỏ hàng thành công!',
      data: {
        items: [],
        count: 0,
        total: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Validate cart
const validateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const issues = await Cart.validateCart(userId);
    
    res.json({
      success: true,
      data: { issues }
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get cart count (for header)
const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Cart.getCartCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  getCartCount
};
