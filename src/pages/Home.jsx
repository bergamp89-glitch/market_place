import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useReelsData } from "../context/ReelContext";
import { useProducts } from "../context/ProductContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import SmartVideo from "../components/SmartVideo";
import ReelModal from "../components/ReelModal";

const reelThemes = [
  "from-fuchsia-500 via-rose-500 to-orange-400",
  "from-cyan-500 via-sky-500 to-indigo-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-violet-500 via-purple-500 to-fuchsia-500",
];

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;
}

function monthlyPrice(price) {
  return Math.round(Number(price || 0) / 12);
}

function parseCount(value) {
  if (typeof value === "number") return value;
  const text = String(value || "").toLowerCase().trim();
  if (text.endsWith("k")) return Math.round(parseFloat(text) * 1000);
  return Number(text) || 0;
}

function formatCount(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(".0", "")}k`;
  return String(value);
}

function getInitial(name = "") {
  return String(name).trim().charAt(0).toUpperCase() || "D";
}

function getProductImage(product) {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images[0];
  }
  return product?.image || "";
}

export default function Home() {
  const { allReels } = useReelsData();
  const { allProducts } = useProducts();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [activeReelIndex, setActiveReelIndex] = useState(null);

  const preparedReels = useMemo(() => {
    return allReels
      .filter((item) => item.isActive !== false)
      .map((reel, index) => ({
        ...reel,
        theme: reelThemes[index % reelThemes.length],
      }))
      .slice(0, 8);
  }, [allReels]);

  const previewProducts = useMemo(() => {
    return allProducts.filter((item) => item.isActive !== false).slice(0, 8);
  }, [allProducts]);

  return (
    <>
      <section className="mx-auto max-w-7xl py-4 sm:py-6">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-teal-600">Reels preview</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Oxirgi premium reelslar
                  </h2>
                </div>

                <Link
                  to="/reels"
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Hammasini ko‘rish
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {preparedReels.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {preparedReels.map((reel, index) => {
                    const product =
                      allProducts.find((item) => item.id === Number(reel.productId)) ||
                      null;

                    return (
                      <button
                        key={reel.id}
                        type="button"
                        onClick={() => setActiveReelIndex(index)}
                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative h-96 overflow-hidden bg-slate-950">
                          <SmartVideo
                            src={reel.videoUrl}
                            muted
                            loop
                            autoPlay
                            fallbackTheme={reel.theme}
                            className="absolute inset-0 h-full w-full object-cover"
                            showCenterPlay
                          />

                          <div className="absolute inset-0 bg-black/25" />
                          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 to-transparent" />

                          <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold backdrop-blur">
                                {getInitial(reel.author)}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{reel.author}</p>
                                <p className="text-xs text-white/70">Do‘kon profili</p>
                              </div>
                            </div>

                            <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
                              Premium
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="line-clamp-2 text-lg font-bold">{reel.title}</h3>
                            <p className="mt-2 line-clamp-2 text-sm text-white/85">
                              {reel.desc}
                            </p>

                            <div className="mt-3 flex items-center gap-4 text-xs text-white/75">
                              <span>{formatCount(parseCount(reel.likes))} like</span>
                              <span>{formatCount(parseCount(reel.saves))} save</span>
                              <span>{formatCount(parseCount(reel.comments || 0))} izoh</span>
                            </div>

                            {product && (
                              <div className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur">
                                {product.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Hozircha reel yo‘q.
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-teal-600">Market preview</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Oxirgi mahsulotlar
                  </h2>
                </div>

                <Link
                  to="/market"
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Hammasini ko‘rish
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {previewProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {previewProducts.map((product) => {
                    const favorite = isFavorite(product.id);
                    const productImage = getProductImage(product);

                    return (
                      <div
                        key={product.id}
                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative">
                          <div className="h-44 overflow-hidden bg-slate-100 sm:h-52">
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

      <ReelModal
        reels={preparedReels}
        activeIndex={activeReelIndex}
        setActiveIndex={setActiveReelIndex}
      />
    </>
  );
}