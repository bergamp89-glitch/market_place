import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;
}

function monthlyPrice(price) {
  return Math.round(Number(price || 0) / 12);
}

function getProductImage(product) {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }
  return product?.image || "";
}

export default function Favorites() {
  const { favorites = [], toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-sm font-semibold text-teal-600">Sevimlilar</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Sevimli mahsulotlar
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Siz saqlagan mahsulotlar shu yerda chiqadi.
          </p>
        </div>

        <div className="p-3 sm:p-5">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((product) => {
                const productImage = getProductImage(product);

                return (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative">
                      <div className="h-44 overflow-hidden bg-slate-100 sm:h-56">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            Product image
                          </div>
                        )}
                      </div>

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
                        <span className="inline-flex items-center gap-1">
                          <Star size={12} fill="currentColor" />
                          {product.rating || 4.8}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(product)}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-sm transition hover:bg-rose-200"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-medium text-slate-500">
                          {product.store}
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                          {product.category}
                        </span>
                      </div>

                      <h3 className="min-h-[44px] text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                        {product.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
                        {product.desc}
                      </p>

                      <p className="mt-4 text-base font-bold text-slate-900 sm:text-xl">
                        {formatPrice(product.price)}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-1 rounded-2xl border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                        >
                          Batafsil
                        </Link>

                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-600 sm:text-sm"
                        >
                          <ShoppingCart size={14} />
                          Savatga
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900">Sevimlilar bo‘sh</h3>
              <p className="mt-2 text-sm text-slate-500">
                Mahsulotlarni yurakcha orqali saqlang.
              </p>

              <Link
                to="/market"
                className="mt-5 inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                Marketga o‘tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}