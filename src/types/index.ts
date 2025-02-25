import React from "react";

export interface SSOConfig {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
    SERVER_ENDPOINT: string;
    FRONTEND_ENDPOINT: string;
    OAUTH2_TOKEN_ENDPOINT: string;
    OAUTH2_JWKS_ENDPOINT: string;
    OAUTH2_AUTHORIZE_ENDPOINT: string;
    SCOPES: string;
    ISSUER: string;
    AUDIENCE: string;
}

export interface SSOLoginProps {
    setToken: (token: string) => void;
    setAuthenticated: (auth: boolean) => void;
    onSuccess?: (token: string) => void;
    config: SSOConfig;
    renderComponent?: (loginHandler: () => void, isWindowOpen: boolean, isSSOReady: boolean) => React.ReactNode;
}

