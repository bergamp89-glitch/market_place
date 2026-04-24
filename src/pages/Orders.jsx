import { Link, useLocation } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("uz-UZ")} so'm`;
}

export default function Orders() {
  const location = useLocation();
  const { orders, clearOrders, removeOrder } = useOrders();

  const highlightedOrderId = location.state?.orderId || null;

  return (
    <section className="mx-auto max-w-6xl py-4 sm:py-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-teal-600">Buyurtmalar</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Buyurtmalar tarixi
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Jami: {orders.length} ta buyurtma
              </p>
            </div>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={clearOrders}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hammasini tozalash
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {orders.length > 0 ? (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-[26px] border bg-white p-4 shadow-sm transition sm:p-5 ${
                    highlightedOrderId === order.id
                      ? "border-teal-500 ring-2 ring-teal-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-teal-600">
                        #{order.id}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {order.status || "Buyurtma"}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Sana: {order.createdAt || "Noma’lum"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {order.paymentType || "To‘lov turi yo‘q"}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        Mahsulotlar
                      </h3>

                      {(order.items || []).length > 0 ? (
                        order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.id}`}
                            className="rounded-2xl bg-slate-50 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                                    Rasm
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {item.store}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                                  <span>Soni: {item.quantity || 1}</span>
                                  <span>Narx: {formatPrice(item.price)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                          Mahsulot topilmadi.
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Mijoz</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {order.customer?.name || "Noma’lum"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {order.customer?.phone || "Telefon yo‘q"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Manzil</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {order.deliveryAddress || "Manzil ko‘rsatilmagan"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Mahsulotlar</span>
                          <span className="font-semibold text-slate-900">
                            {formatPrice(order.productsPrice)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-slate-500">Yetkazib berish</span>
                          <span className="font-semibold text-slate-900">
                            {order.deliveryPrice === 0
                              ? "Bepul"
                              : formatPrice(order.deliveryPrice)}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                          <span className="font-medium text-slate-700">Jami</span>
                          <span className="text-lg font-bold text-slate-900">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeOrder(order.id)}
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Buyurtmani olib tashlash
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                Hozircha buyurtmalar yo‘q
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Buyurtma berganingizdan keyin shu yerda ko‘rinadi.
              </p>

              <Link
                to="/market"
                className="mt-5 inline-flex rounded-2xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
              >
                Marketga o‘tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}