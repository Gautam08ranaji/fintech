// app/(auth)/theme.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import i18n from "@/i18n";
import { useAppDispatch } from "@/redux/hooks";
import { setTheme } from "@/redux/slices/themeSlice";
import { saveTheme } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🌍 Languages
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸", nativeName: "English" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", nativeName: "Hindi" },
  { code: "es", label: "Español", flag: "🇪🇸", nativeName: "Spanish" },
  { code: "fr", label: "Français", flag: "🇫🇷", nativeName: "French" },
];

interface ThemeOption {
  id: "light" | "dark" | "system";
  label: string;
  icon: string;
  description: string;
}

export default function ThemeLanguageScreen() {
  const dispatch = useAppDispatch();
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("system");

  const [selectedLang, setSelectedLang] = useState(
    i18n.language || "en"
  );

  const themeOptions: ThemeOption[] = [
    {
      id: "light",
      label: "Light Mode",
      icon: "sunny-outline",
      description: "Bright and clean interface",
    },
    {
      id: "dark",
      label: "Dark Mode",
      icon: "moon-outline",
      description: "Easy on the eyes, saves battery",
    },
    {
      id: "system",
      label: "System Default",
      icon: "phone-portrait-outline",
      description: "Follows your device settings",
    },
  ];

  // 🎨 THEME SELECT
  const handleTheme = async (mode: "light" | "dark" | "system") => {
    setSelectedTheme(mode);
    dispatch(setTheme(mode));
    await saveTheme(mode);
  };

  // 🌍 LANGUAGE SELECT
  const handleLanguage = async (lang: string) => {
    setSelectedLang(lang);
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);
  };

  // 🚀 CONTINUE
  const handleContinue = () => {
    router.push("/(auth)/login");
  };

  const renderThemeOption = (option: ThemeOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.themeOption,
        selectedTheme === option.id && styles.themeOptionSelected,
      ]}
      onPress={() => handleTheme(option.id)}
      activeOpacity={0.7}
    >
      <View style={styles.themeOptionContent}>
        <View
          style={[
            styles.themeIcon,
            { backgroundColor: `${COLORS.primary}15` },
            selectedTheme === option.id && styles.themeIconSelected,
          ]}
        >
          <Ionicons
            name={option.icon as any}
            size={28}
            color={selectedTheme === option.id ? COLORS.primary : COLORS.textSecondary}
          />
        </View>
        <View style={styles.themeInfo}>
          <Text
            style={[
              styles.themeLabel,
              selectedTheme === option.id && styles.themeLabelSelected,
            ]}
          >
            {option.label}
          </Text>
          <Text style={styles.themeDescription}>{option.description}</Text>
        </View>
        {selectedTheme === option.id && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderLanguageOption = (lang: typeof LANGUAGES[0]) => (
    <TouchableOpacity
      key={lang.code}
      style={[
        styles.languageOption,
        selectedLang === lang.code && styles.languageOptionSelected,
      ]}
      onPress={() => handleLanguage(lang.code)}
      activeOpacity={0.7}
    >
      <View style={styles.languageOptionContent}>
        <Text style={styles.languageFlag}>{lang.flag}</Text>
        <View style={styles.languageInfo}>
          <Text
            style={[
              styles.languageLabel,
              selectedLang === lang.code && styles.languageLabelSelected,
            ]}
          >
            {lang.label}
          </Text>
          <Text style={styles.languageNative}>{lang.nativeName}</Text>
        </View>
        {selectedLang === lang.code && (
          <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <BodyLayout type="screen" title="Setup Your App">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome! 👋</Text>
          <Text style={styles.subtitle}>
            Personalize your experience by choosing your preferred theme and language
          </Text>
        </View>

        {/* Theme Selection Card */}
        <Card elevation="md" padding="lg" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Choose Theme</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Select how you want the app to look
          </Text>
          <View style={styles.themeOptions}>
            {themeOptions.map(renderThemeOption)}
          </View>
        </Card>

        {/* Language Selection Card */}
        <Card elevation="md" padding="lg" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Choose Language</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Select your preferred language
          </Text>
          <View style={styles.languageOptions}>
            {LANGUAGES.map(renderLanguageOption)}
          </View>
        </Card>

        {/* Preview Card */}
        <Card elevation="sm" padding="md" style={styles.previewCard}>
          <View style={styles.previewContent}>
            <Ionicons name="eye-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.previewText}>
              You can change these settings later in the app
            </Text>
          </View>
        </Card>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: COLORS.primary }]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
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
    sectionCard: {
      marginBottom: SPACING.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      marginBottom: SPACING.xs,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: COLORS.text,
    },
    sectionDescription: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: SPACING.md,
    },
    themeOptions: {
      gap: SPACING.md,
    },
    themeOption: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.radiusMd,
      padding: SPACING.md,
      backgroundColor: COLORS.card,
    },
    themeOptionSelected: {
      borderColor: COLORS.primary,
      backgroundColor: `${COLORS.primary}05`,
    },
    themeOptionContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    themeIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    themeIconSelected: {
      backgroundColor: `${COLORS.primary}20`,
    },
    themeInfo: {
      flex: 1,
    },
    themeLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 2,
    },
    themeLabelSelected: {
      color: COLORS.primary,
    },
    themeDescription: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    languageOptions: {
      gap: SPACING.sm,
    },
    languageOption: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.radiusMd,
      padding: SPACING.md,
      backgroundColor: COLORS.card,
    },
    languageOptionSelected: {
      borderColor: COLORS.primary,
      backgroundColor: `${COLORS.primary}05`,
    },
    languageOptionContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    languageFlag: {
      fontSize: 32,
    },
    languageInfo: {
      flex: 1,
    },
    languageLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 2,
    },
    languageLabelSelected: {
      color: COLORS.primary,
    },
    languageNative: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    previewCard: {
      marginBottom: SPACING.lg,
    },
    previewContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    previewText: {
      flex: 1,
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    continueButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });