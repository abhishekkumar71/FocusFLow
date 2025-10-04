// frontend/src/utils/auth.ts
import jwtDecode from "jwt-decode";

const KEY = "habit-token";

export const setToken = (t: string) => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, t);
};
export const getToken = () => (typeof window !== "undefined" ? localStorage.getItem(KEY) : null);
export const removeToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
};
export const getUserFromToken = (): { id: number } | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<{ id: number }>(token);
  } catch {
    return null;
  }
};
