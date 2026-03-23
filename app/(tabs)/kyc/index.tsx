import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function KYCOptions() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>KYC Verification</Text>
        <Text style={styles.subtitle}>
          Complete your identity verification
        </Text>

        {/* 📄 Aadhaar */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/(tabs)/kyc/aadhaar")}
        >
          <Text style={styles.optionTitle}>Aadhaar KYC</Text>
          <Text style={styles.optionDesc}>
            Verify using Aadhaar details
          </Text>
        </TouchableOpacity>

        {/* 📸 Selfie */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/(tabs)/kyc/selfie")}
        >
          <Text style={styles.optionTitle}>Selfie Verification</Text>
          <Text style={styles.optionDesc}>
            Capture selfie for identity check
          </Text>
        </TouchableOpacity>
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
      fontSize: 22,
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

    option: {
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      marginBottom: SPACING.md,
    },

    optionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },

    optionDesc: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginTop: 4,
    },
  });