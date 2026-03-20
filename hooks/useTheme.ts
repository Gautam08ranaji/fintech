import { darkColors, lightColors } from "@/config/theme";
import { useAppSelector } from "@/redux/hooks";
import { useColorScheme } from "react-native";

export function useTheme() {
  const systemTheme = useColorScheme();
  const mode = useAppSelector((state) => state.theme.mode);

  let theme = systemTheme;

  if (mode === "light") theme = "light";
  if (mode === "dark") theme = "dark";

  const colors = theme === "dark" ? darkColors : lightColors;

  return {
    ...colors,
    isDark: theme === "dark",
  };
}