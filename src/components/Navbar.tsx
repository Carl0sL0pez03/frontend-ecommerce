import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import "../styles/Navbar.css";
import { useCart } from "../context/CartContext";

export const Navbar = () => {
  const { logout, user, isAuthenticated } = useAuth0();
  const { cart } = useCart();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="left-nav">
        <h1 className="logo" onClick={() => navigate("/home")}>
          🛍 Ecommerce
        </h1>
      </div>
      <div className="nav-right">
        <button
          className="deliveries-link"
          onClick={() => navigate("/deliveries")}
        >
          🚚 Entregas
        </button>

        <div className="cart-icon" onClick={() => navigate("/checkout")}>
          🛒<span className="badge">{totalItems}</span>
        </div>

        <div className="user-dropdown">
          <div className="user-icon">👤</div>
          <div className="user-menu">
            <span>{user?.name}</span>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
