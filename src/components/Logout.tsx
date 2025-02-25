import React, { useEffect } from 'react';
import axios from 'axios';
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
            "Authorization": "Basic " + window.btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
        };

        const data = new URLSearchParams();
        data.append("token", localStorage.getItem("accessToken") || "");

        axios.post(`${config.SERVER_ENDPOINT}/oauth2/revoke`, data, { headers })
            .then(() => {
                setAuthenticated(false);
                setToken(null);
                localStorage.clear();
                if (onLogout) onLogout();
            })
            .catch(console.error);
    }, []);

    return <></>;
};

export { Logout };
