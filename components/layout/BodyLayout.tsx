import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  title?: string;
  type?: "dashboard" | "screen";
  scrollable?: boolean;
};

export default function BodyLayout({
  children,
  title,
  type = "screen",
  scrollable = true,
}: Props) {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔥 MODERN HEADER */}
      <View style={styles.headerWrapper}>
        <View style={styles.appBar}>
          {type === "dashboard" ? (
            <>
              <View>
                <Text style={styles.greeting}>Welcome back 👋</Text>
                <Text style={styles.title}>Dashboard</Text>
              </View>

              <View style={styles.actions}>
                <Ionicons name="search-outline" size={22} color={COLORS.textLight} />
                <Ionicons name="notifications-outline" size={22} color={COLORS.textLight} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>{title}</Text>

              <View style={styles.actions}>
                <Ionicons name="search-outline" size={22} color={COLORS.textLight} />
                <Ionicons name="notifications-outline" size={22} color={COLORS.textLight} />
              </View>
            </>
          )}
        </View>
      </View>

      {/* 🔹 BODY CARD */}
      <Container
        style={styles.body}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>{children}</View>
      </Container>
    </SafeAreaView>
  );
}const getStyles = (COLORS: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    // 🔥 HEADER WRAPPER (COLOR BAND)
    headerWrapper: {
      backgroundColor: COLORS.primary,
      paddingBottom: 30,
    },

    // 🔥 APP BAR
    appBar: {
      height: 70,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SPACING.screenPadding,
    },

    greeting: {
      fontSize: 13,
      color: COLORS.textLight,
      opacity: 0.85,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      color: COLORS.textLight,
    },

    actions: {
      flexDirection: "row",
      gap: 16,
    },

    // 🔥 BODY AREA
    body: {
      flex: 1,
      marginTop: -20, // 🔥 overlap effect
    },

    scrollContent: {
      paddingBottom: 40,
    },

    // 🔥 MAIN CARD
    contentCard: {
      flex: 1,
      backgroundColor: COLORS.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: SPACING.screenPadding,

      // 🔥 SHADOW
      elevation: 8,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
  });