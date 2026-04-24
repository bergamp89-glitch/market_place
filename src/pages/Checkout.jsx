import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useAddresses } from "../context/AddressContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();
  const { addresses, selectedAddressId, selectAddress, selectedAddress } = useAddresses();

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: "",
    paymentType: "Naqd",
    note: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedAddress) {
      setFormData((prev) => ({
        ...prev,
        fullName: selectedAddress.recipient || prev.fullName,
        phone: selectedAddress.phone || prev.phone,
        address: `${selectedAddress.region}, ${selectedAddress.district}, ${selectedAddress.addressLine}${
          selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ""
        }`,
      }));
    }
  }, [selectedAddress]);

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-4xl py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Avval tizimga kiring</h1>
          <p className="mt-2 text-slate-500">
            Buyurtma berish uchun hisobga kirishingiz kerak.
          </p>

          <Link
            to="/login"
            className="mt-5 inline-block rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600"
          >
            Kirish
          </Link>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-4xl py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Savat bo‘sh</h1>
          <p className="mt-2 text-slate-500">
            Checkout qilish uchun savatda mahsulot bo‘lishi kerak.
          </p>

          <Link
            to="/market"
            className="mt-5 inline-block rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600"
          >
            Marketga o‘tish
          </Link>
        </div>
      </section>
    );
  }

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "phone") {
      value = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ism va familiya kiritilishi shart.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon raqam kiritilishi shart.";
    } else if (formData.phone.length < 9) {
      newErrors.phone = "Telefon raqam to‘liq emas.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Yetkazib berish manzili kiritilishi shart.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    placeOrder({
      customer: {
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
      },
      items: cartItems,
      totalPrice,
      deliveryAddress: formData.address.trim(),
      paymentType: formData.paymentType,
      note: formData.note.trim(),
    });

    clearCart();
    navigate("/order-success");
  };

  return (
    <section className="mx-auto max-w-6xl py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal-600">Checkout bo‘limi</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Buyurtma berish</h1>
        <p className="mt-2 text-slate-600">
          Buyurtmangizni tasdiqlash uchun ma’lumotlarni to‘ldiring.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          {addresses.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Saqlangan manzil
              </label>
              <select
                value={selectedAddressId || ""}
                onChange={(e) => selectAddress(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
              >
                <option value="">Manzil tanlang</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.title} — {address.region}, {address.district}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ism va familiya
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-rose-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Telefon raqam
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-rose-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Yetkazib berish manzili
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
            />
            {errors.address && (
              <p className="mt-2 text-sm text-rose-600">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              To‘lov turi
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
            >
              <option value="Naqd">Naqd</option>
              <option value="Karta">Karta</option>
              <option value="Yetkazganda to‘lash">Yetkazganda to‘lash</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Izoh
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-white transition hover:bg-teal-600"
          >
            Buyurtmani tasdiqlash
          </button>
        </form>

        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Buyurtma xulosasi</h2>

          <div className="mt-5 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">Soni: {item.qty}</p>
                </div>

                <p className="font-semibold text-teal-600">
                  {(item.price * item.qty).toLocaleString("uz-UZ")} so'm
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Mahsulotlar soni</span>
              <span>{totalItems} ta</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Yetkazib berish</span>
              <span>Bepul</span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between text-base font-bold text-slate-900">
                <span>Jami</span>
                <span>{totalPrice.toLocaleString("uz-UZ")} so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}