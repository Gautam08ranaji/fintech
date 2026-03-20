import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { getToken } from "@/utils/storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";

// 👇 THIS FUNCTION GOES HERE
function RootNavigator() {
  const dispatch = useAppDispatch();
  const { token, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getToken();
      dispatch(setToken(savedToken));
    };

    loadToken();
  }, []);

  // ⏳ Splash / loading state
  if (loading) {
    return null; // or loader
  }

  return (
    <Stack key={token ? "user" : "guest"} screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="(auth)/login" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

// 👇 DEFAULT EXPORT
export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}