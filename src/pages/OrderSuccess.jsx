import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <section className="mx-auto max-w-4xl py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold text-teal-600">Buyurtma muvaffaqiyatli</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Buyurtmangiz qabul qilindi
        </h1>
        <p className="mt-3 text-slate-500">
          Tez orada siz bilan bog‘lanamiz. Buyurtmalar tarixini ko‘rishingiz mumkin.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600"
          >
            Buyurtmalarim
          </Link>

          <Link
            to="/market"
            className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Xaridni davom ettirish
          </Link>
        </div>
      </div>
    </section>
  );
}