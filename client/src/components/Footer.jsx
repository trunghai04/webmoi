import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 py-8 mt-12">
            <div className="max-w-[1592px] mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Về MuaSamViet</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-orange-500 transition-colors">Giới thiệu</Link></li>
                            <li><Link to="/careers" className="hover:text-orange-500 transition-colors">Tuyển dụng</Link></li>
                            <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Điều khoản</Link></li>
                            <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Dành cho người mua</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/guide" className="hover:text-orange-500 transition-colors">Hướng dẫn mua hàng</Link></li>
                            <li><Link to="/return" className="hover:text-orange-500 transition-colors">Trả hàng & Hoàn tiền</Link></li>
                            <li><Link to="/faq" className="hover:text-orange-500 transition-colors">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Chăm sóc khách hàng</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Thanh toán & Vận chuyển</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/payment" className="hover:text-orange-500 transition-colors">Phương thức thanh toán</Link></li>
                            <li><Link to="/shipping" className="hover:text-orange-500 transition-colors">Phí vận chuyển</Link></li>
                            <li><Link to="/tracking" className="hover:text-orange-500 transition-colors">Theo dõi đơn hàng</Link></li>
                            <li><Link to="/shipping-policy" className="hover:text-orange-500 transition-colors">Chính sách vận chuyển</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Liên hệ</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="tel:19001234" className="hover:text-orange-500 transition-colors">Hotline: 1900 1234</a></li>
                            <li><a href="mailto:support@muasamviet.com" className="hover:text-orange-500 transition-colors">Email: support@muasamviet.com</a></li>
                            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Địa chỉ: Hà Nội, Việt Nam</Link></li>
                            <li className="flex space-x-4 mt-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors"><FaFacebook /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors"><FaInstagram /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors"><FaTwitter /></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t pt-6 text-sm text-center">
                    © {new Date().getFullYear()} MuaSamViet. Tất cả các quyền được bảo lưu.
                </div>
            </div>
        </footer>
    )
}