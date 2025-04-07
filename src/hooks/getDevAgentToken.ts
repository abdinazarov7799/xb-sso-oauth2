import { useState } from "react";

interface GetDevAgentTokenOptions {
    sso_get_devagent_token_endpoint: string;
    dev_agent_getme_sso_endpoint: string;
    frontend: string;
}

interface UseDevAgentTokenResult {
    data: any;
    error: string | null;
    loading: boolean;
    fetchData: () => Promise<void>;
}

export function useDevAgentToken({ sso_get_devagent_token_endpoint, dev_agent_getme_sso_endpoint, frontend }: GetDevAgentTokenOptions): UseDevAgentTokenResult {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response1 = await fetch(`${sso_get_devagent_token_endpoint}?frontend=${encodeURIComponent(frontend)}`);
            if (!response1.ok) throw new Error("Token olishda xatolik");
            const result1 = await response1.json();

            const token = result1?.token;
            if (!token) throw new Error("Token topilmadi");

            const response2 = await fetch(dev_agent_getme_sso_endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response2.ok) throw new Error("Maʼlumot olishda xatolik");

            const result2 = await response2.json();
            setData(result2);
        } catch (err: any) {
            setError(err.message || "Nomaʼlum xatolik");
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData };
}
