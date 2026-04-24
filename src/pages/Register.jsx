import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, currentUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
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

    if (!form.name.trim()) {
      setErrorText("Ism kiritilishi shart.");
      return;
    }

    if (!form.phone.trim()) {
      setErrorText("Telefon raqam kiritilishi shart.");
      return;
    }

    if (!form.password.trim()) {
      setErrorText("Parol kiritilishi shart.");
      return;
    }

    if (form.password.length < 4) {
      setErrorText("Parol kamida 4 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorText("Parollar bir xil emas.");
      return;
    }

    setIsLoading(true);

    const result = register({
      name: form.name,
      phone: form.phone,
      password: form.password,
      role: form.role,
    });

    if (!result.success) {
      setErrorText(result.error || "Ro‘yxatdan o‘tishda xatolik yuz berdi.");
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
          <p className="text-sm font-semibold text-teal-600">Ro‘yxatdan o‘tish</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Yangi hisob yarating
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Telefon raqam orqali yangi profil oching.
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
                Ism
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ismingiz"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              />
            </div>

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
                Hisob turi
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              >
                <option value="user">Foydalanuvchi</option>
                <option value="seller">Seller</option>
              </select>
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
                placeholder="Parol"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Parolni tasdiqlang
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Parolni qayta kiriting"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Yaratilmoqda..." : "Ro‘yxatdan o‘tish"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Hisobingiz bormi?{" "}
            <Link
              to="/login"
              className="font-semibold text-teal-600 transition hover:text-teal-700"
            >
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}