let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const tokenStore = {
  getAccess: () => {
    if (_accessToken) return _accessToken;
    if (typeof window !== "undefined") return localStorage.getItem("accessToken");
    return null;
  },
  getRefresh: () => {
    if (_refreshToken) return _refreshToken;
    if (typeof window !== "undefined") return localStorage.getItem("refreshToken");
    return null;
  },
  setTokens: (access: string, refresh: string) => {
    _accessToken = access;
    _refreshToken = refresh;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }
  },
  clear: () => {
    _accessToken = null;
    _refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
};