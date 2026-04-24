import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";

import Home from "../pages/Home";
import Reels from "../pages/Reels";
import Market from "../pages/Market";
import ProductDetail from "../pages/ProductDetail";
import SellerProfile from "../pages/SellerProfile";
import Favorites from "../pages/Favorites";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Messages from "../pages/Messages";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SellerDashboard from "../pages/SellerDashboard";
import AdminPanel from "../pages/AdminPanel";

import { useAuth } from "../context/AuthContext";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RequireSeller({ children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== "seller" && currentUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RequireAdmin({ children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const showFooter = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="pb-20 md:pb-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/market" element={<Market />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/seller/:slug" element={<SellerProfile />} />

          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />

          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart />
              </RequireAuth>
            }
          />

          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />

          <Route
            path="/messages"
            element={
              <RequireAuth>
                <Messages />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/seller-dashboard"
            element={
              <RequireSeller>
                <SellerDashboard />
              </RequireSeller>
            }
          />

          <Route
            path="/admin-panel"
            element={
              <RequireAdmin>
                <AdminPanel />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
      <MobileBottomNav />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}