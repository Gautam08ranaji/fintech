import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoanOffers() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Loan Offers</Text>

      {/* 💰 LOAN CARD 1 */}
      <View style={styles.card}>
        <Text style={styles.amount}>₹50,000</Text>
        <Text style={styles.desc}>Instant Personal Loan</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Interest</Text>
          <Text style={styles.value}>10% p.a</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tenure</Text>
          <Text style={styles.value}>12 Months</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/loan/details")}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      {/* 💰 LOAN CARD 2 */}
      <View style={styles.card}>
        <Text style={styles.amount}>₹1,00,000</Text>
        <Text style={styles.desc}>Premium Loan Offer</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Interest</Text>
          <Text style={styles.value}>9% p.a</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tenure</Text>
          <Text style={styles.value}>24 Months</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/loan/details")}
        >
          <Text style={styles.buttonText}>View Details</Text>
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
      padding: SPACING.screenPadding,
    },

    header: {
      fontSize: 22,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: SPACING.lg,
    },

    card: {
      backgroundColor: COLORS.card,
      padding: SPACING.cardPadding,
      borderRadius: SPACING.radiusLg,
      marginBottom: SPACING.lg,
      elevation: 5,
      shadowColor: COLORS.shadow,
    },

    amount: {
      fontSize: 24,
      fontWeight: "700",
      color: COLORS.primary,
      marginBottom: SPACING.xs,
    },

    desc: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: SPACING.md,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: SPACING.sm,
    },

    label: {
      fontSize: 13,
      color: COLORS.textSecondary,
    },

    value: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
    },

    button: {
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.buttonPadding,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
      marginTop: SPACING.md,
    },

    buttonText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
  });