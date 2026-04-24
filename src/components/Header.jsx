import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  House,
  Clapperboard,
  Store,
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  MessageCircle,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { totalItems = 0 } = useCart();
  const { totalFavorites = 0 } = useFavorites();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { chats = [], totalUnread = 0 } = useChat();

  const unreadCount = useMemo(() => {
    if (typeof totalUnread === "number" && totalUnread > 0) return totalUnread;

    return chats.reduce((sum, chat) => sum + Number(chat?.unreadCount || 0), 0);
  }, [chats, totalUnread]);

  const mainLinks = [
    { name: "Bosh sahifa", path: "/", icon: House },
    { name: "Reels", path: "/reels", icon: Clapperboard },
    { name: "Market", path: "/market", icon: Store },
  ];

  const actionLinks = [
    { name: "Sevimli", path: "/favorites", icon: Heart, badge: totalFavorites },
    { name: "Xabarlar", path: "/messages", icon: MessageCircle, badge: unreadCount },
    { name: "Savat", path: "/cart", icon: ShoppingCart, badge: totalItems },
  ];

  const isAdmin = currentUser?.role === "admin";
  const isSeller = currentUser?.role === "seller";
  const canOpenDashboard = isAdmin || isSeller;

  const dashboardPath = isAdmin ? "/admin-panel" : "/seller-dashboard";
  const dashboardLabel = isAdmin ? "Admin panel" : "Seller panel";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout?.();
    closeMobileMenu();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center gap-3 sm:h-16">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-500 text-sm font-bold text-white shadow-sm">
              T
            </div>

            <div className="hidden min-[430px]:block">
              <p className="text-sm font-bold text-slate-900">TealMarket</p>
              <p className="text-[11px] text-slate-500">market + reels</p>
            </div>
          </Link>

          <div className="hidden flex-1 lg:block">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Mahsulot, do‘kon yoki kategoriya qidiring..."
                className="w-full bg-transparent text-sm outline-none"
                readOnly
              />
            </div>
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {mainLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {actionLinks.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                  title={item.name}
                >
                  <Icon size={17} />
                  {item.badge > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[9px] font-bold text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {canOpenDashboard && (
              <NavLink
                to={dashboardPath}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-teal-200 bg-teal-50 text-teal-700"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <LayoutDashboard size={16} />
                <span>{dashboardLabel}</span>
              </NavLink>
            )}

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-teal-200 bg-teal-50 text-teal-700"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <User size={16} />
                  <span className="max-w-[90px] truncate">
                    {currentUser?.name || "Profil"}
                  </span>
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  <LogOut size={16} />
                  Chiqish
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Kirish
                </NavLink>

                <NavLink
                  to="/register"
                  className="rounded-2xl bg-teal-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Ro‘yxatdan o‘tish
                </NavLink>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>

        <div className="pb-3 lg:hidden">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full bg-transparent text-sm outline-none"
              readOnly
            />
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-3 md:hidden">
            <div className="grid gap-2">
              {mainLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-teal-50 text-teal-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}

              {actionLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-teal-50 text-teal-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {item.name}
                    </span>

                    {item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}

              {canOpenDashboard && (
                <NavLink
                  to={dashboardPath}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  <LayoutDashboard size={18} />
                  {dashboardLabel}
                </NavLink>
              )}

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-teal-50 text-teal-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`
                    }
                  >
                    <User size={18} />
                    {currentUser?.name || "Profil"}
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <LogOut size={16} />
                    Chiqish
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                  >
                    Kirish
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-2xl bg-teal-500 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Ro‘yxatdan o‘tish
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}