import { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { HiOutlineHeart } from "react-icons/hi";

const NavBar = () => {
  const navigate = useNavigate();
  // const [visible, setVisible] = useState(false);
  const { setShowSearch, resetContextData } = useContext(ShopContext);
  const { getCartCount } = useContext(CartContext);
  const { wishlistItems, setWishlistItems, resetWishlist } =
    useContext(WishlistContext);

  const isLoggedIn =
    !!sessionStorage.getItem("token") || !!localStorage.getItem("token");

  const getWishlistCount = () => Object.keys(wishlistItems || {}).length;

  const handleLogout = () => {
    console.log("Logging out, resetting wishlist...");
    resetContextData();
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    setWishlistItems({});
    localStorage.removeItem("wishlistItems");
    resetWishlist();
    navigate("/login");
  };

  return (
    <>
      <main className="sticky top-0 z-50">
        <div className="bg-white flex items-center justify-between py-5 px-4 font-medium sm:max-w-[90%] mx-auto">
          <Link to="/">
            <img src={assets.logo} className="w-24 sm:w-36" alt="Trendify" />
          </Link>

          <ul className="hidden gap-5 text-sm text-gray-700 sm:flex">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/collection">COLLECTION</NavLink>
            <NavLink to="/about">ABOUT</NavLink>
            <NavLink to="/contact">CONTACT</NavLink>
          </ul>

          <div className="flex items-center gap-6">
            <img
              onClick={() => setShowSearch(true)}
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              alt="Search"
            />

            <Link to="/wishlist" className="relative">
              <HiOutlineHeart className="text-[29px] text-gray-600" />
              {getWishlistCount() > 0 && (
                <span className="absolute bottom-0 left-4 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className="w-5 cursor-pointer"
                alt="Cart"
              />
              {getCartCount() > 0 && (
                <span className="absolute -bottom-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-5 cursor-pointer"
                alt="Profile"
              />
              <div className="absolute right-0 hidden pt-4 group-hover:block">
                {isLoggedIn && (
                  <div className="flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100">
                    <p
                      className="cursor-pointer hover:text-black"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </p>
                    <p
                      className="cursor-pointer hover:text-black"
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </p>
                    <p
                      className="cursor-pointer hover:text-black"
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NavBar;
