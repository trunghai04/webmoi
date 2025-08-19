import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBolt } from "react-icons/fa";

const FlashSale = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlash = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/products/flash-sale?limit=12`);
        if (res.ok) {
          const json = await res.json();
          const products = json?.data?.products || [];
          setItems(products.map(p => ({
            id: p.id,
            title: p.name,
            price: Number(p.flash_sale_price || p.price || 0),
            image: p.primary_image || '/uploads/products/default.svg'
          })));
        } else {
          setItems([]);
        }
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlash();
  }, []);

  return (
    <section className="bg-orange-50 rounded-lg shadow-sm p-4 md:p-6 mb-6 border border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaBolt className="text-orange-500" />
          <h2 className="text-lg md:text-xl font-semibold text-orange-600">Flash Sale</h2>
          <div className="ml-2 flex items-center gap-1 text-[10px] md:text-xs font-semibold text-orange-700 bg-orange-100 rounded-full px-2 py-1">
            <span>02</span>
            <span>:</span>
            <span>50</span>
            <span>:</span>
            <span>40</span>
          </div>
        </div>
        <Link to="/flash-sale" className="text-orange-600 hover:text-orange-700 text-sm">Xem tất cả →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {loading ? (
          <div className="col-span-6 text-center text-gray-500 py-6">Đang tải flash sale...</div>
        ) : items.length === 0 ? (
          <div className="col-span-6 text-center text-gray-500 py-6">Chưa có sản phẩm flash sale</div>
        ) : items.slice(0, 6).map((item) => (
          <Link key={item.id} to={`/product/${item.id}`} className="block">
            <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <img src={item.image} alt={item.title} className="w-full aspect-square object-cover rounded-t-lg" onError={(e) => { e.currentTarget.src = '/uploads/products/default.svg'; }} />
              <div className="p-3">
                <div className="text-orange-600 font-bold text-lg">₫{item.price.toLocaleString("vi-VN")}</div>
                <div className="mt-2 text-[10px] md:text-xs text-white font-semibold bg-orange-400/70 rounded-full w-max px-3 py-1">
                  ĐANG BÁN CHẠY
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FlashSale;


