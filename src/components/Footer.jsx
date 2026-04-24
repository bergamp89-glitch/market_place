import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500 text-lg font-bold text-white shadow-sm">
                T
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">TealMarket</h2>
                <p className="text-sm text-slate-500">market + reels platform</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Qisqa reels, premium mahsulot kartalari, do‘kon bilan yozishma va
              savdo jarayonini bir joyga jamlagan zamonaviy marketplace.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                <ShieldCheck size={14} />
                Premium UI
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                Tezkor market
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                Reels support
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Sahifalar
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link to="/" className="transition hover:text-teal-600">
                Bosh sahifa
              </Link>
              <Link to="/reels" className="transition hover:text-teal-600">
                Reels
              </Link>
              <Link to="/market" className="transition hover:text-teal-600">
                Market
              </Link>
              <Link to="/favorites" className="transition hover:text-teal-600">
                Sevimlilar
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
              Foydalanuvchi
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link to="/profile" className="transition hover:text-teal-600">
                Profil
              </Link>
              <Link to="/cart" className="transition hover:text-teal-600">
                Savat
              </Link>
              <Link to="/orders" className="transition hover:text-teal-600">
                Buyurtmalar
              </Link>
              <Link to="/messages" className="transition hover:text-teal-600">
                Xabarlar
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TealMarket. Barcha huquqlar himoyalangan.</p>
          <p>Zamonaviy marketplace va reels tajribasi.</p>
        </div>
      </div>
    </footer>
  );
}