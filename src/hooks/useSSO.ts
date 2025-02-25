import { useState } from 'react';
import { SSOConfig } from '../types';

export const useSSO = (config: SSOConfig) => {
    const [token, setToken] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    return {
        token,
        authenticated,
        setToken,
        setAuthenticated,
        config
    };
};
