import React, { createContext, useState, useMemo, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext({
  isAuthenticated: false,
  isReady: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  facebookLogin: async () => {},
  googleLogin: async () => {},
  checkAuthStatus: async () => {},
  updateUser: () => {},
});

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);

  // Update user function
  const updateUser = useCallback((newUserData) => {
    setUser(newUserData);
    const stored = localStorage.getItem("msv_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem("msv_auth", JSON.stringify({ 
        ...parsed, 
        user: newUserData 
      }));
    }
  }, []);

  // Load from localStorage on mount and verify token
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = localStorage.getItem("msv_auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.token && parsed?.user) {
            console.log('Auth loaded from localStorage:', { token: parsed.token, user: parsed.user });
            
            // For now, just load from localStorage without verification
            // Token verification will be done when making API calls
            console.log('Loading auth from localStorage without verification');
            setIsAuthenticated(true);
            setUser(parsed.user);
          } else {
            console.log('Invalid auth data in localStorage');
            localStorage.removeItem("msv_auth");
            localStorage.removeItem("token");
          }
        } else {
          console.log('No auth data in localStorage');
        }
      } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        localStorage.removeItem("msv_auth");
        localStorage.removeItem("token");
      }
      setIsReady(true);
    };

    loadAuth();
  }, []);

  const login = useCallback(async (emailOrPhone, password) => {
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
  }, []);

  const register = useCallback(async (userData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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
      throw new Error(data?.message || 'Đăng ký thất bại');
    }
    return data.data;
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out user');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("msv_auth");
    localStorage.removeItem("token");
  }, []);

  // Facebook Login Function
  const facebookLogin = useCallback(async (accessToken, userID) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      res = await fetch(`${API_BASE}/api/auth/facebook-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, userID }),
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
      throw new Error(data?.message || 'Đăng nhập Facebook thất bại');
    }
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
  }, []);

  // Google Login Function
  const googleLogin = useCallback(async (accessToken, userID, userName, userEmail, userPicture) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      res = await fetch(`${API_BASE}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, userID, userName, userEmail, userPicture }),
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
      throw new Error(data?.message || 'Đăng nhập Google thất bại');
    }
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
  }, []);

  // Function to check if token is still valid
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log('No token found, user not authenticated');
        return false;
      }

      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Token is valid');
          return true;
        }
      }
      
      console.log('Token is invalid, logging out');
      logout();
      return false;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }, [logout]);

  const value = useMemo(
    () => ({ 
      isAuthenticated, 
      isReady, 
      user, 
      login, 
      register, 
      logout, 
      facebookLogin,
      googleLogin,
      checkAuthStatus,
      updateUser
    }),
    [isAuthenticated, isReady, user, login, register, logout, facebookLogin, googleLogin, checkAuthStatus, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


