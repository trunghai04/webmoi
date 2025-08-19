import React, { createContext, useState, useMemo, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext({
  isAuthenticated: false,
  isReady: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("msv_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token && parsed?.user) {
          setIsAuthenticated(true);
          setUser(parsed.user);
        }
      } catch {}
    }
    setIsReady(true);
  }, []);

  const login = async (emailOrPhone, password) => {
    if (!emailOrPhone || !password) {
      throw new Error("Email/Số điện thoại và mật khẩu không được để trống");
    }
    // Call backend with timeout (10s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
        signal: controller.signal
      });
    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        throw new Error('Máy chủ không phản hồi, vui lòng thử lại.');
      }
      throw new Error('Không thể kết nối máy chủ.');
    }
    clearTimeout(timeoutId);
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Phản hồi không hợp lệ từ máy chủ');
    }
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Đăng nhập thất bại');
    }
    // Expected: { success, data: { token, user } }
    const token = data?.data?.token;
    const loggedInUser = data?.data?.user;
    if (!token || !loggedInUser) {
      throw new Error("Phản hồi không hợp lệ từ máy chủ");
    }
    setIsAuthenticated(true);
    setUser(loggedInUser);
    localStorage.setItem("msv_auth", JSON.stringify({ token, user: loggedInUser }));
    localStorage.setItem("token", token);
    return loggedInUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("msv_auth");
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({ isAuthenticated, isReady, user, login, logout }),
    [isAuthenticated, isReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


