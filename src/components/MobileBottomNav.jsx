import { NavLink, useLocation } from "react-router-dom";
import {
  House,
  Clapperboard,
  Store,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalItems = 0 } = useCart();
  const { totalFavorites = 0 } = useFavorites();

  const hiddenPaths = ["/login", "/register"];
  const isHidden = hiddenPaths.includes(location.pathname);

  if (isHidden) return null;

  const items = [
    { name: "Bosh", path: "/", icon: House },
    { name: "Reels", path: "/reels", icon: Clapperboard },
    { name: "Market", path: "/market", icon: Store },
    { name: "Sevimli", path: "/favorites", icon: Heart, badge: totalFavorites },
    { name: "Savat", path: "/cart", icon: ShoppingCart, badge: totalItems },
    { name: "Profil", path: "/profile", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition ${
                  isActive ? "text-teal-600" : "text-slate-500"
                }`
              }
            >
              <div className="relative">
                <Icon size={18} />
                {item.badge > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[9px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              <span className="line-clamp-1">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}