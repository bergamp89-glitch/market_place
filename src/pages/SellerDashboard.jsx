import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useReelsData } from "../context/ReelContext";

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

export default function SellerDashboard() {
  const { currentUser, isAuthenticated } = useAuth();

  const {
    customProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  } = useProducts();

  const {
    customReels,
    addReel,
    deleteReel,
    toggleReelStatus,
  } = useReelsData();

  const [activeTab, setActiveTab] = useState("product");
  const [productForm, setProductForm] = useState(initialProductForm);
  const [reelForm, setReelForm] = useState(initialReelForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [reelErrors, setReelErrors] = useState({});
  const [successText, setSuccessText] = useState("");

  const myProducts = useMemo(() => {
    return customProducts.filter(
      (item) => item.ownerName === (currentUser?.name || "")
    );
  }, [customProducts, currentUser]);

  const myReels = useMemo(() => {
    return customReels.filter(
      (item) => item.ownerName === (currentUser?.name || "")
    );
  }, [customReels, currentUser]);

  useEffect(() => {
    if (!productForm.store && currentUser?.name) {
      setProductForm((prev) => ({
        ...prev,
        store: `${currentUser.name} Shop`,
        storeSlug: slugify(`${currentUser.name} Shop`),
      }));
    }
  }, [currentUser, productForm.store]);

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-5xl py-6 sm:py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-teal-600">Seller dashboard</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Avval tizimga kiring
          </h1>
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

  const resetProductForm = () => {
    setProductForm({
      ...initialProductForm,
      store: `${currentUser?.name || "My"} Shop`,
      storeSlug: slugify(`${currentUser?.name || "my"} Shop`),
    });
    setEditingId(null);
    setErrors({});
  };

  const resetReelForm = () => {
    setReelForm(initialReelForm);
    setReelErrors({});
  };

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
      setErrors((prev) => ({
        ...prev,
        images: "Faqat rasm fayllarini yuklang.",
      }));
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

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const handleReelVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setReelErrors((prev) => ({
        ...prev,
        videoUrl: "Faqat video yuklang.",
      }));
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setReelErrors((prev) => ({
        ...prev,
        videoUrl: "Video 20MB dan kichik bo‘lishi kerak.",
      }));
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setReelForm((prev) => ({
      ...prev,
      videoUrl: objectUrl,
      isTemporary: true,
    }));

    setReelErrors((prev) => ({
      ...prev,
      videoUrl: "",
    }));
  };

  const validateProduct = () => {
    const nextErrors = {};
    if (!productForm.title.trim()) nextErrors.title = "Nomi shart.";
    if (!productForm.price.trim()) nextErrors.price = "Narx shart.";
    if (!productForm.store.trim()) nextErrors.store = "Do‘kon nomi shart.";
    if (!productForm.storeSlug.trim()) nextErrors.storeSlug = "Store slug shart.";
    if (!productForm.category.trim()) nextErrors.category = "Kategoriya shart.";
    if (!productForm.desc.trim()) nextErrors.desc = "Tavsif shart.";
    if (!productForm.images.length) nextErrors.images = "Kamida 1 ta rasm yuklang.";
    return nextErrors;
  };

  const validateReel = () => {
    const nextErrors = {};
    if (!reelForm.productId) nextErrors.productId = "Mahsulot tanlang.";
    if (!reelForm.title.trim()) nextErrors.title = "Reel nomi shart.";
    if (!reelForm.desc.trim()) nextErrors.desc = "Tavsif shart.";
    if (!reelForm.videoUrl.trim()) nextErrors.videoUrl = "Video kerak.";
    return nextErrors;
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();
    setSuccessText("");

    const validation = validateProduct();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock || 1),
      image: productForm.images[0] || "",
      images: productForm.images.slice(0, 4),
    };

    if (editingId) {
      updateProduct(editingId, payload);
      setSuccessText("Mahsulot yangilandi.");
    } else {
      addProduct(payload);
      setSuccessText("Yangi mahsulot qo‘shildi.");
    }

    resetProductForm();
  };

  const handleReelSubmit = (event) => {
    event.preventDefault();
    setSuccessText("");

    const validation = validateReel();
    setReelErrors(validation);

    if (Object.keys(validation).length > 0) return;

    addReel(reelForm);
    setSuccessText(
      reelForm.isTemporary
        ? "Reel qo‘shildi. Bu video refreshgacha ishlaydi."
        : "Reel qo‘shildi."
    );
    resetReelForm();
  };

  const handleEditProduct = (product) => {
    setEditingId(product.id);
    setActiveTab("product");
    setProductForm({
      title: product.title || "",
      price: String(product.price || ""),
      store: product.store || "",
      storeSlug: product.storeSlug || "",
      category: product.category || "",
      desc: product.desc || "",
      stock: String(product.stock || 1),
      images: Array.isArray(product.images) ? product.images.slice(0, 4) : [],
    });
  };

  return (
    <section className="mx-auto max-w-6xl py-4 sm:py-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-sm font-semibold text-teal-600">Seller dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Mahsulot va reels boshqaruvi
          </h1>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("product")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === "product"
                  ? "bg-teal-500 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Mahsulot qo‘shish
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reel")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === "reel"
                  ? "bg-teal-500 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Reel qo‘shish
            </button>
          </div>

          {successText && (
            <div className="mb-5 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
              {successText}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              {activeTab === "product" ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
                  </h2>

                  <form onSubmit={handleProductSubmit} className="mt-5 grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Mahsulot rasmlari (1–4 ta)
                      </label>

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

                      {errors.images && (
                        <p className="mt-2 text-sm text-rose-600">{errors.images}</p>
                      )}

                      {productForm.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                    </div>

                    <input
                      type="text"
                      name="title"
                      value={productForm.title}
                      onChange={handleProductChange}
                      placeholder="Mahsulot nomi"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    />
                    {errors.title && <p className="-mt-2 text-sm text-rose-600">{errors.title}</p>}

                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductChange}
                      placeholder="Narx"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    />
                    {errors.price && <p className="-mt-2 text-sm text-rose-600">{errors.price}</p>}

                    <div className="grid gap-4 sm:grid-cols-2">
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
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />

                      <input
                        type="text"
                        name="storeSlug"
                        value={productForm.storeSlug}
                        onChange={handleProductChange}
                        placeholder="store-slug"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductChange}
                        placeholder="Kategoriya"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />

                      <input
                        type="number"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleProductChange}
                        placeholder="Miqdori"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                      />
                    </div>

                    <textarea
                      name="desc"
                      rows="4"
                      value={productForm.desc}
                      onChange={handleProductChange}
                      placeholder="Tavsif"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    />

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                      >
                        {editingId ? "Saqlash" : "Mahsulot qo‘shish"}
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          onClick={resetProductForm}
                          className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h2 className="text-xl font-bold text-slate-900">Premium reel qo‘shish</h2>

                  <form onSubmit={handleReelSubmit} className="mt-5 grid gap-4">
                    <select
                      name="productId"
                      value={reelForm.productId}
                      onChange={handleReelChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    >
                      <option value="">Mahsulot tanlang</option>
                      {myProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.title}
                        </option>
                      ))}
                    </select>
                    {reelErrors.productId && (
                      <p className="-mt-2 text-sm text-rose-600">{reelErrors.productId}</p>
                    )}

                    <input
                      type="text"
                      name="title"
                      value={reelForm.title}
                      onChange={handleReelChange}
                      placeholder="Reel nomi"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    />

                    <textarea
                      name="desc"
                      rows="3"
                      value={reelForm.desc}
                      onChange={handleReelChange}
                      placeholder="Reel tavsifi"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Video yuklash (20MB gacha)
                      </label>

                      <label className="inline-flex cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Video tanlash
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleReelVideoChange}
                          className="hidden"
                        />
                      </label>

                      <p className="mt-2 text-xs text-slate-500">
                        Fayl bilan yuklangan video refreshgacha ishlaydi. Doimiy saqlash
                        uchun video URL ishlating.
                      </p>
                    </div>

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
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
                    />
                    {reelErrors.videoUrl && (
                      <p className="-mt-2 text-sm text-rose-600">{reelErrors.videoUrl}</p>
                    )}

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
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                    >
                      Reel qo‘shish
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Mening mahsulotlarim</h2>

                <div className="space-y-4">
                  {myProducts.length > 0 ? (
                    myProducts.map((product) => (
                      <div key={product.id} className="rounded-3xl border border-slate-200 p-4">
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

                          <div className="flex-1">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                  {product.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  {product.store} • {product.category}
                                </p>
                                <p className="mt-2 font-semibold text-teal-600">
                                  {Number(product.price).toLocaleString("uz-UZ")} so'm
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  Rasmlar: {product.images?.length || 1} ta
                                </p>
                              </div>

                              <div className="flex flex-col gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditProduct(product)}
                                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Tahrirlash
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleProductStatus(product.id)}
                                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  {product.isActive ? "Nofaol qilish" : "Faol qilish"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => deleteProduct(product.id)}
                                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                                >
                                  O‘chirish
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
                      Hozircha mahsulot yo‘q.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Mening reelslarim</h2>

                <div className="space-y-4">
                  {myReels.length > 0 ? (
                    myReels.map((reel) => (
                      <div key={reel.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-slate-900">{reel.title}</h3>
                            <p className="mt-1 text-sm text-slate-500">{reel.author}</p>
                            <p className="mt-2 text-sm text-slate-600">{reel.desc}</p>

                            {reel.videoUrl && (
                              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-black">
                                <video
                                  src={reel.videoUrl}
                                  controls
                                  className="h-40 w-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => toggleReelStatus(reel.id)}
                              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              {reel.isActive ? "Nofaol qilish" : "Faol qilish"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteReel(reel.id)}
                              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                            >
                              O‘chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
                      Hozircha reel yo‘q.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}