const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../config/email');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, phone, password, full_name, birth_date, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmailOrPhone(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc số điện thoại đã được sử dụng'
      });
    }

    // Check if username exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã được sử dụng'
      });
    }

    // Create new user
    const userId = await User.create({
      username,
      email,
      phone,
      password,
      full_name,
      birth_date,
      address
    });

    // Get user data (without password)
    const user = await User.findById(userId);

    // Generate token
    const token = generateToken(userId);

    // Send welcome email
    const { subject, html } = emailTemplates.welcome(username);
    await sendEmail(email, subject, html);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Đăng ký thất bại. Vui lòng thử lại sau.'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await User.findByEmailOrPhone(emailOrPhone);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email/số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email/số điện thoại hoặc mật khẩu không đúng'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Đăng nhập thất bại. Vui lòng thử lại sau.'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, birth_date, address } = req.body;

    const success = await User.updateProfile(req.user.id, {
      full_name,
      phone,
      birth_date,
      address
    });

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật thông tin thất bại'
      });
    }

    // Get updated user data
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Cập nhật thông tin thất bại. Vui lòng thử lại sau.'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByEmailOrPhone(req.user.email);
    
    // Verify current password
    const isCurrentPasswordValid = await User.verifyPassword(user, currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Update password
    const success = await User.changePassword(req.user.id, newPassword);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Đổi mật khẩu thất bại'
      });
    }

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Đổi mật khẩu thất bại. Vui lòng thử lại sau.'
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản với email này'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    await User.createPasswordResetToken(email, resetToken, resetTokenExpires);

    // Create reset link
    const resetLink = `${process.env.CORS_ORIGIN}/auth/reset-password?token=${resetToken}`;

    // Send reset email
    const { subject, html } = emailTemplates.resetPassword(resetLink);
    await sendEmail(email, subject, html);

    res.json({
      success: true,
      message: 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại sau.'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'
      });
    }

    // Reset password
    const success = await User.resetPassword(token, newPassword);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Đặt lại mật khẩu thất bại'
      });
    }

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Đặt lại mật khẩu thất bại. Vui lòng thử lại sau.'
    });
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công!'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout
};
