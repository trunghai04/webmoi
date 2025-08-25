import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SocialLogin from "../../components/SocialLogin";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState(false);

  // Handle Facebook login
  const handleFacebookLogin = useCallback(async () => {
    setSocialLoginLoading(true);
    
    try {
      // Check if Facebook SDK is loaded
      if (typeof window.FB === 'undefined') {
        toast.error('Facebook SDK chưa được tải. Vui lòng refresh trang và thử lại.');
        setSocialLoginLoading(false);
        return;
      }
      
      window.FB.login((response) => {
        if (response.authResponse) {
          // Get user info from Facebook
          window.FB.api('/me', { fields: 'id,name,email,picture' }, async (userInfo) => {
            try {
              // Call backend API
              const API_BASE = import.meta.env.VITE_API_URL || '';
              
              const res = await fetch(`${API_BASE}/api/auth/facebook-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  accessToken: response.authResponse.accessToken,
                  userID: userInfo.id
                })
              });

              const data = await res.json();
              
                              if (data.success) {
                  toast.success('Đăng nhập Facebook thành công!');
                  // Handle successful login
                  localStorage.setItem('token', data.data.token);
                  localStorage.setItem('msv_auth', JSON.stringify({
                    token: data.data.token,
                    user: data.data.user
                  }));
                  // Force refresh to update auth state
                  window.location.href = '/';
                } else {
                throw new Error(data.message || 'Đăng nhập thất bại');
              }
            } catch (error) {
              toast.error(error.message || 'Đăng nhập Facebook thất bại');
            } finally {
              setSocialLoginLoading(false);
            }
          });
        } else {
          if (response.status === 'not_authorized') {
            toast.error('Đăng nhập Facebook bị từ chối');
          } else {
            toast.error('Đăng nhập Facebook bị hủy');
          }
          setSocialLoginLoading(false);
        }
      }, { scope: 'email,public_profile' });
    } catch (error) {
      toast.error(error.message || 'Đăng nhập Facebook thất bại');
      setSocialLoginLoading(false);
    }
  }, [navigate]);

  // Handle Google login
  const handleGoogleLogin = useCallback(async () => {
    setSocialLoginLoading(true);
    try {
      if (!window.google) {
        throw new Error('Google SDK chưa được tải');
      }

      const client = google.accounts.oauth2.initTokenClient({
        client_id: '982533581787-djhi8juujp3jsmhv76a3ij7he7jlb0i4.apps.googleusercontent.com',
        scope: 'email profile',
        callback: async (response) => {
          try {
            // Get user info from Google
            const userInfo = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
            const userData = await userInfo.json();

            // Call backend API
            const API_BASE = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${API_BASE}/api/auth/google-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accessToken: response.access_token,
                userID: userData.id,
                userName: userData.name,
                userEmail: userData.email,
                userPicture: userData.picture
              })
            });

            const data = await res.json();
            if (data.success) {
              toast.success('Đăng nhập Google thành công!');
              // Handle successful login
              localStorage.setItem('token', data.data.token);
              localStorage.setItem('msv_auth', JSON.stringify({
                token: data.data.token,
                user: data.data.user
              }));
              // Force refresh to update auth state
              window.location.href = '/';
            } else {
              throw new Error(data.message || 'Đăng nhập thất bại');
            }
          } catch (error) {
            toast.error(error.message || 'Đăng nhập Google thất bại');
          } finally {
            setSocialLoginLoading(false);
          }
        }
      });

      client.requestAccessToken();
    } catch (error) {
      toast.error(error.message || 'Đăng nhập Google thất bại');
      setSocialLoginLoading(false);
    }
  }, [navigate]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const loggedInUser = await login(formData.emailOrPhone, formData.password);
      toast.success("Đăng nhập thành công!");
      
      // Force refresh to update auth state
      window.location.href = '/';
    } catch (error) {
      if (error.message.includes('Too many requests')) {
        toast.error("Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút!");
      } else {
        toast.error("Email/Số điện thoại hoặc mật khẩu không đúng!");
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [formData.emailOrPhone, formData.password, login, navigate, isSubmitting]);

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
        hideLogoShrink={false}
        hideTopNav={true}
        isProfilePage={true}
      />

      {/* Spacer for header */}
      <div className="h-16 md:h-20 lg:h-24"></div>

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              to="/auth/register"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
                  Email hoặc số điện thoại
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/auth/forgot-password"
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                </div>
              </div> */}

              <div className="mt-6">
                <SocialLogin 
                  onFacebookLogin={handleFacebookLogin}
                  onGoogleLogin={handleGoogleLogin}
                  isLoading={socialLoginLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
