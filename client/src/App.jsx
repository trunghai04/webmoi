import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/products/Products'
import ProductDetails from './pages/products/ProductDetails'
import FlashSale from './pages/flash-sale/FlashSale'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import OrderConfirmation from './pages/checkout/OrderConfirmation'
import Wishlist from './pages/wishlist/Wishlist'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import MyAccount from './pages/user/MyAccount'
import Feedback from './pages/feedback/Feedback'
import Support from './pages/support/Support'
import Chat from './pages/chat/Chat'
import Categories from './pages/categories/Categories'
import Shop from './pages/shop/Shop'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChatWidget from './components/ChatWidget'
import AdminDashboard from './pages/admin/AdminDashboard'
import PartnerDashboard from './pages/partner/PartnerDashboard'
import TestCheckout from './pages/TestCheckout'
import TestBuyNow from './pages/TestBuyNow'



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:categoryId" element={<Categories />} />
            <Route path="/shop/:shopId" element={<Shop />} />
            <Route path="/flash-sale" element={<FlashSale />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/user/*" element={<MyAccount />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/partner" element={<PartnerDashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/support" element={<Support />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/test-checkout" element={<TestCheckout />} />
            <Route path="/test-buy-now" element={<TestBuyNow />} />
          </Routes>
          <ChatWidget />
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
