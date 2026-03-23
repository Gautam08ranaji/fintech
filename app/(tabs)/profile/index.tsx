import { SPACING } from "@/config/spacing"; // ✅ spacing
import { useTheme } from "@/hooks/useTheme"; // ✅ theme
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { removeToken } from "@/utils/storage";
import { router } from "expo-router";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await removeToken(); // ❌ clear storage
            dispatch(logout()); // 🧠 redux
            router.replace("/(auth)/login"); // 🚀 navigate
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.subtitle}>
          Welcome to your account
        </Text>

        {/* 👤 USER INFO */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Gautam Rana</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>gautam@example.com</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
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
      padding: SPACING.screenPadding,
    },
    card: {
      backgroundColor: COLORS.card, // ✅ theme
      padding: SPACING.cardPadding,
      borderRadius: SPACING.radiusLg,
      elevation: 5,
      shadowColor: COLORS.shadow,
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: COLORS.text, // ✅ theme
      marginBottom: SPACING.xs,
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textSecondary, // ✅ theme
      marginBottom: SPACING.lg,
    },
    infoBox: {
      width: "100%",
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: SPACING.sm,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },
    logoutButton: {
      backgroundColor: COLORS.error, // ✅ theme
      paddingVertical: SPACING.buttonPadding,
      paddingHorizontal: SPACING.xl,
      borderRadius: SPACING.radiusMd,
      marginTop: SPACING.sm,
    },
    logoutText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
  });