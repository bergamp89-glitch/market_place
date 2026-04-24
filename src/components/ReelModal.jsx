import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  Search,
  Send,
  Volume2,
  VolumeX,
  X,
  ArrowLeft,
} from "lucide-react";
import SmartVideo from "./SmartVideo";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useProducts } from "../context/ProductContext";

const defaultComments = {
  1: [
    { id: 101, author: "techfan", text: "Kamera juda premium ko‘rinyapti." },
    { id: 102, author: "mobilelover", text: "Do‘kon videoni chiroyli qilgan." },
  ],
  2: [{ id: 201, author: "audiouz", text: "Sound test juda yoqdi." }],
};

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

export default function ReelModal({ reels = [], activeIndex, setActiveIndex }) {
  const { currentUser } = useAuth();
  const { chats, sendSharedReel } = useChat();
  const { allProducts } = useProducts();

  const [showCommentsMobile, setShowCommentsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [commentText, setCommentText] = useState("");
  const [commentsMap, setCommentsMap] = useState(defaultComments);
  const [shareState, setShareState] = useState({
    isOpen: false,
    reel: null,
    product: null,
  });
  const [shareSearch, setShareSearch] = useState("");
  const [shareNotice, setShareNotice] = useState("");

  const modalVideoRef = useRef(null);

  const activeReel =
    activeIndex !== null && reels[activeIndex] ? reels[activeIndex] : null;

  const activeProduct = useMemo(() => {
    if (!activeReel) return null;
    return allProducts.find((item) => item.id === Number(activeReel.productId)) || null;
  }, [activeReel, allProducts]);

  const filteredChats = useMemo(() => {
    const query = shareSearch.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter((chat) =>
      String(chat.name || chat.title || "").toLowerCase().includes(query)
    );
  }, [chats, shareSearch]);

  useEffect(() => {
    if (activeReel || shareState.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeReel, shareState.isOpen]);

  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;

    video.muted = isMuted;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        //
      }
    };

    tryPlay();
  }, [isMuted, activeReel]);

  useEffect(() => {
    if (!shareNotice) return;
    const timer = setTimeout(() => setShareNotice(""), 2000);
    return () => clearTimeout(timer);
  }, [shareNotice]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (shareState.isOpen && event.key === "Escape") {
        setShareState({ isOpen: false, reel: null, product: null });
        return;
      }

      if (activeIndex === null) return;

      if (event.key === "Escape") {
        setActiveIndex(null);
        setShowCommentsMobile(false);
        setCommentText("");
      }

      if (event.key === "ArrowDown") {
        setActiveIndex((prev) =>
          prev === null ? 0 : prev === reels.length - 1 ? 0 : prev + 1
        );
        setShowCommentsMobile(false);
      }

      if (event.key === "ArrowUp") {
        setActiveIndex((prev) =>
          prev === null ? 0 : prev === 0 ? reels.length - 1 : prev - 1
        );
        setShowCommentsMobile(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reels.length, setActiveIndex, shareState.isOpen]);

  const nextReel = () => {
    setActiveIndex((prev) =>
      prev === null ? 0 : prev === reels.length - 1 ? 0 : prev + 1
    );
    setShowCommentsMobile(false);
  };

  const prevReel = () => {
    setActiveIndex((prev) =>
      prev === null ? 0 : prev === 0 ? reels.length - 1 : prev - 1
    );
    setShowCommentsMobile(false);
  };

  const closeModal = () => {
    setActiveIndex(null);
    setShowCommentsMobile(false);
    setCommentText("");
  };

  const toggleLike = (reelId) => {
    setLikedMap((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const toggleSave = (reelId) => {
    setSavedMap((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const getLikeText = (reel) => {
    const base = parseCount(reel.likes);
    const value = likedMap[reel.id] ? base + 1 : base;
    return formatCount(value);
  };

  const getSaveText = (reel) => {
    const base = parseCount(reel.saves);
    const value = savedMap[reel.id] ? base + 1 : base;
    return formatCount(value);
  };

  const getComments = (reelId) => commentsMap[reelId] || [];
  const getCommentCount = (reelId) => getComments(reelId).length;

  const handleAddComment = (event) => {
    event.preventDefault();
    if (!activeReel || !commentText.trim()) return;

    const author = currentUser?.name || "siz";
    const nextComment = {
      id: Date.now(),
      author,
      text: commentText.trim(),
    };

    setCommentsMap((prev) => ({
      ...prev,
      [activeReel.id]: [...(prev[activeReel.id] || []), nextComment],
    }));

    setCommentText("");
  };

  const openSharePanel = (reel, product) => {
    setShareSearch("");
    setShareState({ isOpen: true, reel, product });
  };

  const closeSharePanel = () => {
    setShareSearch("");
    setShareState({ isOpen: false, reel: null, product: null });
  };

  const handleShareToChat = (chatId) => {
    if (!shareState.reel || typeof sendSharedReel !== "function") return;
    sendSharedReel(chatId, shareState.reel, shareState.product);
    setShareNotice("Reel yuborildi.");
    closeSharePanel();
  };

  const handleCopyLink = async () => {
    if (!shareState.product?.id) return;
    const link = `${window.location.origin}/product/${shareState.product.id}`;

    try {
      await navigator.clipboard.writeText(link);
      setShareNotice("Link nusxalandi.");
    } catch {
      setShareNotice("Link nusxalanmadi.");
    }
  };

  const handleSystemShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share || !shareState.reel) return;

    const link = shareState.product?.id
      ? `${window.location.origin}/product/${shareState.product.id}`
      : `${window.location.origin}/reels`;

    try {
      await navigator.share({
        title: shareState.reel.title,
        text: shareState.reel.desc,
        url: link,
      });
      closeSharePanel();
    } catch {
      //
    }
  };

  if (!activeReel) return null;

  return (
    <>
      {shareNotice && (
        <div className="fixed left-1/2 top-24 z-[70] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {shareNotice}
        </div>
      )}

      <div className="fixed inset-0 z-50 bg-black/90 p-3 sm:p-4">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
          <div className="relative flex h-[92vh] w-full overflow-hidden rounded-[30px] bg-black shadow-2xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute left-4 top-4 z-30 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft size={16} />
              Chiqish
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              onClick={prevReel}
              className="absolute left-1/2 top-4 z-30 hidden -translate-x-1/2 items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20 md:flex"
            >
              <ChevronUp size={20} />
            </button>

            <button
              type="button"
              onClick={nextReel}
              className="absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20 md:flex"
            >
              <ChevronDown size={20} />
            </button>

            <div className="relative flex-1 bg-slate-950">
              <SmartVideo
                src={activeReel.videoUrl}
                muted={isMuted}
                loop
                autoPlay
                fallbackTheme={activeReel.theme}
                videoRef={modalVideoRef}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/95 to-transparent" />

              <div className="absolute left-4 right-4 top-16 z-20 flex items-center justify-between text-white sm:top-4 sm:right-16">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold backdrop-blur">
                    {getInitial(activeReel.author)}
                  </div>

                  <div>
                    <p className="font-semibold">{activeReel.author}</p>
                    <p className="text-xs text-white/70">Do‘kon hisobidan reel</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>

              <div className="absolute bottom-5 left-4 right-4 z-20 flex items-end justify-between gap-4 text-white">
                <div className="max-w-[72%]">
                  <h3 className="text-2xl font-bold">{activeReel.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/90">{activeReel.desc}</p>

                  {activeProduct && (
                    <div className="mt-4 rounded-2xl bg-white/15 p-3 backdrop-blur">
                      <p className="text-xs text-white/70">{activeProduct.store}</p>
                      <Link
                        to={`/product/${activeProduct.id}`}
                        className="mt-1 block font-semibold transition hover:text-teal-100"
                      >
                        {activeProduct.title}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeReel.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                      <Heart
                        size={22}
                        fill={likedMap[activeReel.id] ? "currentColor" : "none"}
                      />
                    </div>
                    <span className="text-sm font-medium">{getLikeText(activeReel)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCommentsMobile(!showCommentsMobile)}
                    className="flex flex-col items-center gap-1 md:hidden"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                      <MessageCircle size={22} />
                    </div>
                    <span className="text-sm font-medium">
                      {getCommentCount(activeReel.id)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openSharePanel(activeReel, activeProduct)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                      <Send size={22} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSave(activeReel.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                      <Bookmark
                        size={22}
                        fill={savedMap[activeReel.id] ? "currentColor" : "none"}
                      />
                    </div>
                    <span className="text-sm font-medium">{getSaveText(activeReel)}</span>
                  </button>
                </div>
              </div>
            </div>

            <aside className="hidden w-[360px] flex-col border-l border-slate-200 bg-white md:flex">
              <div className="border-b border-slate-200 p-4">
                <h3 className="text-lg font-bold text-slate-900">Izohlar</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {getCommentCount(activeReel.id)} ta fikr
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {getComments(activeReel.id).length > 0 ? (
                  getComments(activeReel.id).map((comment) => (
                    <div key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                          {getInitial(comment.author)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {comment.author}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Hozircha izoh yo‘q.
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="border-t border-slate-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Izoh yozing..."
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                  >
                    Yuborish
                  </button>
                </div>
              </form>
            </aside>

            {showCommentsMobile && (
              <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-white p-5 shadow-2xl md:hidden">
                <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-slate-300" />

                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900">Izohlar</h4>
                  <button
                    type="button"
                    onClick={() => setShowCommentsMobile(false)}
                    className="text-2xl text-slate-500"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                  {getComments(activeReel.id).length > 0 ? (
                    getComments(activeReel.id).map((comment) => (
                      <div key={comment.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                        <p className="mt-1 text-sm text-slate-600">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                      Hozircha izoh yo‘q.
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Izoh yozing..."
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                  >
                    Yuborish
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {shareState.isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60" onClick={closeSharePanel}>
          <div
            className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl rounded-t-3xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-slate-300" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Ulashish</p>
                <h3 className="text-xl font-bold text-slate-900">Kimga yuboriladi?</h3>
              </div>

              <button
                type="button"
                onClick={closeSharePanel}
                className="text-2xl text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                value={shareSearch}
                onChange={(event) => setShareSearch(event.target.value)}
                placeholder="Qidirish"
                className="w-full text-sm outline-none"
              />
            </div>

            <div className="mt-5 overflow-x-auto">
              <div className="flex min-w-max gap-4 pb-2">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <div key={chat.id} className="w-24 shrink-0 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-bold text-slate-700">
                        {chat.avatar ? (
                          <img
                            src={chat.avatar}
                            alt={chat.name || chat.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitial(chat.name || chat.title)
                        )}
                      </div>

                      <p className="mt-2 line-clamp-1 text-xs font-medium text-slate-700">
                        {chat.name || chat.title}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleShareToChat(chat.id)}
                        className="mt-2 rounded-full bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-600"
                      >
                        Yuborish
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Chat topilmadi.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  type="button"
                  onClick={handleSystemShare}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Telefon orqali ulashish
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Linkni nusxalash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}