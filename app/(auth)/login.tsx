// app/(auth)/login.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice";
import { saveToken } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("common.error"), t("auth.enterCredentials"));
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(t("common.error"), t("auth.invalidEmail"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("common.error"), t("auth.passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const token = "dummy-token-" + Date.now();

      await saveToken(token);
      dispatch(setToken(token));

      router.replace("/(tabs)/dashboard");
    } catch (error) {
      Alert.alert(t("common.error"), t("auth.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // router.push("/(auth)/forgot-password");
  };

  const handleSignUp = () => {
    // router.push("/(auth)/signup");
  };

  return (
    <BodyLayout type="screen" title={t("auth.welcome")}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.title}>{t("auth.welcomeBack")}</Text>
            <Text style={styles.subtitle}>
              {t("auth.loginSubtitle")}
            </Text>
          </View>

          {/* Login Form Card */}
          <Card elevation="md" padding="lg" style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("auth.email")} <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputFocused,
                  email !== "" && validateEmail(email) && styles.inputValid,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    emailFocused
                      ? COLORS.primary
                      : email !== "" && validateEmail(email)
                      ? COLORS.success
                      : COLORS.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder={t("auth.emailPlaceholder")}
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { color: COLORS.text }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
                {email !== "" && validateEmail(email) && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("auth.password")} <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputFocused,
                  password !== "" && password.length >= 6 && styles.inputValid,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    passwordFocused
                      ? COLORS.primary
                      : password !== "" && password.length >= 6
                      ? COLORS.success
                      : COLORS.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder={t("auth.passwordPlaceholder")}
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { color: COLORS.text }]}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>
                {t("auth.forgotPassword")}
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: COLORS.primary },
                (!email || !password) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!email || !password || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>{t("auth.login")}</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </Card>

          {/* Sign Up Section */}
          <View style={styles.signupSection}>
            <Text style={[styles.signupText, { color: COLORS.textSecondary }]}>
              {t("auth.noAccount")}{" "}
              <Text
                style={[styles.signupLink, { color: COLORS.primary }]}
                onPress={handleSignUp}
              >
                {t("auth.signup")}
              </Text>
            </Text>
          </View>

          {/* Demo Credentials Info */}
          <Card elevation="sm" padding="md" style={styles.demoCard}>
            <View style={styles.demoContent}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.info} />
              <Text style={[styles.demoText, { color: COLORS.textSecondary }]}>
                Demo: demo@example.com / password123
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    contentContainer: {
      padding: SPACING.screenPadding,
      paddingBottom: SPACING.xxl,
    },
    welcomeSection: {
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      fontSize: 14,
      color: COLORS.textSecondary,
      lineHeight: 20,
    },
    formCard: {
      marginBottom: SPACING.md,
    },
    inputContainer: {
      marginBottom: SPACING.md,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    required: {
      color: COLORS.error,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.radiusMd,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.background,
    },
    inputFocused: {
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    inputValid: {
      borderColor: COLORS.success,
    },
    inputIcon: {
      marginRight: SPACING.sm,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      fontSize: 16,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: SPACING.lg,
    },
    forgotPasswordText: {
      fontSize: 13,
      fontWeight: "500",
    },
    loginButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    signupSection: {
      alignItems: "center",
      marginTop: SPACING.md,
    },
    signupText: {
      fontSize: 14,
    },
    signupLink: {
      fontSize: 14,
      fontWeight: "600",
    },
    demoCard: {
      marginTop: SPACING.lg,
    },
    demoContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    demoText: {
      flex: 1,
      fontSize: 12,
    },
  });