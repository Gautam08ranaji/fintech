import { SPACING } from "@/config/spacing";
import { COLORS } from "@/config/theme";
import { useAppDispatch } from "@/redux/hooks";
import { setTheme } from "@/redux/slices/themeSlice";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ThemeScreen() {
  const dispatch = useAppDispatch();

  const handleSelect = (mode: "light" | "dark" | "system") => {
    dispatch(setTheme(mode));
    router.replace("/(auth)/login"); // 👉 go to login after selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Theme</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("light")}>
        <Text style={styles.text}>🌞 Light</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("dark")}>
        <Text style={styles.text}>🌙 Dark</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect("system")}>
        <Text style={styles.text}>📱 System Default</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.screenPadding,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  button: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.radiusMd,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  text: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});