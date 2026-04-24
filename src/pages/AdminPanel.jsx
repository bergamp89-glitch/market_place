import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useReelsData } from "../context/ReelContext";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;
}

const initialProductForm = {
  title: "",
  price: "",
  store: "",
  storeSlug: "",
  category: "",
  desc: "",
  stock: "1",
  images: [],
};

const initialReelForm = {
  productId: "",
  title: "",
  desc: "",
  videoUrl: "",
  isTemporary: false,
};

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function AdminPanel() {
  const {
    allProducts,
    addProduct,
    deleteProduct,
    toggleProductStatus,
  } = useProducts();

  const {
    allReels,
    addReel,
    deleteReel,
    toggleReelStatus,
  } = useReelsData();

  const { orders = [], removeOrder } = useOrders();

  const [activeTab, setActiveTab] = useState("products");
  const [productForm, setProductForm] = useState(initialProductForm);
  const [reelForm, setReelForm] = useState(initialReelForm);
  const [statusText, setStatusText] = useState("");

  const activeProducts = useMemo(
    () => allProducts.filter((item) => item.isActive !== false),
    [allProducts]
  );

  const activeReels = useMemo(
    () => allReels.filter((item) => item.isActive !== false),
    [allReels]
  );

  const handleProductChange = (event) => {
    setProductForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleReelChange = (event) => {
    setReelForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImagesChange = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    if (!files.length) return;

    const invalid = files.find((file) => !file.type.startsWith("image/"));
    if (invalid) {
      setStatusText("Faqat rasm fayllarini yuklang.");
      return;
    }

    const readAsDataUrl = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

    const results = await Promise.all(files.map(readAsDataUrl));

    setProductForm((prev) => ({
      ...prev,
      images: results,
    }));
  };

  const handleReelVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setStatusText("Faqat video yuklang.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setStatusText("Video 20MB dan kichik bo‘lishi kerak.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setReelForm((prev) => ({
      ...prev,
      videoUrl: objectUrl,
      isTemporary: true,
    }));
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();

    if (
      !productForm.title.trim() ||
      !productForm.price.trim() ||
      !productForm.store.trim() ||
      !productForm.category.trim() ||
      !productForm.desc.trim() ||
      !productForm.images.length
    ) {
      setStatusText("Mahsulot uchun barcha maydonlarni to‘ldiring.");
      return;
    }

    addProduct({
      title: productForm.title,
      price: Number(productForm.price),
      store: productForm.store,
      storeSlug: productForm.storeSlug || slugify(productForm.store),
      category: productForm.category,
      desc: productForm.desc,
      stock: Number(productForm.stock || 1),
      image: productForm.images[0] || "",
      images: productForm.images.slice(0, 4),
      ownerName: "Admin",
    });

    setProductForm(initialProductForm);
    setStatusText("Yangi mahsulot qo‘shildi.");
  };

  const handleReelSubmit = (event) => {
    event.preventDefault();

    if (
      !reelForm.productId ||
      !reelForm.title.trim() ||
      !reelForm.desc.trim() ||
      !reelForm.videoUrl.trim()
    ) {
      setStatusText("Reel uchun barcha maydonlarni to‘ldiring.");
      return;
    }

    addReel({
      productId: Number(reelForm.productId),
      title: reelForm.title,
      desc: reelForm.desc,
      videoUrl: reelForm.videoUrl,
      isTemporary: reelForm.isTemporary,
      ownerName: "Admin",
    });

    setReelForm(initialReelForm);
    setStatusText("Yangi reel qo‘shildi.");
  };

  return (
    <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-teal-600">Admin panel</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Loyiha boshqaruvi
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Mahsulotlar, reels va buyurtmalarni bir joydan boshqaring.
              </p>
            </div>

            <Link
              to="/"
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Bosh sahifa
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Mahsulotlar</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {allProducts.length}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Reels</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {allReels.length}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Buyurtmalar</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { key: "products", label: "Mahsulotlar" },
              { key: "add-product", label: "Mahsulot qo‘shish" },
              { key: "reels", label: "Reels" },
              { key: "add-reel", label: "Reel qo‘shish" },
              { key: "orders", label: "Buyurtmalar" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "bg-teal-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {statusText && (
            <div className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
              {statusText}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {activeTab === "products" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          Rasm yo‘q
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-slate-500">{product.store}</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">{product.category}</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {formatPrice(product.price)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(product.id)}
                          className="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {product.isActive ? "Nofaol" : "Faol"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                        >
                          O‘chirish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "add-product" && (
            <form onSubmit={handleProductSubmit} className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={productForm.title}
                  onChange={handleProductChange}
                  placeholder="Mahsulot nomi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductChange}
                  placeholder="Narx"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <input
                  type="text"
                  name="store"
                  value={productForm.store}
                  onChange={(event) => {
                    handleProductChange(event);
                    setProductForm((prev) => ({
                      ...prev,
                      storeSlug: slugify(event.target.value),
                    }));
                  }}
                  placeholder="Do‘kon nomi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <input
                  type="text"
                  name="storeSlug"
                  value={productForm.storeSlug}
                  onChange={handleProductChange}
                  placeholder="store-slug"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <input
                  type="text"
                  name="category"
                  value={productForm.category}
                  onChange={handleProductChange}
                  placeholder="Kategoriya"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleProductChange}
                  placeholder="Miqdori"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <textarea
                  name="desc"
                  rows="5"
                  value={productForm.desc}
                  onChange={handleProductChange}
                  placeholder="Tavsif"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-4">
                <label className="inline-flex cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Rasmlarni tanlash
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                  />
                </label>

                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {productForm.images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-2xl border border-slate-200"
                      >
                        <img
                          src={image}
                          alt={`preview-${index}`}
                          className="h-24 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Mahsulot qo‘shish
                </button>
              </div>
            </form>
          )}

          {activeTab === "reels" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {allReels.map((reel) => (
                <div
                  key={reel.id}
                  className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">{reel.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{reel.author}</p>
                  <p className="mt-2 text-sm text-slate-600">{reel.desc}</p>

                  {reel.videoUrl && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-black">
                      <video
                        src={reel.videoUrl}
                        controls
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleReelStatus(reel.id)}
                      className="rounded-2xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {reel.isActive ? "Nofaol" : "Faol"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteReel(reel.id)}
                      className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "add-reel" && (
            <form onSubmit={handleReelSubmit} className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <select
                  name="productId"
                  value={reelForm.productId}
                  onChange={handleReelChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                >
                  <option value="">Mahsulot tanlang</option>
                  {activeProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="title"
                  value={reelForm.title}
                  onChange={handleReelChange}
                  placeholder="Reel nomi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <textarea
                  name="desc"
                  rows="4"
                  value={reelForm.desc}
                  onChange={handleReelChange}
                  placeholder="Reel tavsifi"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />

                <label className="inline-flex cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Video tanlash (20MB gacha)
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleReelVideoChange}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  name="videoUrl"
                  value={reelForm.videoUrl}
                  onChange={(event) =>
                    setReelForm((prev) => ({
                      ...prev,
                      videoUrl: event.target.value,
                      isTemporary: false,
                    }))
                  }
                  placeholder="Yoki video URL kiriting"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-4">
                {reelForm.videoUrl && (
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black">
                    <video
                      src={reelForm.videoUrl}
                      controls
                      className="h-64 w-full object-cover"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Reel qo‘shish
                </button>
              </div>
            </form>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-teal-600">#{order.id}</p>
                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          {order.status || "Buyurtma"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          Sana: {order.createdAt || "Noma’lum"}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          Mijoz: {order.customer?.name || "Noma’lum"} —{" "}
                          {order.customer?.phone || "Telefon yo‘q"}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          To‘lov: {order.paymentType || "Noma’lum"}
                        </p>
                        {order.paymentType === "Karta" && order.cardNumber && (
                          <p className="mt-1 text-sm text-slate-700">
                            Karta: {order.cardNumber}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-slate-700">
                          Jami: {formatPrice(order.totalPrice)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeOrder(order.id)}
                        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        Buyurtmani o‘chirish
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Hozircha buyurtmalar yo‘q.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}