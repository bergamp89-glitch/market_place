import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useProducts } from "../context/ProductContext";
import { useChat } from "../context/ChatContext";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;
}

function monthlyPrice(price) {
  return Math.round(Number(price || 0) / 12);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { allProducts } = useProducts();
  const { getOrCreateSellerChat } = useChat();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = allProducts.find((item) => Number(item.id) === Number(id));

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.slice(0, 4);
    }
    return product.image ? [product.image] : [];
  }, [product]);

  const activeImage = images[activeImageIndex] || product?.image || "";

  const similarProducts = product
    ? allProducts
        .filter(
          (item) =>
            item.id !== product.id &&
            item.isActive !== false &&
            (item.category === product.category || item.store === product.store)
        )
        .slice(0, 4)
    : [];

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-teal-600">Mahsulot</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Mahsulot topilmadi</h1>
          <p className="mt-2 text-slate-500">Bu mahsulot mavjud emas yoki o‘chirib yuborilgan.</p>

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

  const favorite = isFavorite(product.id);

  const handleMessageStore = () => {
    if (typeof getOrCreateSellerChat === "function") {
      getOrCreateSellerChat({
        storeName: product.store || "Do'kon",
        storeSlug: product.storeSlug || "",
        avatar: activeImage || "",
      });
    }
    navigate("/messages");
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-3 sm:p-5">
            <div className="mb-4">
              <Link
                to="/market"
                className="text-sm font-medium text-slate-500 transition hover:text-teal-600"
              >
                ← Marketga qaytish
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white">
                  <div className="relative h-[20rem] overflow-hidden bg-slate-100 sm:h-[28rem]">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        Product image
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleFavorite(product)}
                      className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-base shadow-sm transition ${
                        favorite
                          ? "bg-rose-100 text-rose-600"
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Heart size={18} fill={favorite ? "currentColor" : "none"} />
                    </button>

                    <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur">
                      ⭐ {product.rating || 4.8}
                    </div>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`overflow-hidden rounded-2xl border transition ${
                          activeImageIndex === index
                            ? "border-teal-500 ring-2 ring-teal-100"
                            : "border-slate-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="h-20 w-full object-cover sm:h-24"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Tavsif</h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {product.desc || "Mahsulot tavsifi mavjud emas."}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      {product.category || "Kategoriya"}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      {Number(product.stock || 0) > 0 ? "Sotuvda bor" : "Tugagan"}
                    </span>
                  </div>

                  <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {product.title}
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Do‘kon:{" "}
                    {product.storeSlug ? (
                      <Link
                        to={`/seller/${product.storeSlug}`}
                        className="font-semibold text-teal-600 hover:underline"
                      >
                        {product.store || "Do‘kon"}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-700">
                        {product.store || "Do‘kon"}
                      </span>
                    )}
                  </p>

                  <div className="mt-5">
                    <p className="text-3xl font-bold text-slate-900 sm:text-4xl">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Reyting</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <Star size={16} fill="currentColor" />
                          {product.rating || 4.8}
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Miqdori</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {product.stock || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600"
                    >
                      Savatga qo‘shish
                    </button>

                    <button
                      type="button"
                      onClick={handleMessageStore}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <MessageCircle size={16} />
                      Do‘konga yozish
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(product)}
                      className={`rounded-2xl px-5 py-3 font-semibold transition ${
                        favorite
                          ? "bg-rose-100 text-rose-600"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {favorite ? "Sevimlidan olish" : "Sevimliga qo‘shish"}
                    </button>

                    <Link
                      to="/cart"
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Savatni ko‘rish
                    </Link>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="text-lg font-bold text-slate-900">Sotuvchi haqida</h3>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Do‘kon nomi</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {product.store || "Do‘kon"}
                    </p>

                    <p className="mt-4 text-sm text-slate-500">Do‘kon reytingi</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      ⭐ {product.rating || 4.8}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {product.storeSlug && (
                        <Link
                          to={`/seller/${product.storeSlug}`}
                          className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                        >
                          Do‘konni ko‘rish
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleMessageStore}
                        className="inline-flex rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Xabar yuborish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <h3 className="text-lg font-bold text-slate-900">Galereya</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Bu mahsulot uchun {images.length} ta rasm mavjud.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-3 sm:p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-teal-600">Tavsiyalar</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">O‘xshash mahsulotlar</h2>
            </div>

            {similarProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {similarProducts.map((item) => {
                  const image =
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : item.image || "";

                  return (
                    <div
                      key={item.id}
                      className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative">
                        <div className="h-40 overflow-hidden bg-slate-100 sm:h-48">
                          {image ? (
                            <img
                              src={image}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              Product image
                            </div>
                          )}
                        </div>

                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur">
                          ⭐ {item.rating || 4.8}
                        </div>
                      </div>

                      <div className="p-3 sm:p-4">
                        <p className="truncate text-xs font-medium text-slate-500">{item.store}</p>

                        <h3 className="mt-2 min-h-[44px] text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-base font-bold text-slate-900 sm:text-lg">
                          {formatPrice(item.price)}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <Link
                            to={`/product/${item.id}`}
                            className="flex-1 rounded-2xl border border-slate-300 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                          >
                            Batafsil
                          </Link>

                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="flex-1 rounded-2xl bg-teal-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-600 sm:text-sm"
                          >
                            Savatga
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">
                Hozircha o‘xshash mahsulotlar yo‘q.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-slate-200 bg-white p-3 shadow-2xl sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
              favorite
                ? "bg-rose-100 text-rose-600"
                : "border border-slate-300 text-slate-700"
            }`}
          >
            ♥
          </button>

          <button
            type="button"
            onClick={handleMessageStore}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MessageCircle size={16} />
            Xabar
          </button>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            <ShoppingCart size={16} />
            Savatga
          </button>
        </div>
      </div>
    </>
  );
}