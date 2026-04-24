import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { useReelsData } from "../context/ReelContext";
import { useProducts } from "../context/ProductContext";
import SmartVideo from "../components/SmartVideo";
import ReelModal from "../components/ReelModal";

const reelThemes = [
  "from-fuchsia-500 via-rose-500 to-orange-400",
  "from-cyan-500 via-sky-500 to-indigo-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-violet-500 via-purple-500 to-fuchsia-500",
];

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

export default function Reels() {
  const { allReels } = useReelsData();
  const { allProducts } = useProducts();
  const [activeIndex, setActiveIndex] = useState(null);

  const preparedReels = useMemo(() => {
    return allReels
      .filter((item) => item.isActive !== false)
      .map((reel, index) => ({
        ...reel,
        theme: reelThemes[index % reelThemes.length],
      }));
  }, [allReels]);

  if (!preparedReels.length) {
    return (
      <section className="mx-auto max-w-7xl py-4 sm:py-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-teal-600">Reels</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Hozircha reel yo‘q</h1>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl py-4 sm:py-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-teal-600">Reels</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  Premium reels sahifasi
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Reelslar 4 tadan qator bo‘lib chiqadi va keyin pastga davom etadi.
                </p>
              </div>

              <Link
                to="/"
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Bosh sahifa
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {preparedReels.map((reel, index) => {
                const product =
                  allProducts.find((item) => item.id === Number(reel.productId)) || null;

                return (
                  <button
                    key={reel.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-[32rem] overflow-hidden rounded-[26px] bg-slate-950">
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

                      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold backdrop-blur">
                            {getInitial(reel.author)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold">{reel.author}</p>
                            <p className="text-xs text-white/70">Do‘kon profili</p>
                          </div>
                        </div>

                        <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                          Premium
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-4 text-white">
                        <div className="max-w-[72%]">
                          <h3 className="line-clamp-2 text-lg font-bold">{reel.title}</h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/90">
                            {reel.desc}
                          </p>

                          {product && (
                            <div className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-2 text-xs font-semibold backdrop-blur">
                              {product.title}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                              <Heart size={18} />
                            </div>
                            <span className="text-xs font-medium">
                              {formatCount(parseCount(reel.likes))}
                            </span>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                              <MessageCircle size={18} />
                            </div>
                            <span className="text-xs font-medium">
                              {formatCount(parseCount(reel.comments || 0))}
                            </span>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                              <Send size={18} />
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                              <Bookmark size={18} />
                            </div>
                            <span className="text-xs font-medium">
                              {formatCount(parseCount(reel.saves))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ReelModal
        reels={preparedReels}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </>
  );
}