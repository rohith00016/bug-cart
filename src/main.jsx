import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import ProductContextProvider from "./context/ProductContext.jsx";
import WishlistContextProvider from "./context/WishlistContext.jsx";
import OrderContextProvider from "./context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProductContextProvider>
      <ShopContextProvider>
        <WishlistContextProvider>
          <OrderContextProvider>
            <App />
          </OrderContextProvider>
        </WishlistContextProvider>
      </ShopContextProvider>
    </ProductContextProvider>
  </BrowserRouter>
);
