import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaPlus, FaEdit, FaTrash, FaBox, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'partner' && user.role !== 'admin') return;
    fetchProducts(1);
  }, [user]);

  const fetchProducts = async (p) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/partner/products?page=${p}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data.products);
        setPage(data.data.pagination.page);
        setPages(data.data.pagination.pages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    const token = localStorage.getItem('token');
    const API_BASE = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${API_BASE}/api/partner/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success('Đã xóa');
      fetchProducts(page);
    } else {
      toast.error('Xóa thất bại');
    }
  };

  if (!user || (user.role !== 'partner' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-4">Bạn cần quyền đối tác để truy cập trang này</p>
          <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 inline-flex items-center gap-2">
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Chưa có sản phẩm nào</div>
        ) : (
          <div className="divide-y">
            {products.map((p) => (
              <div key={p.id} className="p-4 flex items-center gap-4">
                <img src={p.primary_image} alt={p.name} className="w-16 h-16 rounded object-cover border" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.category_name} • {Number(p.price).toLocaleString('vi-VN')} đ</div>
                </div>
                <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"> <FaEdit /> </button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"> <FaTrash /> </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((pg) => (
            <button key={pg} onClick={() => fetchProducts(pg)} className={`px-3 py-1 rounded ${pg === page ? 'bg-orange-100 text-orange-600' : 'bg-white border'}`}>{pg}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
