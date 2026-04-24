import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useOrders } from "../context/OrderContext";

export default function Profile() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { orders } = useOrders();

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-5xl py-6 sm:py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-teal-600">Profil</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Avval tizimga kiring</h1>
          <p className="mt-2 text-slate-500">Profilni ko‘rish uchun kirish kerak.</p>

          <Link
            to="/login"
            className="mt-5 inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Kirish
          </Link>
        </div>
      </section>
    );
  }

  const userName = currentUser?.name || "Foydalanuvchi";
  const userPhone = currentUser?.phone || "Telefon yo‘q";
  const userRole = currentUser?.role || "user";

  return (
    <section className="mx-auto max-w-6xl py-4 sm:py-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-sm font-semibold text-teal-600">Profil</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Shaxsiy kabinet
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Hisob ma’lumotlari va tezkor bo‘limlar.
          </p>
        </div>

        <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500 text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{userName}</h2>
                  <p className="mt-1 text-sm text-slate-500">{userPhone}</p>
                  <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase text-slate-700">
                    {userRole}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Sevimlilar</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{totalFavorites}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Savat</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{totalItems}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Buyurtmalar</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{orders.length}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Holat</p>
                  <p className="mt-2 text-2xl font-bold text-teal-600">Faol</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-lg font-bold text-slate-900">Hisob boshqaruvi</h3>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Hisobdan chiqish
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-lg font-bold text-slate-900">Tezkor o‘tish</h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/favorites"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Sevimlilarni ko‘rish
                </Link>

                <Link
                  to="/cart"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Savatni ko‘rish
                </Link>

                <Link
                  to="/orders"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Buyurtmalar
                </Link>

                <Link
                  to="/messages"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Xabarlar
                </Link>

                {(userRole === "seller" || userRole === "admin") && (
                  <Link
                    to="/seller-dashboard"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Seller dashboard
                  </Link>
                )}

                {userRole === "admin" && (
                  <Link
                    to="/admin-panel"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Admin panel
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
              <h3 className="text-lg font-bold text-slate-900">So‘nggi buyurtmalar</h3>

              <div className="mt-4 space-y-3">
                {orders.length > 0 ? (
                  orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {Number(order.totalPrice || 0).toLocaleString("uz-UZ")} so'm
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.createdAt || "Sana yo‘q"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Hozircha buyurtmalar yo‘q.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}