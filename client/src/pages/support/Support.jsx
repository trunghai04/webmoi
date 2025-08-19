import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaHeadset, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChevronDown, 
  FaChevronUp,
  FaWhatsapp,
  FaFacebook,
  FaComment
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";

const Support = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Làm thế nào để đặt hàng?",
      answer: "Bạn có thể đặt hàng bằng cách: 1) Chọn sản phẩm từ trang chủ hoặc trang sản phẩm, 2) Thêm vào giỏ hàng, 3) Kiểm tra giỏ hàng và thanh toán, 4) Điền thông tin giao hàng và chọn phương thức thanh toán."
    },
    {
      question: "Thời gian giao hàng là bao lâu?",
      answer: "Thời gian giao hàng phụ thuộc vào địa chỉ giao hàng: - Nội thành Hà Nội, TP.HCM: 1-2 ngày làm việc - Các tỉnh lân cận: 2-3 ngày làm việc - Các tỉnh khác: 3-5 ngày làm việc"
    },
    {
      question: "Có thể đổi trả sản phẩm không?",
      answer: "Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ phụ kiện đi kèm."
    },
    {
      question: "Các phương thức thanh toán nào được chấp nhận?",
      answer: "Chúng tôi chấp nhận các phương thức thanh toán: - Tiền mặt khi nhận hàng (COD) - Chuyển khoản ngân hàng - Thẻ tín dụng/ghi nợ - Ví điện tử (MoMo, ZaloPay, VNPay)"
    },
    {
      question: "Làm sao để theo dõi đơn hàng?",
      answer: "Bạn có thể theo dõi đơn hàng bằng cách: 1) Đăng nhập vào tài khoản, 2) Vào mục 'Đơn mua', 3) Chọn đơn hàng cần theo dõi, 4) Xem trạng thái và thông tin vận chuyển."
    },
    {
      question: "Có hỗ trợ giao hàng quốc tế không?",
      answer: "Hiện tại chúng tôi chỉ hỗ trợ giao hàng trong phạm vi Việt Nam. Chúng tôi đang phát triển dịch vụ giao hàng quốc tế và sẽ thông báo khi có sẵn."
    }
  ];

  const contactInfo = [
    {
      icon: FaPhone,
      title: "Hotline",
      value: "1900 1234",
      description: "Hỗ trợ 24/7",
      color: "text-blue-600"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      value: "support@muasamviet.com",
      description: "Phản hồi trong 24h",
      color: "text-green-600"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Văn phòng",
      value: "123 Đường ABC, Quận 1, TP.HCM",
      description: "Thứ 2 - Thứ 6: 8:00 - 18:00",
      color: "text-red-600"
    },
    {
      icon: FaClock,
      title: "Giờ làm việc",
      value: "8:00 - 22:00",
      description: "Tất cả các ngày trong tuần",
      color: "text-purple-600"
    }
  ];

  const socialMedia = [
    {
      icon: FaWhatsapp,
      name: "WhatsApp",
      value: "+84 123 456 789",
      color: "bg-green-500",
      link: "https://wa.me/84123456789"
    },
    {
      icon: FaFacebook,
      name: "Facebook",
      value: "MuaSamViet",
      color: "bg-blue-600",
      link: "https://facebook.com/muasamviet"
    },
    {
      icon: FaComment,
      name: "Zalo",
      value: "MuaSamViet",
      color: "bg-blue-500",
      link: "https://zalo.me/muasamviet"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFixed={true}
        hideSearch={true}
        hideLogoShrink={true}
        hideTopNav={true}
      />

      <div className="h-20 md:h-24 lg:h-32"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaHeadset className="text-6xl text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trung tâm hỗ trợ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi nếu bạn cần bất kỳ sự trợ giúp nào.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((contact, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <contact.icon className={`text-3xl mx-auto mb-4 ${contact.color}`} />
              <h3 className="font-semibold text-gray-800 mb-2">{contact.title}</h3>
              <p className="text-lg font-medium text-gray-900 mb-1">{contact.value}</p>
              <p className="text-sm text-gray-600">{contact.description}</p>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Kết nối với chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${social.color} flex items-center justify-center`}>
                  <social.icon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{social.name}</h3>
                  <p className="text-gray-600">{social.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {openFaq === index ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Cần hỗ trợ ngay?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Liên hệ với chúng tôi qua các kênh sau
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:19001234"
              className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gọi ngay: 1900 1234
            </a>
            <Link
              to="/feedback"
              className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Gửi phản hồi
            </Link>
          </div>
        </div>
      </div>

      <FloatingActions />
      <Footer />
    </div>
  );
};

export default Support;
