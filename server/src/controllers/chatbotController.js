const db = require('../config/database');

// Knowledge base for chatbot
const chatbotKnowledge = {
  // Chào hỏi
  greetings: {
    patterns: ['xin chào', 'chào', 'hello', 'hi', 'hey', 'chào bạn', 'xin chào bạn'],
    responses: [
      'Xin chào! Tôi là trợ lý ảo của MuaSamViet. Tôi có thể giúp gì cho bạn?',
      'Chào bạn! Rất vui được gặp bạn tại MuaSamViet. Bạn cần hỗ trợ gì không?',
      'Xin chào! Tôi sẵn sàng hỗ trợ bạn. Bạn có câu hỏi gì về sản phẩm hoặc dịch vụ không?'
    ]
  },

  // Thông tin về website
  about: {
    patterns: ['mua sam viet là gì', 'website này bán gì', 'có gì ở đây', 'giới thiệu', 'thông tin'],
    responses: [
      'MuaSamViet là nền tảng mua sắm trực tuyến hàng đầu Việt Nam, chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý.',
      'Chúng tôi bán đa dạng sản phẩm từ điện tử, thời trang, gia dụng đến thực phẩm. Tất cả đều được kiểm định chất lượng.',
      'MuaSamViet là nơi bạn có thể tìm thấy mọi thứ cần thiết cho cuộc sống hàng ngày với dịch vụ giao hàng nhanh chóng và an toàn.'
    ]
  },

  // Đăng ký tài khoản
  register: {
    patterns: ['đăng ký', 'tạo tài khoản', 'đăng ký tài khoản', 'làm sao để đăng ký', 'cách đăng ký'],
    responses: [
      'Để đăng ký tài khoản, bạn click vào nút "Đăng ký" ở góc trên bên phải, điền đầy đủ thông tin cá nhân và xác nhận email.',
      'Bạn có thể đăng ký bằng email hoặc số điện thoại. Sau khi đăng ký thành công, bạn sẽ nhận được email xác nhận.',
      'Quá trình đăng ký rất đơn giản: điền thông tin → xác nhận email → hoàn tất. Bạn sẽ có ngay tài khoản để mua sắm!'
    ]
  },

  // Đăng nhập
  login: {
    patterns: ['đăng nhập', 'đăng nhập tài khoản', 'cách đăng nhập', 'quên mật khẩu'],
    responses: [
      'Để đăng nhập, bạn sử dụng email/số điện thoại và mật khẩu đã đăng ký. Nếu quên mật khẩu, click "Quên mật khẩu" để khôi phục.',
      'Bạn có thể đăng nhập bằng email hoặc số điện thoại. Nếu gặp vấn đề, hãy liên hệ hỗ trợ khách hàng.',
      'Đăng nhập rất dễ: nhập email/số điện thoại → nhập mật khẩu → click "Đăng nhập". Nếu quên mật khẩu, chúng tôi sẽ gửi link khôi phục.'
    ]
  },

  // Thanh toán
  payment: {
    patterns: ['thanh toán', 'cách thanh toán', 'phương thức thanh toán', 'trả tiền', 'mua hàng'],
    responses: [
      'Chúng tôi hỗ trợ nhiều phương thức thanh toán: thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử, tiền mặt khi nhận hàng.',
      'Bạn có thể thanh toán online bằng thẻ hoặc chuyển khoản, hoặc trả tiền khi nhận hàng (COD). Tất cả đều an toàn và tiện lợi.',
      'Các phương thức thanh toán: Visa/Mastercard, chuyển khoản, Momo, ZaloPay, VNPay, và tiền mặt khi nhận hàng.'
    ]
  },

  // Vận chuyển
  shipping: {
    patterns: ['vận chuyển', 'giao hàng', 'thời gian giao hàng', 'phí vận chuyển', 'shipping'],
    responses: [
      'Thời gian giao hàng: 1-3 ngày làm việc cho nội thành, 3-7 ngày cho tỉnh thành khác. Phí vận chuyển từ 15.000đ - 50.000đ tùy địa điểm.',
      'Chúng tôi giao hàng toàn quốc với thời gian 1-7 ngày. Phí vận chuyển được tính dựa trên khoảng cách và trọng lượng hàng.',
      'Giao hàng nhanh trong 24h cho nội thành, 2-5 ngày cho các tỉnh lân cận. Miễn phí vận chuyển cho đơn hàng trên 500.000đ.'
    ]
  },

  // Đổi trả
  return: {
    patterns: ['đổi trả', 'hoàn tiền', 'trả hàng', 'đổi hàng', 'bảo hành'],
    responses: [
      'Chính sách đổi trả: 30 ngày cho sản phẩm còn nguyên vẹn, 7 ngày cho điện tử. Liên hệ hotline 1900-xxxx để được hỗ trợ.',
      'Bạn có thể đổi trả hàng trong vòng 30 ngày nếu sản phẩm còn nguyên vẹn. Chúng tôi sẽ hoàn tiền hoặc đổi sản phẩm khác.',
      'Đổi trả miễn phí trong 30 ngày đầu. Sản phẩm điện tử có bảo hành chính hãng. Hotline hỗ trợ: 1900-xxxx.'
    ]
  },

  // Liên hệ
  contact: {
    patterns: ['liên hệ', 'hotline', 'số điện thoại', 'email', 'địa chỉ', 'hỗ trợ'],
    responses: [
      'Liên hệ chúng tôi: Hotline 1900-xxxx, Email: support@muasamviet.com, Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM.',
      'Hỗ trợ khách hàng: 1900-xxxx (8h-22h), Email: support@muasamviet.com. Chúng tôi luôn sẵn sàng hỗ trợ bạn!',
      'Thông tin liên hệ: Hotline 1900-xxxx, Email: support@muasamviet.com. Giờ làm việc: 8h-22h hàng ngày.'
    ]
  },

  // Giá cả
  price: {
    patterns: ['giá', 'giá cả', 'rẻ', 'đắt', 'giảm giá', 'khuyến mãi', 'sale'],
    responses: [
      'Chúng tôi cam kết giá tốt nhất thị trường với nhiều chương trình khuyến mãi và giảm giá thường xuyên.',
      'Giá cả cạnh tranh với nhiều ưu đãi: giảm giá theo mùa, mã giảm giá, tích điểm thưởng. Theo dõi website để không bỏ lỡ!',
      'MuaSamViet luôn có giá tốt với các chương trình khuyến mãi hấp dẫn. Đăng ký nhận thông báo để được ưu đãi sớm nhất.'
    ]
  },

  // Chất lượng
  quality: {
    patterns: ['chất lượng', 'hàng chính hãng', 'giả', 'thật', 'uy tín', 'chính hãng'],
    responses: [
      'Tất cả sản phẩm đều là hàng chính hãng 100%, có giấy bảo hành và chứng nhận chất lượng. Chúng tôi cam kết uy tín.',
      'MuaSamViet chỉ bán hàng chính hãng với đầy đủ giấy tờ bảo hành. Chất lượng được kiểm định nghiêm ngặt trước khi bán.',
      'Cam kết 100% hàng chính hãng với bảo hành đầy đủ. Chúng tôi có chính sách hoàn tiền nếu phát hiện hàng giả.'
    ]
  },

  // Không hiểu
  unknown: {
    patterns: [],
    responses: [
      'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về: đăng ký, thanh toán, vận chuyển, đổi trả, hoặc liên hệ hỗ trợ.',
      'Tôi chưa hiểu câu hỏi. Bạn có thể hỏi về sản phẩm, dịch vụ, hoặc liên hệ hotline 1900-xxxx để được hỗ trợ trực tiếp.',
      'Xin lỗi, tôi không hiểu. Bạn có thể hỏi về: cách mua hàng, thanh toán, vận chuyển, hoặc liên hệ nhân viên hỗ trợ.'
    ]
  }
};

// Function to find the best matching category
const findBestMatch = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  for (const [category, data] of Object.entries(chatbotKnowledge)) {
    for (const pattern of data.patterns) {
      if (message.includes(pattern)) {
        return category;
      }
    }
  }
  
  return 'unknown';
};

// Function to get random response from category
const getRandomResponse = (category) => {
  const responses = chatbotKnowledge[category].responses;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Main chatbot function
const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Tin nhắn không hợp lệ'
      });
    }

    // Find the best matching category
    const category = findBestMatch(message);
    
    // Get response
    const response = getRandomResponse(category);
    
    // Log the interaction (optional)
    try {
      await db.query(
        'INSERT INTO chatbot_interactions (user_message, bot_response, category) VALUES (?, ?, ?)',
        [message, response, category]
      );
    } catch (error) {
      console.log('Could not log chatbot interaction:', error.message);
    }

    res.json({
      success: true,
      data: {
        response,
        category,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại'
    });
  }
};

// Get chatbot statistics
const getChatbotStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_interactions,
        COUNT(DISTINCT DATE(created_at)) as active_days,
        category,
        COUNT(*) as category_count
      FROM chatbot_interactions 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY category
      ORDER BY category_count DESC
    `);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Error getting chatbot stats:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thống kê chatbot'
    });
  }
};

module.exports = {
  processMessage,
  getChatbotStats
};
