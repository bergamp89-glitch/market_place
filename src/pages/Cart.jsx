import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;
}

function normalizeCardNumber(value = "") {
  return value.replace(/\D/g, "").slice(0, 16);
}

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems = [],
    totalItems = 0,
    totalPrice = 0,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { addOrder } = useOrders();
  const { currentUser } = useAuth();

  const [customer, setCustomer] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    deliveryAddress: "",
    paymentType: "Naqd",
    cardNumber: "",
  });

  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryPrice = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return totalPrice >= 500000 ? 0 : 25000;
  }, [cartItems.length, totalPrice]);

  const finalPrice = totalPrice + deliveryPrice;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "cardNumber") {
      setCustomer((prev) => ({
        ...prev,
        cardNumber: normalizeCardNumber(value),
      }));
      return;
    }

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    setErrorText("");
    setSuccessText("");

    if (!cartItems.length) {
      setErrorText("Savat bo‘sh.");
      return;
    }

    if (!customer.name.trim()) {
      setErrorText("Ism kiritilishi shart.");
      return;
    }

    if (!customer.phone.trim()) {
      setErrorText("Telefon raqam kiritilishi shart.");
      return;
    }

    if (!customer.deliveryAddress.trim()) {
      setErrorText("Yetkazib berish manzili kiritilishi shart.");
      return;
    }

    if (customer.paymentType === "Karta") {
      if (!customer.cardNumber.trim()) {
        setErrorText("Karta orqali to‘lov uchun karta raqami kiritilishi shart.");
        return;
      }

      if (customer.cardNumber.trim().length < 16) {
        setErrorText("Karta raqami 16 ta raqamdan iborat bo‘lishi kerak.");
        return;
      }
    }

    setIsSubmitting(true);

    const newOrder = addOrder({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
      },
      deliveryAddress: customer.deliveryAddress.trim(),
      paymentType: customer.paymentType,
      cardNumber: customer.paymentType === "Karta" ? customer.cardNumber.trim() : "",
      items: cartItems.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      })),
      totalItems,
      productsPrice: totalPrice,
      deliveryPrice,
      totalPrice: finalPrice,
    });

    clearCart?.();
    setSuccessText("Buyurtma muvaffaqiyatli yuborildi.");
    setIsSubmitting(false);

    navigate("/orders", { state: { orderId: newOrder.id } });
  };

  if (!cartItems.length) {
    return (
      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 text-center sm:p-10">
            <p className="text-sm font-semibold text-teal-600">Savat</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Savatingiz bo‘sh
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Mahsulot qo‘shganingizdan keyin shu yerda ko‘rinadi.
            </p>

            <Link
              to="/market"
              className="mt-5 inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Marketga o‘tish
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-sm font-semibold text-teal-600">Savat</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Buyurtmani rasmiylashtirish
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Savatdagi mahsulotlar va yetkazib berish ma’lumotlari.
          </p>
        </div>

        <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        Rasm yo‘q
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-500">
                          {item.store}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {item.category}
                        </p>
                        <p className="mt-3 text-lg font-bold text-slate-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity?.(item.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            −
                          </button>

                          <div className="flex h-10 min-w-12 items-center justify-center rounded-2xl bg-slate-50 px-3 text-sm font-semibold text-slate-900">
                            {item.quantity || 1}
                          </div>

                          <button
                            type="button"
                            onClick={() => increaseQuantity?.(item.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-300 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart?.(item.id)}
                          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Olib tashlash
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => clearCart?.()}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Savatni tozalash
              </button>

              <Link
                to="/market"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                Marketga qaytish
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-xl font-bold text-slate-900">Buyurtma ma’lumoti</h2>

              {errorText && (
                <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                  {errorText}
                </div>
              )}

              {successText && (
                <div className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700">
                  {successText}
                </div>
              )}

              <form onSubmit={handleCheckout} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ism
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
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
                    value={customer.phone}
                    onChange={handleChange}
                    placeholder="998901234567"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Manzil
                  </label>
                  <textarea
                    name="deliveryAddress"
                    rows="3"
                    value={customer.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Yetkazib berish manzili"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    To‘lov turi
                  </label>
                  <select
                    name="paymentType"
                    value={customer.paymentType}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  >
                    <option value="Naqd">Naqd</option>
                    <option value="Karta">Karta</option>
                    <option value="Click / Payme">Click / Payme</option>
                  </select>
                </div>

                {customer.paymentType === "Karta" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Karta raqami
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={customer.cardNumber}
                      onChange={handleChange}
                      placeholder="8600123412341234"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      16 ta raqam kiriting.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Buyurtma berish"}
                </button>
              </form>
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h3 className="text-lg font-bold text-slate-900">Hisob-kitob</h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Mahsulotlar</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {totalItems} ta
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Mahsulotlar summasi</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Yetkazib berish</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {deliveryPrice === 0 ? "Bepul" : formatPrice(deliveryPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-4">
                  <span className="text-sm font-medium text-white">Jami</span>
                  <span className="text-lg font-bold text-white">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}