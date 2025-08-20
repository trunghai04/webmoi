import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaEye, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({ title: '', link_url: '', sort_order: 0, is_active: 1, file: null });

  const API_BASE = import.meta.env.VITE_API_URL || '';

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/banners`);
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (e) {
      toast.error('Không thể tải banner');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadBanners(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.file) {
      toast.error('Vui lòng chọn ảnh banner');
      return;
    }
    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('banner', form.file);
      fd.append('title', form.title);
      fd.append('link_url', form.link_url);
      fd.append('sort_order', String(form.sort_order || 0));
      fd.append('is_active', String(form.is_active ? 1 : 0));

      const token = localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : '';
      const res = await fetch(`${API_BASE}/api/banners`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Đã thêm banner');
        setForm({ title: '', link_url: '', sort_order: 0, is_active: 1, file: null });
        await loadBanners();
      } else {
        toast.error(data.message || 'Thêm banner thất bại');
      }
    } catch (e) {
      toast.error('Lỗi khi tạo banner');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (id, patch) => {
    try {
      const token = localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : '';
      const res = await fetch(`${API_BASE}/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Đã cập nhật');
        await loadBanners();
      } else {
        toast.error(data.message || 'Cập nhật thất bại');
      }
    } catch (e) {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa banner này?')) return;
    try {
      const token = localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : '';
      const res = await fetch(`${API_BASE}/api/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Đã xóa');
        await loadBanners();
      } else {
        toast.error(data.message || 'Xóa thất bại');
      }
    } catch (e) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quản lý Banner</h2>

      {/* Create form */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        <div>
          <label className="block text-sm mb-1">Tiêu đề</label>
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Tiêu đề" />
        </div>
        <div>
          <label className="block text-sm mb-1">Link</label>
          <input value={form.link_url} onChange={e=>setForm({...form, link_url:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="https://..." />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm mb-1">Thứ tự</label>
            <input type="number" value={form.sort_order} onChange={e=>setForm({...form, sort_order:Number(e.target.value)})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Kích hoạt</label>
            <select value={form.is_active} onChange={e=>setForm({...form, is_active: Number(e.target.value)})} className="w-full border rounded px-3 py-2">
              <option value={1}>Có</option>
              <option value={0}>Không</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Ảnh</label>
            <input type="file" accept="image/*" onChange={e=>setForm({...form, file: e.target.files?.[0] || null})} className="w-full" />
          </div>
        </div>
        <button disabled={isUploading} className="bg-orange-500 text-white px-4 py-2 rounded flex items-center gap-2 justify-center">
          <FaPlus /> {isUploading ? 'Đang tải...' : 'Thêm banner'}
        </button>
      </form>

      {/* List */}
      {isLoading ? (
        <div>Đang tải...</div>
      ) : banners.length === 0 ? (
        <div className="text-gray-500">Chưa có banner</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(b => (
            <div key={b.id} className="border rounded-lg p-3">
              <img src={b.image_url} alt={b.title} className="w-full h-40 object-cover rounded mb-2" />
              <div className="font-medium mb-1">{b.title || '(Không tiêu đề)'}</div>
              <div className="text-sm text-gray-600 break-all mb-2">{b.link_url}</div>
              <div className="flex items-center gap-2">
                <button onClick={()=>handleUpdate(b.id, { is_active: b.is_active ? 0 : 1 })} className={`px-3 py-1 rounded ${b.is_active? 'bg-green-100 text-green-700':'bg-gray-100 text-gray-700'}`}>
                  {b.is_active? 'Đang bật':'Đang tắt'}
                </button>
                <button onClick={()=>handleUpdate(b.id, { sort_order: (b.sort_order||0)+1 })} className="px-3 py-1 rounded bg-blue-100 text-blue-700">+ thứ tự</button>
                <a href={b.link_url || '#'} target="_blank" className="px-3 py-1 rounded bg-purple-100 text-purple-700 flex items-center gap-1"><FaEye/> Xem</a>
                <button onClick={()=>handleDelete(b.id)} className="px-3 py-1 rounded bg-red-100 text-red-700 flex items-center gap-1"><FaTrash/> Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banners;


