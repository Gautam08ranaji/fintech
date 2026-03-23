import "@/i18n"; // 🔥 ADD THIS LINE FIRST

import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";
import { setTheme } from "@/redux/slices/themeSlice";
import { store } from "@/redux/store";
import { getTheme, getToken } from "@/utils/storage";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";

// ✅ validator
const isValidTheme = (
  value: any
): value is "light" | "dark" | "system" => {
  return value === "light" || value === "dark" || value === "system";
};

function RootNavigator() {
  const dispatch = useAppDispatch();

  const { token, loading } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);

  const COLORS = useTheme();

  useEffect(() => {
    const initApp = async () => {
      const [savedToken, savedTheme] = await Promise.all([
        getToken(),
        getTheme(),
      ]);

      dispatch(setToken(savedToken));
      dispatch(setTheme(isValidTheme(savedTheme) ? savedTheme : null));
    };

    initApp();
  }, []);

  // ✅ loader
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 🔥 REDIRECT LOGIC
  if (mode === null) {
    return <Redirect href="/(auth)/theme" />;
  }

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
      <RootNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}