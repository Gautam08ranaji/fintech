import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const COLORS = useTheme(); // ✅ dynamic theme
  const styles = getStyles(COLORS); // ✅ clean styles

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("login pressed");
    if (email && password) {
      dispatch(setToken("dummy-token"));
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>

        <Text style={styles.subtitle}>
          Login to your account
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.textSecondary}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={COLORS.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don't have an account?{" "}
          <Text style={styles.link}>Sign up</Text>
        </Text>
      </View>
    </View>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      padding: SPACING.screenPadding,
    },
    card: {
      backgroundColor: COLORS.card,
      padding: SPACING.cardPadding,
      borderRadius: SPACING.radiusLg,
      elevation: 5,
      shadowColor: COLORS.shadow,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: SPACING.xs,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: SPACING.lg,
      textAlign: "center",
    },
    input: {
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.inputPadding,
      borderRadius: SPACING.radiusMd,
      marginBottom: SPACING.md,
      fontSize: 16,
      color: COLORS.text,
    },
    button: {
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.buttonPadding,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
      marginTop: SPACING.sm,
    },
    buttonText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
    footer: {
      marginTop: SPACING.md,
      textAlign: "center",
      color: COLORS.textSecondary,
    },
    link: {
      color: COLORS.link,
      fontWeight: "600",
    },
  });