// app/_layout.tsx
import "@/i18n";

import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";
import { setTheme } from "@/redux/slices/themeSlice";
import { store } from "@/redux/store";
import { getTheme, getToken } from "@/utils/storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";

// ✅ validator
const isValidTheme = (
  value: any
): value is "light" | "dark" | "system" => {
  return value === "light" || value === "dark" || value === "system";
};

function RootLayoutContent() {
  const dispatch = useAppDispatch();
  const { token, loading: authLoading } = useAppSelector((state) => state.auth);
  const { mode, loading: themeLoading } = useAppSelector((state) => state.theme);
  const COLORS = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const [savedToken, savedTheme] = await Promise.all([
          getToken(),
          getTheme(),
        ]);

        dispatch(setToken(savedToken));
        dispatch(setTheme(isValidTheme(savedTheme) ? savedTheme : null));
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initApp();
  }, []);

  // Show loader while initializing
  if (!isInitialized || authLoading || themeLoading) {
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

  // Use Stack navigator with conditional screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {mode === null ? (
        <Stack.Screen name="(auth)/theme" />
      ) : !token ? (
        <Stack.Screen name="(auth)/login" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
      <StatusBar style="auto" />
    </Provider>
  );
}