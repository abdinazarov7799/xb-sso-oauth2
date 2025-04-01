import React, { useEffect } from 'react';
import { SSOConfig } from '../types';

interface LogoutProps {
    config: SSOConfig;
    setAuthenticated: (auth: boolean) => void;
    setToken: (token: string | null) => void;
    onLogout?: () => void;
}

const Logout: React.FC<LogoutProps> = ({ config, setAuthenticated, setToken, onLogout }) => {
    useEffect(() => {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
        };

        const data = new URLSearchParams();
        data.append("token", localStorage.getItem("accessToken") || "");

        fetch(`${config.SERVER_ENDPOINT}/oauth2/revoke`, {
            method: "POST",
            headers,
            body: data
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to revoke token");
                setAuthenticated(false);
                setToken(null);
                localStorage.clear();
                if (onLogout) onLogout();
            })
            .catch(console.error);
    }, []);

    return null;
};

export { Logout };
