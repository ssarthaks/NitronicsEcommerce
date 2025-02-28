import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/Admin/AdminLogin';
import Admin from './pages/Admin/Admin';
import Profile from './pages/Profile';
import Register from './pages/Register';
import LoginRedirect from './components/LoginRedirect';
import { AuthProvider as AdminAuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { CategoryProvider } from './context/CategoryContext';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OtpVerification from './components/OtpVerification';
import Home from './pages/home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsandConditions';

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition: Bounce
      />
      <AdminAuthProvider>
        <UserAuthProvider>
          <CategoryProvider>
            <OrderProvider>
              <CartProvider>
                <Router>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/account" element={<Profile />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<LoginRedirect />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
                    <Route path="/otp-verification" element={<OtpVerification />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  </Routes>
                  <Footer />
                </Router>
              </CartProvider>
            </OrderProvider>
          </CategoryProvider>
        </UserAuthProvider>
      </AdminAuthProvider>
    </>
  );
};

export default App;
