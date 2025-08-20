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
    console.log('Registration request body:', req.body);
    const { username, email, phone, password, full_name, birth_date, address } = req.body;

    // Check if user already exists
    console.log('Checking if user exists with email:', email);
    const existingUser = await User.findByEmailOrPhone(email);
    console.log('Existing user result:', existingUser);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc số điện thoại đã được sử dụng'
      });
    }

    // Check if username exists
    console.log('Checking if username exists:', username);
    const existingUsername = await User.findByUsername(username);
    console.log('Existing username result:', existingUsername);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã được sử dụng'
      });
    }

    // Create new user
    console.log('Creating user with data:', { username, email, phone, full_name });
    const userId = await User.create({
      username,
      email,
      phone,
      password,
      full_name,
      birth_date,
      address
    });
    console.log('User created with ID:', userId);

    // Get user data (without password)
    const user = await User.findById(userId);

    // Generate token
    const token = generateToken(userId);

    // Send welcome email (skip in development if email not configured)
    console.log('Attempting to send welcome email...');
    try {
      const { subject, html } = emailTemplates.welcome(username);
      const emailResult = await sendEmail(email, subject, html);
      console.log('Email result:', emailResult);
    } catch (emailError) {
      console.log('Email sending failed, but registration continues:', emailError.message);
      // Không throw error để registration vẫn tiếp tục
    }

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
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Đăng ký thất bại. Vui lòng thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'Email/Số điện thoại hoặc mật khẩu không đúng!'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email/Số điện thoại hoặc mật khẩu không đúng!'
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
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar,
          birth_date: user.birth_date,
          address: user.address
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request body:', req.body);
    const { full_name, phone, birth_date, address } = req.body;
    
    console.log('Extracted data:', { full_name, phone, birth_date, address });
    
    const success = await User.updateProfile(req.user.id, {
      full_name,
      phone,
      birth_date,
      address
    });

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật thất bại'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thành công!'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user avatar
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được upload'
      });
    }

    // Create avatar path relative to uploads directory
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    const success = await User.updateAvatar(req.user.id, avatarPath);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Cập nhật avatar thất bại'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật avatar thành công!',
      data: {
        avatar: avatarPath
      }
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update notification settings
const updateNotificationSettings = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, pushNotifications } = req.body;
    
    // For now, just return success since we don't have notification settings table
    // TODO: Implement notification settings in database
    res.json({
      success: true,
      message: 'Cập nhật cài đặt thông báo thành công!'
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByEmailOrPhone(req.user.email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await User.verifyPassword(user, currentPassword);
    if (!isValidPassword) {
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
      message: 'Server error'
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    const success = await User.createPasswordResetToken(email, resetToken, resetTokenExpires);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Không thể tạo token reset'
      });
    }

    // Send reset email
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const resetUrl = `${clientUrl}/auth/reset-password?token=${resetToken}`;
      const { subject, html } = emailTemplates.resetPassword(user.username, resetUrl);
      const emailResult = await sendEmail(email, subject, html);
      
      // If email is disabled in development, still return success
      if (emailResult.disabled) {
        console.log('Email disabled, but reset token created successfully');
        console.log('Reset URL for testing:', resetUrl);
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't return error if email is disabled
      if (process.env.EMAIL_ENABLED !== 'false') {
        return res.status(500).json({
          success: false,
          message: 'Không thể gửi email reset password'
        });
      }
    }

    res.json({
      success: true,
      message: 'Email reset password đã được gửi!'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    const success = await User.resetPassword(token, newPassword);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Reset password thất bại'
      });
    }

    res.json({
      success: true,
      message: 'Reset password thành công!'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Verify token
const verifyToken = async (req, res) => {
  try {
    // If we reach here, the token is valid (verifyToken middleware passed) and req.user is populated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Logout (client-side handles token removal)
const logout = async (req, res) => {
  try {
    // Server-side logout is stateless with JWT
    // Client should remove token from localStorage
    res.json({
      success: true,
      message: 'Đăng xuất thành công!'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateAvatar,
  updateNotificationSettings,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyToken,
  logout
};
