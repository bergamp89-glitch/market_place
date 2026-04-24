import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
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

export default function Market() {
  const { allProducts } = useProducts();
  const { toggleFavorite, isFavorite, totalFavorites } = useFavorites();
  const { addToCart, totalItems } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [sortBy, setSortBy] = useState("newest");

  const activeProducts = useMemo(() => {
    return allProducts.filter((item) => item.isActive !== false);
  }, [allProducts]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(activeProducts.map((item) => item.category).filter(Boolean)),
    ];
    return ["Barchasi", ...unique];
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...activeProducts];

    if (activeCategory !== "Barchasi") {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();

      result = result.filter((item) => {
        const title = String(item.title || "").toLowerCase();
        const desc = String(item.desc || "").toLowerCase();
        const category = String(item.category || "").toLowerCase();
        const store = String(item.store || "").toLowerCase();

        return (
          title.includes(query) ||
          desc.includes(query) ||
          category.includes(query) ||
          store.includes(query)
        );
      });
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""))
      );
    }

    return result;
  }, [activeProducts, activeCategory, searchTerm, sortBy]);

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-600">Market</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Premium marketplace
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Uzumga yaqin qulay ko‘rinish, tezkor filter va qidiruv.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link
                to="/favorites"
                className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sevimli ({totalFavorites})
              </Link>

              <Link
                to="/cart"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                Savat ({totalItems})
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_260px]">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Mahsulot, do‘kon yoki kategoriya qidiring..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <SlidersHorizontal size={18} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              >
                <option value="newest">Avval tavsiya etilganlar</option>
                <option value="price-asc">Narx: arzonidan</option>
                <option value="price-desc">Narx: qimmatidan</option>
                <option value="rating">Reyting bo‘yicha</option>
                <option value="name">Nom bo‘yicha</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
              Natija: {filteredProducts.length} ta
            </span>

            {activeCategory !== "Barchasi" && (
              <span className="rounded-full bg-teal-50 px-3 py-1.5 font-medium text-teal-700">
                {activeCategory}
              </span>
            )}

            {searchTerm.trim() && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
                “{searchTerm.trim()}”
              </span>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-5">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const productImage = getProductImage(product);
                const favorite = isFavorite(product.id);

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
            <div className="rounded-3xl bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900">Mahsulot topilmadi</h3>
              <p className="mt-2 text-sm text-slate-500">
                Qidiruv yoki filter qiymatini o‘zgartirib ko‘ring.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("Barchasi");
                    setSortBy("newest");
                  }}
                  className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Tozalash
                </button>

                <Link
                  to="/"
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Bosh sahifa
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}