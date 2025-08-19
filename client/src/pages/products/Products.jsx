import React, { useEffect, useMemo, useState, useContext } from "react";
import { FaStar, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import FloatingActions from "../../components/FloatingActions";
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

// removed mock data generator

const Products = () => {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("relevance"); // relevance | newest | best | priceAsc | priceDesc
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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
    const fetchProducts = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/products?page=1&limit=200`);
        if (res.ok) {
          const json = await res.json();
          const list = json?.data?.products || [];
          const mapped = list.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price || 0),
            discountPrice: p.original_price && Number(p.original_price) > Number(p.price) ? Number(p.price) : null,
            rating: Number(p.rating || 0),
            sold: Number(p.total_reviews || 0),
            province: 'Việt Nam',
            ship: 'Giao Nhanh',
            isDiscount: p.original_price && Number(p.original_price) > Number(p.price),
            inStock: Number(p.stock || 0) > 0,
            wholesale: false,
            cheap: false,
            image: p.primary_image || '/uploads/products/default.svg',
            createdAt: new Date(p.created_at || Date.now()).getTime(),
            salesScore: Number(p.total_reviews || 0) + Number(p.rating || 0) * 100,
          }));
          setAllProducts(mapped);
        } else {
          setAllProducts([]);
        }
      } catch (e) {
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    const max = Number(filters.maxPrice || Number.MAX_SAFE_INTEGER);
    items = items.filter((p) => p.price >= min && p.price <= max);
    if (filters.ratingAtLeast > 0) items = items.filter((p) => p.rating >= filters.ratingAtLeast);
    for (const f of PROMO_FLAGS) {
      if (filters[f.key]) items = items.filter((p) => p[f.key]);
    }

    switch (sort) {
      case "newest":
        items = [...items].sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "best":
        items = [...items].sort((a, b) => b.salesScore - a.salesScore);
        break;
      case "priceAsc":
        items = [...items].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "priceDesc":
        items = [...items].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      default:
        break;
    }
    return items;
  }, [allProducts, filters, sort]);

  const pageSize = 50;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  useEffect(() => {
    // reset to first page when filters/sort change
    setPage(1);
  }, [filters, sort]);

  const toggleSet = (setObj, value) => {
    const next = new Set(Array.from(setObj));
    if (next.has(value)) next.delete(value); else next.add(value);
    return next;
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
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
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
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <div className="flex gap-3 items-start">
        {/* Left filters */}
        <aside className="w-64 hidden lg:block">
          <div className="bg-white rounded-lg border shadow-sm p-3 space-y-4">
            {/* Where (province) */}
            <div>
              <div className="font-semibold text-gray-800 mb-2">Nơi bán</div>
              <div className="space-y-1">
                {(provinceExpanded ? PROVINCES : PROVINCES.slice(0, 5)).map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.provinces.has(p)}
                      onChange={() => setFilters((f) => ({ ...f, provinces: toggleSet(f.provinces, p) }))}
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
              <button className="mt-2 text-xs text-orange-600 hover:text-orange-700" onClick={() => setProvinceExpanded((v) => !v)}>
                {provinceExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>

            {/* Shipping units */}
            <div>
              <div className="font-semibold text-gray-800 mb-2">Đơn vị vận chuyển</div>
              <div className="space-y-1">
                {SHIPPING_UNITS.map((u) => (
                  <label key={u} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={filters.shipping.has(u)}
                      onChange={() => setFilters((f) => ({ ...f, shipping: toggleSet(f.shipping, u) }))}
                    />
                    <span>{u}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="font-semibold text-gray-800 mb-2">Giá</div>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Từ" className="w-24 border rounded px-2 py-1 text-sm" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))} />
                <span className="text-gray-500">-</span>
                <input type="number" placeholder="Đến" className="w-24 border rounded px-2 py-1 text-sm" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))} />
              </div>
            </div>

            {/* Rating */}
            <div>
              <div className="font-semibold text-gray-800 mb-2">Đánh giá</div>
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                {[5, 4, 3].map((r) => (
                  <label key={r} className="inline-flex items-center gap-2">
                    <input type="radio" name="ratingAtLeast" checked={filters.ratingAtLeast === r} onChange={() => setFilters((f) => ({ ...f, ratingAtLeast: r }))} />
                    <span>Từ {r} sao</span>
                  </label>
                ))}
                <button className="text-xs text-orange-600 w-max" onClick={() => setFilters((f) => ({ ...f, ratingAtLeast: 0 }))}>Xóa lọc</button>
              </div>
            </div>

            {/* Promotions */}
            <div>
              <div className="font-semibold text-gray-800 mb-2">Dịch vụ khuyến mại</div>
              <div className="space-y-1">
                {PROMO_FLAGS.map((pf) => (
                  <label key={pf.key} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={!!filters[pf.key]} onChange={(e) => setFilters((f) => ({ ...f, [pf.key]: e.target.checked }))} />
                    <span>{pf.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right list */}
        <main className="flex-1">
          {/* Sort bar aligned with first product column */}
          <div className="bg-white rounded-lg border shadow-sm p-2 md:p-3 mb-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Sắp xếp theo:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "relevance", label: "Liên quan" },
                { key: "newest", label: "Mới nhất" },
                { key: "best", label: "Bán chạy" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${sort === s.key ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                >
                  {s.label}
                </button>
              ))}
              <div className="ml-2 flex items-center gap-1">
                <button onClick={() => setSort("priceAsc")} className={`px-3 py-1.5 rounded-full text-sm border ${sort === "priceAsc" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>Giá ↑</button>
                <button onClick={() => setSort("priceDesc")} className={`px-3 py-1.5 rounded-full text-sm border ${sort === "priceDesc" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>Giá ↓</button>
              </div>
            </div>
          </div>
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
        </main>
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

export default Products;


