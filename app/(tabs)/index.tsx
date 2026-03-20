import { SPACING } from "@/config/spacing"; // ✅ spacing system
import { useTheme } from "@/hooks/useTheme"; // ✅ dynamic theme
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  console.log("home screen");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Dashboard</Text>

        <Text style={styles.subtitle}>
          Welcome to Fintech App
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background, // ✅ theme
      justifyContent: "center",
      alignItems: "center",
      padding: SPACING.screenPadding, // ✅ spacing
    },
    card: {
      width: "100%",
      backgroundColor: COLORS.card, // ✅ theme
      padding: SPACING.cardPadding,
      borderRadius: SPACING.radiusLg,
      elevation: 5,
      shadowColor: COLORS.shadow,
      alignItems: "center",
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: COLORS.text, // ✅ theme
      marginBottom: SPACING.xs,
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textSecondary, // ✅ theme
      marginBottom: SPACING.lg,
    },
    button: {
      backgroundColor: COLORS.primary, // ✅ theme
      paddingVertical: SPACING.buttonPadding,
      paddingHorizontal: SPACING.xl,
      borderRadius: SPACING.radiusMd,
    },
    buttonText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
  });