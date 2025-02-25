import CryptoJS from 'crypto-js';

class PkceHelper {
    public static base64UrlEncode(wordArray: CryptoJS.lib.WordArray): string {
        return CryptoJS.enc.Base64.stringify(wordArray)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    public static generateUrlSafeSha256(input: string): string {
        const hash = CryptoJS.SHA256(input);
        return PkceHelper.base64UrlEncode(hash);
    }

    public static generateCodeChallengeSync(input: string, callback: (result: string) => void): void {
        try {
            const result = PkceHelper.generateUrlSafeSha256(input);
            callback(result);
        } catch (error) {
            console.error('Error calculating hash:', error);
        }
    }
}

export default PkceHelper;
