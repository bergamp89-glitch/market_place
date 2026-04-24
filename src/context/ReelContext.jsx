import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductContext";

const ReelContext = createContext();

const STORAGE_KEY = "tealmarket_reels_v4";

const defaultReels = [
  {
    id: 1,
    productId: 101,
    author: "Tech Store",
    ownerName: "System",
    title: "Premium smartfon yaqin ko‘rinishda",
    desc: "Kamera, dizayn va premium feeling bir videoda.",
    videoUrl: "",
    likes: 1240,
    saves: 210,
    comments: 34,
    isActive: true,
    isCustom: false,
    isTemporary: false,
  },
  {
    id: 2,
    productId: 102,
    author: "Audio Shop",
    ownerName: "System",
    title: "Wireless quloqchin sound test",
    desc: "Ovoz sifati va premium case ko‘rinishi.",
    videoUrl: "",
    likes: 980,
    saves: 160,
    comments: 22,
    isActive: true,
    isCustom: false,
    isTemporary: false,
  },
];

function readPersistentReels() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function ReelProvider({ children }) {
  const { currentUser } = useAuth();
  const { allProducts } = useProducts();

  const [persistentCustomReels, setPersistentCustomReels] = useState(() =>
    readPersistentReels()
  );
  const [sessionReels, setSessionReels] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentCustomReels));
    } catch {
      //
    }
  }, [persistentCustomReels]);

  const allReels = useMemo(() => {
    return [...sessionReels, ...persistentCustomReels, ...defaultReels];
  }, [sessionReels, persistentCustomReels]);

  const addReel = (payload) => {
    const relatedProduct =
      allProducts.find((item) => Number(item.id) === Number(payload?.productId)) || null;

    const nextReel = {
      id: payload?.id || Date.now(),
      productId: Number(payload?.productId || 0),
      author: relatedProduct?.store || payload?.author || currentUser?.name || "Do'kon",
      ownerName: currentUser?.name || payload?.ownerName || "Unknown",
      title: String(payload?.title || "").trim(),
      desc: String(payload?.desc || "").trim(),
      videoUrl: String(payload?.videoUrl || "").trim(),
      likes: Number(payload?.likes || 0),
      saves: Number(payload?.saves || 0),
      comments: Number(payload?.comments || 0),
      isActive: payload?.isActive !== false,
      isCustom: true,
      isTemporary: Boolean(payload?.isTemporary),
    };

    if (nextReel.isTemporary || nextReel.videoUrl.startsWith("blob:")) {
      setSessionReels((prev) => [nextReel, ...prev]);
    } else {
      setPersistentCustomReels((prev) => [nextReel, ...prev]);
    }

    return nextReel;
  };

  const deleteReel = (reelId) => {
    setPersistentCustomReels((prev) => prev.filter((reel) => reel.id !== reelId));
    setSessionReels((prev) => prev.filter((reel) => reel.id !== reelId));
  };

  const toggleReelStatus = (reelId) => {
    setPersistentCustomReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isActive: !reel.isActive } : reel
      )
    );

    setSessionReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isActive: !reel.isActive } : reel
      )
    );
  };

  const value = useMemo(
    () => ({
      allReels,
      customReels: [...sessionReels, ...persistentCustomReels],
      addReel,
      deleteReel,
      toggleReelStatus,
    }),
    [allReels, sessionReels, persistentCustomReels]
  );

  return <ReelContext.Provider value={value}>{children}</ReelContext.Provider>;
}

export function useReelsData() {
  return useContext(ReelContext);
}