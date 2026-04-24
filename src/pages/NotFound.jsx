import { Link } from "react-router-dom";

/*
  NotFound - mavjud bo‘lmagan route lar uchun 404 sahifa.
*/

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-teal-700">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Sahifa topilmadi
        </h1>
        <p className="mt-4 text-slate-600">
          Siz kirmoqchi bo‘lgan sahifa mavjud emas yoki o‘chirilgan.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-teal-600 px-5 py-3 font-medium text-white transition hover:bg-teal-700"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}