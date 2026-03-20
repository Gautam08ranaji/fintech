import { useAppSelector } from "@/redux/hooks";
import { store } from "@/redux/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

// 👇 THIS FUNCTION GOES HERE
function RootNavigator() {
  const { token } = useAppSelector((state) => state.auth);

  console.log("TOKEN VALUE:", token); // 👈 ADD THIS

  return (
    <Stack key={token ? "user" : "guest"} screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="(auth)/login" />) : (
        <Stack.Screen name="(tabs)" />   // ✅ FIXED
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