import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "user_token";
const THEME_KEY = "app_theme"; // ✅ NEW

// 🔐 TOKEN
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// 🎨 THEME (ADD THIS)
export const saveTheme = async (mode: string) => {
  await SecureStore.setItemAsync(THEME_KEY, mode);
};

export const getTheme = async () => {
  return await SecureStore.getItemAsync(THEME_KEY);
};

export const removeTheme = async () => {
  await SecureStore.deleteItemAsync(THEME_KEY);
};