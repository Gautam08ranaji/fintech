import { useTheme } from "@/hooks/useTheme"; // ✅ THEME
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { getToken } from "@/utils/storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";

function RootNavigator() {
  const dispatch = useAppDispatch();
  const { token, loading } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme); // ✅ FIXED

  const COLORS = useTheme();

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getToken();
      dispatch(setToken(savedToken));
    };

    loadToken();
  }, []);

  if (loading) return null;

  return (
    <>
      <Stack
        key={`${mode}-${token ? "user" : "guest"}`} // ✅ now works
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        {!mode ? (
          <Stack.Screen name="(auth)/theme" />
        ) : !token ? (
          <Stack.Screen name="(auth)/login" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>

      <StatusBar style={COLORS.isDark ? "light" : "dark"} />
    </>
  );
}

// 👇 ROOT
export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}