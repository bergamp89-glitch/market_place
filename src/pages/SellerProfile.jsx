import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, ShoppingCart, Star, Store } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useChat } from "../context/ChatContext";

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

export default function SellerProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { getProductsByStoreSlug } = useProducts();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { getOrCreateSellerChat } = useChat();

  const sellerProducts = (getProductsByStoreSlug?.(slug) || []).filter(
    (item) => item.isActive !== false
  );

  const sellerInfo =
    sellerProducts.length > 0
      ? {
          store: sellerProducts[0].store || "Do‘kon",
          storeSlug: sellerProducts[0].storeSlug || slug,
          rating:
            sellerProducts.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
              sellerProducts.length || 4.8,
          cover: getProductImage(sellerProducts[0]),
          totalProducts: sellerProducts.length,
          categories: [
            ...new Set(sellerProducts.map((item) => item.category).filter(Boolean)),
          ],
        }
      : null;

  const handleMessageStore = () => {
    if (!sellerInfo) return;

    if (typeof getOrCreateSellerChat === "function") {
      getOrCreateSellerChat({
        storeName: sellerInfo.store,
        storeSlug: sellerInfo.storeSlug,
        avatar: sellerInfo.cover || "",
      });
    }

    navigate("/messages");
  };

  if (!sellerInfo) {
    return (
      <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-teal-600">Do‘kon</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Do‘kon topilmadi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Bu do‘kon mavjud emas yoki faol mahsulotlari yo‘q.
          </p>

          <Link
            to="/market"
            className="mt-5 inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Marketga qaytish
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="relative">
            <div className="h-56 bg-slate-100 sm:h-72">
              {sellerInfo.cover ? (
                <img
                  src={sellerInfo.cover}
                  alt={sellerInfo.store}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  Store cover
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    <Store size={14} />
                    Do‘kon sahifasi
                  </div>

                  <h1 className="text-3xl font-bold sm:text-4xl">{sellerInfo.store}</h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/90">
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      {Number(sellerInfo.rating || 4.8).toFixed(1)}
                    </span>
                    <span>{sellerInfo.totalProducts} ta mahsulot</span>
                    <span>{sellerInfo.categories.length} ta kategoriya</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleMessageStore}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    <MessageCircle size={16} />
                    Xabar yuborish
                  </button>

                  <Link
                    to="/market"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Marketga qaytish
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-200 p-4 sm:grid-cols-3 sm:p-5">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Do‘kon nomi</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{sellerInfo.store}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Reyting</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                ⭐ {Number(sellerInfo.rating || 4.8).toFixed(1)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Mahsulotlar</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {sellerInfo.totalProducts} ta
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <p className="text-sm font-semibold text-teal-600">Mahsulotlar</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {sellerInfo.store} mahsulotlari
            </h2>
          </div>

          <div className="p-3 sm:p-5">
            {sellerProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {sellerProducts.map((product) => {
                  const image = getProductImage(product);
                  const favorite = isFavorite(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative">
                        <div className="h-44 overflow-hidden bg-slate-100 sm:h-56">
                          {image ? (
                            <img
                              src={image}
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
                          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-sm shadow-sm transition ${
                            favorite
                              ? "bg-rose-100 text-rose-600"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Heart size={16} fill={favorite ? "currentColor" : "none"} />
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
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                Hozircha mahsulot yo‘q.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}