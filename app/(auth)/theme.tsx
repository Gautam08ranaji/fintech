import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import i18n from "@/i18n";
import { useAppDispatch } from "@/redux/hooks";
import { setTheme } from "@/redux/slices/themeSlice";
import { saveTheme } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🌍 Languages
const LANGUAGES = [
  { code: "en", label: "English 🇺🇸" },
  { code: "hi", label: "हिन्दी 🇮🇳" },
];

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

  // 🎨 THEME SELECT
  const handleTheme = async (mode: "light" | "dark" | "system") => {
    setSelectedTheme(mode);
    dispatch(setTheme(mode)); // redux
    await saveTheme(mode);    // storage
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

  return (
    <View style={styles.container}>
      {/* 🔥 TITLE */}
      <Text style={styles.title}>Setup Your App</Text>

      {/* 🎨 THEME SECTION */}
      <Text style={styles.sectionTitle}>Choose Theme</Text>

      {["light", "dark", "system"].map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.option,
            selectedTheme === mode && styles.selected,
          ]}
          onPress={() => handleTheme(mode as any)}
        >
          <Text
            style={[
              styles.optionText,
              selectedTheme === mode && styles.selectedText,
            ]}
          >
            {mode === "light"
              ? "🌞 Light"
              : mode === "dark"
              ? "🌙 Dark"
              : "📱 System Default"}
          </Text>
        </TouchableOpacity>
      ))}

      {/* 🌍 LANGUAGE SECTION */}
      <Text style={styles.sectionTitle}>Choose Language</Text>

      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.option,
            selectedLang === lang.code && styles.selected,
          ]}
          onPress={() => handleLanguage(lang.code)}
        >
          <Text
            style={[
              styles.optionText,
              selectedLang === lang.code && styles.selectedText,
            ]}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* 🚀 CONTINUE BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: SPACING.screenPadding,
      backgroundColor: COLORS.background,
      justifyContent: "center",
    },

    title: {
      fontSize: 26,
      fontWeight: "700",
      color: COLORS.text,
      textAlign: "center",
      marginBottom: SPACING.lg,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm,
    },

    option: {
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: SPACING.sm,
      backgroundColor: COLORS.card,
    },

    selected: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },

    optionText: {
      fontSize: 15,
      color: COLORS.text,
      fontWeight: "500",
    },

    selectedText: {
      color: COLORS.textLight,
      fontWeight: "600",
    },

    button: {
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.buttonPadding,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
      marginTop: SPACING.lg,
    },

    buttonText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
  });