import { useAuth0 } from "@auth0/auth0-react";

import "../styles/Login.css";

export const Login = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🛍 Bienvenido al Test</h1>
        <p>Inicia sesión para explorar nuestros productos exclusivos</p>
        {!isAuthenticated ? (
          <button className="login-btn" onClick={() => loginWithRedirect()}>
            Iniciar sesión
          </button>
        ) : (
          <button
            className="logout-btn"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
};
