import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import ProductContextProvider from "./context/ProductContext.jsx";
import CartContextProvider from "./context/CartContext.jsx";
import WishlistContextProvider from "./context/WishlistContext.jsx";
import OrderContextProvider from "./context/OrderContext.jsx";
import ReviewContextProvider from "./context/ReviewContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProductContextProvider>
      <ShopContextProvider>
        <CartContextProvider>
          <WishlistContextProvider>
            <ReviewContextProvider>
              <OrderContextProvider>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </OrderContextProvider>
            </ReviewContextProvider>
          </WishlistContextProvider>
        </CartContextProvider>
      </ShopContextProvider>
    </ProductContextProvider>
  </BrowserRouter>
);
