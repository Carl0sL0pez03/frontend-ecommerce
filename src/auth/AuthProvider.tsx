import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || "/home");
  };

  const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;

  if (!domain || !clientId) {
    throw new Error("The Auth0 environment variables are missing.");
  }

  return isReady ? (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  ) : null;
};
