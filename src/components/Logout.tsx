import React, { useEffect } from 'react';
import { SSOConfig } from '../types';

interface LogoutProps {
    config: SSOConfig;
    token: string;
    setAuthenticated: (auth: boolean) => void;
    setToken: (token: string | null) => void;
    onSuccess?: () => void;
    onError?: () => void;
}

const Logout: React.FC<LogoutProps> = ({ config, setAuthenticated, setToken, onSuccess, onError, token }) => {
    useEffect(() => {
        if (!token) {
            setAuthenticated(false);
            setToken(null);
            localStorage.clear();
            if (onSuccess) onSuccess();
            return;
        }

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
        };

        const data = new URLSearchParams();
        data.append("token", token);

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
                if (onSuccess) onSuccess();
            })
            .catch((err) => {
                if (onError) onError();
                else console.error(err);
            });
    }, []);

    return null;
};

export { Logout };
