import { darkColors, lightColors } from "@/config/theme";
import { useAppSelector } from "@/redux/hooks";
import { useColorScheme } from "react-native";

export function useTheme() {
  const systemTheme = useColorScheme();
  const mode = useAppSelector((state) => state.theme.mode);

  // ✅ fallback to light if systemTheme is null
  let resolvedTheme: "light" | "dark" = systemTheme === "dark" ? "dark" : "light";

  // ✅ override based on user selection
  if (mode === "light") resolvedTheme = "light";
  if (mode === "dark") resolvedTheme = "dark";
  if (mode === "system") {
    resolvedTheme = systemTheme === "dark" ? "dark" : "light";
  }

  const colors = resolvedTheme === "dark" ? darkColors : lightColors;

  return {
    ...colors,
    isDark: resolvedTheme === "dark",
    mode: resolvedTheme, // ✅ useful for debugging/UI
  };
}