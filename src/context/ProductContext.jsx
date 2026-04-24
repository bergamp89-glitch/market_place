import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();

const STORAGE_KEY = "tealmarket_products_v5";

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function normalizeImages(images = [], fallbackImage = "") {
  const clean = Array.isArray(images)
    ? images.filter(Boolean).slice(0, 4)
    : [];

  if (clean.length > 0) return clean;
  if (fallbackImage) return [fallbackImage];
  return [];
}

function normalizeProduct(product, currentUserName = "Unknown") {
  const images = normalizeImages(product.images, product.image);

  return {
    id: product.id || Date.now(),
    title: String(product.title || "").trim(),
    price: Number(product.price || 0),
    image: images[0] || "",
    images,
    desc: String(product.desc || "").trim(),
    category: String(product.category || "").trim() || "Boshqa",
    store: String(product.store || "").trim() || "Do'kon",
    storeSlug:
      String(product.storeSlug || "").trim() ||
      slugify(product.store || currentUserName || "my-shop"),
    stock: Number(product.stock || 1),
    rating: Number(product.rating || 4.8),
    isActive: product.isActive !== false,
    isCustom: product.isCustom === true,
    ownerName: product.ownerName || currentUserName,
  };
}

const defaultProductsRaw = [
  {
    id: 101,
    title: "Premium Smartfon",
    price: 4200000,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Kuchli kamera, premium dizayn va kundalik foydalanish uchun qulay smartfon.",
    category: "Texnika",
    store: "Tech Store",
    storeSlug: "tech-store",
    stock: 12,
    rating: 4.8,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 102,
    title: "Wireless Quloqchin",
    price: 650000,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Sifatli ovoz va uzoq quvvat ushlash imkoniyatiga ega zamonaviy quloqchin.",
    category: "Aksesuar",
    store: "Audio Shop",
    storeSlug: "audio-shop",
    stock: 20,
    rating: 4.7,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 103,
    title: "Smart Watch",
    price: 980000,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Sog‘liq nazorati, qo‘ng‘iroq bildirishnomalari va sport rejimlari bilan aqlli soat.",
    category: "Texnika",
    store: "Tech Store",
    storeSlug: "tech-store",
    stock: 15,
    rating: 4.6,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 104,
    title: "Gaming Klaviatura",
    price: 730000,
    images: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "RGB yoritish va qulay tugmalar bilan gamerlar uchun maxsus klaviatura.",
    category: "Texnika",
    store: "Game Hub",
    storeSlug: "game-hub",
    stock: 9,
    rating: 4.9,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 105,
    title: "Bluetooth Speaker",
    price: 540000,
    images: [
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Kuchli bass va ixcham korpusga ega portativ speaker.",
    category: "Aksesuar",
    store: "Audio Shop",
    storeSlug: "audio-shop",
    stock: 18,
    rating: 4.5,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 106,
    title: "Fast Charger",
    price: 180000,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Tez quvvatlashni qo‘llab-quvvatlaydigan mustahkam adapter.",
    category: "Aksesuar",
    store: "Mobile Market",
    storeSlug: "mobile-market",
    stock: 30,
    rating: 4.4,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 107,
    title: "Office Chair",
    price: 1250000,
    images: [
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Orqa suyanchiqli, qulay va zamonaviy ofis stuli.",
    category: "Uy jihozlari",
    store: "Home Space",
    storeSlug: "home-space",
    stock: 7,
    rating: 4.6,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 108,
    title: "Desk Lamp",
    price: 220000,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Ish stoli uchun chiroyli va yorug‘lik darajasi boshqariladigan lampa.",
    category: "Uy jihozlari",
    store: "Home Space",
    storeSlug: "home-space",
    stock: 25,
    rating: 4.3,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },

  // +5 yangi mahsulot
  {
    id: 109,
    title: "Laptop Backpack",
    price: 390000,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Noutbuk va kundalik buyumlar uchun premium backpack.",
    category: "Aksesuar",
    store: "Urban Carry",
    storeSlug: "urban-carry",
    stock: 14,
    rating: 4.7,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 110,
    title: "Mechanical Keyboard",
    price: 990000,
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "RGB yoritish va premium switchlar bilan mexanik klaviatura.",
    category: "Texnika",
    store: "Game Hub",
    storeSlug: "game-hub",
    stock: 11,
    rating: 4.8,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 111,
    title: "Air Fryer",
    price: 1350000,
    images: [
      "https://images.unsplash.com/photo-1585515656903-24d77707b93c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601315488950-3b5047998b38?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Kam yog‘ bilan tez va mazali pishiradigan zamonaviy air fryer.",
    category: "Uy jihozlari",
    store: "Kitchen Life",
    storeSlug: "kitchen-life",
    stock: 8,
    rating: 4.7,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 112,
    title: "Wireless Mouse",
    price: 240000,
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Ofis va uy uchun qulay ergonomik wireless mouse.",
    category: "Texnika",
    store: "Office Tech",
    storeSlug: "office-tech",
    stock: 19,
    rating: 4.5,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
  {
    id: 113,
    title: "Ceramic Coffee Set",
    price: 275000,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    ],
    desc: "Uy va ofis uchun nafis ko‘rinishdagi keramik coffee set.",
    category: "Uy jihozlari",
    store: "Kitchen Life",
    storeSlug: "kitchen-life",
    stock: 16,
    rating: 4.6,
    isActive: true,
    isCustom: false,
    ownerName: "System",
  },
];

function readCustomProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function ProductProvider({ children }) {
  const { currentUser } = useAuth();
  const [customProducts, setCustomProducts] = useState(() =>
    readCustomProducts().map((item) =>
      normalizeProduct(item, item.ownerName || currentUser?.name || "Unknown")
    )
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customProducts));
    } catch {
      //
    }
  }, [customProducts]);

  const defaultProducts = useMemo(
    () => defaultProductsRaw.map((item) => normalizeProduct(item, "System")),
    []
  );

  const allProducts = useMemo(() => {
    return [...customProducts, ...defaultProducts];
  }, [customProducts, defaultProducts]);

  const addProduct = (payload) => {
    const nextProduct = normalizeProduct(
      {
        ...payload,
        id: payload?.id || Date.now(),
        isCustom: true,
        ownerName: currentUser?.name || payload?.ownerName || "Unknown",
      },
      currentUser?.name || "Unknown"
    );

    setCustomProducts((prev) => [nextProduct, ...prev]);
    return nextProduct;
  };

  const updateProduct = (productId, updates) => {
    setCustomProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;

        return normalizeProduct(
          {
            ...product,
            ...updates,
            id: product.id,
            isCustom: true,
            ownerName: product.ownerName,
          },
          product.ownerName || currentUser?.name || "Unknown"
        );
      })
    );
  };

  const deleteProduct = (productId) => {
    setCustomProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const toggleProductStatus = (productId) => {
    setCustomProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, isActive: !product.isActive }
          : product
      )
    );
  };

  const getProductById = (productId) => {
    return allProducts.find((product) => Number(product.id) === Number(productId)) || null;
  };

  const getProductsByStoreSlug = (storeSlug) => {
    return allProducts.filter(
      (product) =>
        String(product.storeSlug || "").toLowerCase() ===
        String(storeSlug || "").toLowerCase()
    );
  };

  const value = useMemo(
    () => ({
      allProducts,
      customProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductStatus,
      getProductById,
      getProductsByStoreSlug,
    }),
    [allProducts, customProducts]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  return useContext(ProductContext);
}