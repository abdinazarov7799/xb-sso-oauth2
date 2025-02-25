import React, { useState, useEffect } from 'react';
import { isEmpty, isEqual, get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import PKCEHelper from '../utils/PkceHelper';
import storage from '../utils/storage';
import { SSOConfig, SSOLoginProps } from '../types';
import { JwtHelper } from '../utils/JwtHelper';

const SSOLogin: React.FC<SSOLoginProps> = ({ setToken, setAuthenticated, onSuccess = () => {}, config, renderComponent }) => {
    const typedConfig: SSOConfig = config;
    const [newWindow, setNewWindow] = useState<Window | null>(null);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [isSSOReady, setSSOReady] = useState(false);
    const jwtHelper = new JwtHelper(config);

    const signWithSSO = (): string => {
        return `${config.OAUTH2_AUTHORIZE_ENDPOINT}?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}&scope=${config.SCOPES}&response_type=code&code_challenge=${storage.get("code_challenge")}&code_challenge_method=S256&state=${storage.get("state_code")}`;
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code") || "";
        const state = queryParams.get("state");
        const state_code = storage.get("state_code");

        if (!isEmpty(code) && isEqual(state, state_code)) {
            axios.post(config.OAUTH2_TOKEN_ENDPOINT, new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: config.REDIRECT_URI,
                code_verifier: storage.get("code_verifier")?.toString()
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${window.btoa(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)}`
                }
            })
                .then(({ data }) => {
                    const accessToken = get(data, 'access_token');
                    jwtHelper.verifyTokenIssAud(accessToken, config).then((res) => {
                        if (!res.valid) {
                            console.error("Invalid JWT");
                        } else {
                            if (window.opener) {
                                window.opener.localStorage.setItem("accessToken", accessToken);
                                window.opener.location.reload();
                            }
                            onSuccess(accessToken);
                            window.close();
                        }
                    }).catch(() => console.error("Invalid JWT"));
                })
                .catch(console.error);

            ["code_challenge", "code_challenge_method", "code_verifier", "state_code"].forEach(storage.remove);
            return;
        }

        if (["state_code", "code_verifier", "code_challenge"].every((key) => !isEmpty(storage.get(key))) && isEqual(storage.get("code_challenge_method"), "S256")) {
            setSSOReady(true);
            return;
        }

        const code_verifier = uuidv4();
        const stateCode = uuidv4();
        storage.set("code_verifier", code_verifier);
        storage.set("state_code", stateCode);

        PKCEHelper.generateCodeChallengeSync(code_verifier, (result) => {
            storage.set("code_challenge", result);
            storage.set("code_challenge_method", "S256");
            setSSOReady(true);
        });
    }, []);

    useEffect(() => {
        if (newWindow) {
            const interval = setInterval(() => {
                if (newWindow.closed) {
                    setIsWindowOpen(false);
                    setNewWindow(null);
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [newWindow]);

    useEffect(() => {
        if (isEmpty(window.opener) && !isEmpty(storage.get("accessToken"))) {
            setToken(storage.get("accessToken"));
            setAuthenticated(true);
            storage.remove("accessToken");
        }
    }, []);

    const openSSOWindow = () => {
        if (isWindowOpen) return;

        const width = 800;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=yes`;

        const createdWindow = window.open(signWithSSO(), '_blank', windowFeatures);
        if (createdWindow) {
            setNewWindow(createdWindow);
            setIsWindowOpen(true);
        }
    };

    if (window.opener) return null;

    return renderComponent ? (
        renderComponent(openSSOWindow, isWindowOpen, isSSOReady)
    ) : null;
};

export default SSOLogin;
