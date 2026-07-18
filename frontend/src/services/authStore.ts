let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const authStore = {
  getToken(): string | null {
    return accessToken;
  },

  setToken(token: string | null): void {
    accessToken = token;
  },

  setUnauthorizedHandler(handler: (() => void) | null): void {
    onUnauthorized = handler;
  },

  notifyUnauthorized(): void {
    onUnauthorized?.();
  },
};
