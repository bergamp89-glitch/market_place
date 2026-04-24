import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { ReelProvider } from "./context/ReelContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ChatProvider } from "./context/ChatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <OrderProvider>
            <ProductProvider>
              <ReelProvider>
                <ChatProvider>
                  <App />
                </ChatProvider>
              </ReelProvider>
            </ProductProvider>
          </OrderProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);