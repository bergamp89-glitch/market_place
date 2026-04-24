import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser } = useAuth();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorText("");
    setIsLoading(true);

    const result = login({
      phone: form.phone,
      password: form.password,
    });

    if (!result.success) {
      setErrorText(result.error || "Kirishda xatolik yuz berdi.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    navigate("/profile", { replace: true });
  };

  return (
    <section className="mx-auto max-w-md py-6 sm:py-10">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <p className="text-sm font-semibold text-teal-600">Kirish</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Hisobingizga kiring
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Telefon raqam va parol orqali tizimga kiring.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {errorText && (
            <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {errorText}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Telefon raqam
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="998901234567"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Parol
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Parolingiz"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Demo hisoblar
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Admin:</span>{" "}
                998900000001 / admin123
              </p>
              <p>
                <span className="font-semibold text-slate-900">Seller:</span>{" "}
                998900000002 / seller123
              </p>
              <p>
                <span className="font-semibold text-slate-900">User:</span>{" "}
                998900000003 / user123
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Hisobingiz yo‘qmi?{" "}
            <Link
              to="/register"
              className="font-semibold text-teal-600 transition hover:text-teal-700"
            >
              Ro‘yxatdan o‘tish
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}