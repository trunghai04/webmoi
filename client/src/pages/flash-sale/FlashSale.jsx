import React, { useEffect, useMemo, useState, useContext } from "react";
import { FaStar, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaClock, FaBolt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import LoginPopup from "../../components/LoginPopup";

const PROVINCES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Khánh Hòa", "Quảng Ninh", "Hưng Yên"]; 
const SHIPPING_UNITS = ["Giao Nhanh", "VNPost", "Giao Hàng Tiết Kiệm", "Giao Hàng Nhanh", "J&T Express"];
const PROMO_FLAGS = [
  { key: "isDiscount", label: "Đang giảm giá" },
  { key: "inStock", label: "Hàng có sẵn" },
  { key: "wholesale", label: "Mua giá sỉ/lẻ" },
  { key: "cheap", label: "Gì cũng rẻ" },
];

// removed mock generator

const FlashSale = () => {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("relevance");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [provinceExpanded, setProvinceExpanded] = useState(false);
  const [filters, setFilters] = useState({
    provinces: new Set(),
    shipping: new Set(),
    minPrice: "",
    maxPrice: "",
    ratingAtLeast: 0,
    isDiscount: false,
    inStock: false,
    wholesale: false,
    cheap: false,
  });

  useEffect(() => {
    const fetchFlash = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/products/flash-sale`);
        const json = await res.json();
        const list = json?.data?.products || [];
        const mapped = list.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.flash_sale_price || p.price || 0),
          discountPrice: p.original_price && Number(p.original_price) > Number(p.price) ? Number(p.price) : null,
          rating: Number(p.rating || 0),
          sold: Number(p.total_reviews || 0),
          province: 'Việt Nam',
          ship: 'Giao Nhanh',
          isDiscount: !!(p.original_price && Number(p.original_price) > Number(p.price)),
          inStock: Number(p.stock || 0) > 0,
          wholesale: false,
          cheap: false,
          image: p.primary_image || '/uploads/products/default.svg',
          createdAt: new Date(p.created_at || Date.now()).getTime(),
          salesScore: Number(p.total_reviews || 0) + Number(p.rating || 0) * 100,
        }));
        setAllProducts(mapped);
      } catch (e) {
        setAllProducts([]);
      }
    };
    fetchFlash();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Flash sale ended
              clearInterval(timer);
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    let items = allProducts;
    if (filters.provinces.size > 0) {
      items = items.filter((p) => filters.provinces.has(p.province));
    }
    if (filters.shipping.size > 0) {
      items = items.filter((p) => filters.shipping.has(p.ship));
    }
    const min = Number(filters.minPrice || 0);
    const max = Number(filters.maxPrice || Infinity);
    if (min > 0 || max < Infinity) {
      items = items.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= min && price <= max;
      });
    }
    if (filters.ratingAtLeast > 0) {
      items = items.filter((p) => p.rating >= filters.ratingAtLeast);
    }
    if (filters.isDiscount) {
      items = items.filter((p) => p.isDiscount);
    }
    if (filters.inStock) {
      items = items.filter((p) => p.inStock);
    }
    if (filters.wholesale) {
      items = items.filter((p) => p.wholesale);
    }
    if (filters.cheap) {
      items = items.filter((p) => p.cheap);
    }
    return items;
  }, [allProducts, filters]);

  const pageSize = 50;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const currentPage = page;
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const toggleSet = (set, value) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    return newSet;
  };

  const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    
    const handleAddToCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        originalPrice: product.price,
        image: product.image,
        shopName: "MuaSamViet Shop",
        variant: "Phân loại hàng",
        voucher: Math.random() > 0.5,
        quantity: 1,
      });
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    };

    return (
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative">
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              FLASH SALE
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">{product.name}</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-orange-600 font-bold">₫{(product.discountPrice || product.price).toLocaleString("vi-VN")}</div>
              {product.discountPrice && (
                <div className="text-xs text-gray-400 line-through">₫{product.price.toLocaleString("vi-VN")}</div>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
              <FaStar className="text-yellow-500" />
              <span>{product.rating}</span>
              <span>•</span>
              <span>Đã bán {product.sold.toLocaleString("vi-VN")}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
              <FaMapMarkerAlt className="text-orange-500" />
              <span>{product.province}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-2 w-full bg-orange-500 text-white py-2 px-3 rounded text-sm hover:bg-orange-600 transition-colors"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="h-20 md:h-24 lg:h-32"></div>
      
      {/* Countdown Timer - Above Banner */}
      <div className="bg-orange-500 text-white h-[60px] flex items-center">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-center gap-4">
            <FaClock className="text-xl" />
            <span className="text-lg font-semibold">Kết thúc sau:</span>
            <div className="flex gap-2">
              <div className="bg-white text-orange-500 px-3 py-1 rounded-lg text-center min-w-[60px]">
                <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs">Giờ</div>
              </div>
              <div className="bg-white text-orange-500 px-3 py-1 rounded-lg text-center min-w-[60px]">
                <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs">Phút</div>
              </div>
              <div className="bg-white text-orange-500 px-3 py-1 rounded-lg text-center min-w-[60px]">
                <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs">Giây</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaBolt className="text-3xl" />
              <h1 className="text-4xl font-bold">FLASH SALE</h1>
            </div>
            <p className="text-xl mb-6">Giảm giá cực sốc - Số lượng có hạn!</p>
          </div>
        </div>
      </div>

      {/* Next Flash Sale Times */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Các khung giờ Flash Sale tiếp theo</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white border border-orange-200 rounded-lg px-4 py-2 text-center">
                <div className="text-sm text-gray-600">20:00 - 22:00</div>
                <div className="text-orange-600 font-semibold">Flash Sale Tối</div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg px-4 py-2 text-center">
                <div className="text-sm text-gray-600">08:00 - 10:00</div>
                <div className="text-orange-600 font-semibold">Flash Sale Sáng</div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg px-4 py-2 text-center">
                <div className="text-sm text-gray-600">14:00 - 16:00</div>
                <div className="text-orange-600 font-semibold">Flash Sale Chiều</div>
              </div>
              <div className="bg-white border border-orange-200 rounded-lg px-4 py-2 text-center">
                <div className="text-sm text-gray-600">00:00 - 02:00</div>
                <div className="text-orange-600 font-semibold">Flash Sale Đêm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {paged.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Pagination with arrows and smart ellipses */}
        <div className="mt-4 flex items-center justify-center gap-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded border text-sm disabled:opacity-40" aria-label="Trang trước">
            <FaChevronLeft />
          </button>
          {(() => {
            const buttons = [];
            const maxButtons = 7; // show up to 7 numbers
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(pageCount, start + maxButtons - 1);
            if (end - start < maxButtons - 1) {
              start = Math.max(1, end - maxButtons + 1);
            }
            if (start > 1) {
              buttons.push(
                <button key={1} onClick={() => setPage(1)} className={`px-3 py-1.5 rounded border text-sm ${currentPage === 1 ? "bg-orange-500 text-white border-orange-500" : "bg-white"}`}>1</button>
              );
              if (start > 2) buttons.push(<span key="l-ell" className="px-2 text-sm">...</span>);
            }
            for (let i = start; i <= end; i += 1) {
              buttons.push(
                <button key={i} onClick={() => setPage(i)} className={`px-3 py-1.5 rounded border text-sm ${currentPage === i ? "bg-orange-500 text-white border-orange-500" : "bg-white"}`}>{i}</button>
              );
            }
            if (end < pageCount) {
              if (end < pageCount - 1) buttons.push(<span key="r-ell" className="px-2 text-sm">...</span>);
              buttons.push(
                <button key={pageCount} onClick={() => setPage(pageCount)} className={`px-3 py-1.5 rounded border text-sm ${currentPage === pageCount ? "bg-orange-500 text-white border-orange-500" : "bg-white"}`}>{pageCount}</button>
              );
            }
            return buttons;
          })()}
          <button disabled={currentPage === pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-3 py-1.5 rounded border text-sm disabled:opacity-40" aria-label="Trang sau">
            <FaChevronRight />
          </button>
        </div>
      </div>

      <FloatingActions />
      <Footer />

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)} 
      />
    </>
  );
};

export default FlashSale;
