import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

const STORAGE_KEY = "tealmarket_cart_v1";

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function normalizeCartItem(product) {
  return {
    id: product?.id,
    title: product?.title || "",
    price: Number(product?.price || 0),
    image:
      product?.image ||
      (Array.isArray(product?.images) && product.images.length > 0
        ? product.images[0]
        : ""),
    images: Array.isArray(product?.images) ? product.images : [],
    desc: product?.desc || "",
    category: product?.category || "",
    store: product?.store || "",
    storeSlug: product?.storeSlug || "",
    stock: Number(product?.stock || 1),
    rating: Number(product?.rating || 0),
    quantity: Number(product?.quantity || 1),
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      //
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product?.id) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => Number(item.id) === Number(product.id));

      if (existing) {
        return prev.map((item) =>
          Number(item.id) === Number(product.id)
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...prev, normalizeCartItem(product)];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => Number(item.id) !== Number(productId))
    );
  };

  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (Number(item.id) !== Number(productId)) return item;

        const nextQuantity = item.quantity + 1;
        const maxStock = Number(item.stock || 9999);

        return {
          ...item,
          quantity: nextQuantity > maxStock ? maxStock : nextQuantity,
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (Number(item.id) !== Number(productId)) return item;

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (productId, nextQuantity) => {
    const numericQuantity = Number(nextQuantity || 0);

    if (numericQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (Number(item.id) !== Number(productId)) return item;

        const maxStock = Number(item.stock || 9999);

        return {
          ...item,
          quantity: numericQuantity > maxStock ? maxStock : numericQuantity,
        };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => Number(item.id) === Number(productId));
  };

  const getCartItem = (productId) => {
    return (
      cartItems.find((item) => Number(item.id) === Number(productId)) || null
    );
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      clearCart,
      isInCart,
      getCartItem,
    }),
    [cartItems, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}