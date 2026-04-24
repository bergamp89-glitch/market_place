import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";

export default function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-3 py-4 pb-32 sm:px-6 sm:py-6 lg:px-8">
        <Outlet />
      </main>

      {isHomePage && <Footer />}
      <MobileBottomNav />
    </div>
  );
}