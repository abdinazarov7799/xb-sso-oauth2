const storage = {
    set: (key: string, value: string) => {
        localStorage.setItem(key, value);
    },
    get: (key: string): string | null => {
        return localStorage.getItem(key);
    },
    remove: (key: string) => {
        localStorage.removeItem(key);
    }
};

export default storage;
