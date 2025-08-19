const nodemailer = require('nodemailer');
require('dotenv').config();

// Email feature toggle and configuration presence
const emailEnabled = String(process.env.EMAIL_ENABLED || '').toLowerCase() !== 'false';
const emailConfigured = !!(process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS);

// Create transporter only when enabled and configured
let transporter = null;
if (emailEnabled && emailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // auto secure by port
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Verify email configuration
const verifyEmailConfig = async () => {
  if (!emailEnabled) {
    console.log('📧 Email disabled by EMAIL_ENABLED=false');
    return false;
  }
  if (!transporter) {
    console.log('📧 Email not configured (missing env vars). Skipping verification.');
    return false;
  }
  try {
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
    return false;
  }
};

// Send email function
const sendEmail = async (to, subject, html, text = '') => {
  if (!emailEnabled) {
    // No-op success in disabled mode to avoid breaking flows in dev
    console.log('📧 Email disabled. Pretending to send:', { to, subject });
    return { success: true, disabled: true };
  }
  if (!transporter) {
    console.warn('📧 Email not configured. Skipping send.');
    return { success: false, error: 'Email not configured' };
  }
  try {
    const mailOptions = {
      from: `"MuaSamViet" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  welcome: (username) => ({
    subject: 'Chào mừng bạn đến với MuaSamViet!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Chào mừng bạn đến với MuaSamViet!</h2>
        <p>Xin chào ${username},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại MuaSamViet. Chúng tôi rất vui mừng được chào đón bạn!</p>
        <p>Bạn có thể bắt đầu mua sắm ngay bây giờ tại <a href="http://localhost:3000">MuaSamViet.com</a></p>
        <p>Trân trọng,<br>Đội ngũ MuaSamViet</p>
      </div>
    `
  }),

  resetPassword: (resetLink) => ({
    subject: 'Đặt lại mật khẩu - MuaSamViet',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản MuaSamViet.</p>
        <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetLink}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
        <p>Link này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Đội ngũ MuaSamViet</p>
      </div>
    `
  }),

  orderConfirmation: (orderNumber, total) => ({
    subject: `Xác nhận đơn hàng #${orderNumber} - MuaSamViet`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Xác nhận đơn hàng</h2>
        <p>Cảm ơn bạn đã đặt hàng tại MuaSamViet!</p>
        <p><strong>Mã đơn hàng:</strong> #${orderNumber}</p>
        <p><strong>Tổng tiền:</strong> ${total.toLocaleString('vi-VN')} VNĐ</p>
        <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
        <p>Bạn có thể theo dõi đơn hàng tại <a href="http://localhost:3000/user/orders">tài khoản của bạn</a></p>
        <p>Trân trọng,<br>Đội ngũ MuaSamViet</p>
      </div>
    `
  })
};

module.exports = {
  transporter,
  verifyEmailConfig,
  sendEmail,
  emailTemplates
};
