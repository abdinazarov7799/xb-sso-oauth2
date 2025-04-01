import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { SSOConfig } from '../types';

export class JwtHelper {
    private jwksUrl: string;
    private JWKS: ReturnType<typeof createRemoteJWKSet>;

    constructor(config: SSOConfig) {
        if (!config.OAUTH2_JWKS_ENDPOINT) {
            throw new Error("JWKS endpoint is required");
        }
        this.jwksUrl = config.OAUTH2_JWKS_ENDPOINT;
        this.JWKS = createRemoteJWKSet(new URL(this.jwksUrl));
    }

    async verifyTokenIssAud(token: string, config: SSOConfig): Promise<{ valid: boolean; payload?: JWTPayload; error?: string }> {
        try {
            const { payload } = await jwtVerify(token, this.JWKS, {
                issuer: config.ISSUER,
                audience: config.AUDIENCE,
            });
            return { valid: true, payload };
        } catch (error: any) {
            return { valid: false, error: error.message };
        }
    }
}
