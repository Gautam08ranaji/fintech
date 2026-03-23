import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  return (
    <View style={styles.container}>
      {/* 💳 LOAN CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Loan Repayment</Text>
        <Text style={styles.subtitle}>
          Manage your EMI and payments
        </Text>

        {/* 💰 AMOUNT */}
        <View style={styles.row}>
          <Text style={styles.label}>Total Due</Text>
          <Text style={styles.value}>₹12,500</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Next EMI</Text>
          <Text style={styles.value}>₹2,500</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.value}>25 Mar 2026</Text>
        </View>

        {/* 💳 PAY BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      {/* 📊 HISTORY */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>

        <View style={styles.historyItem}>
          <Text style={styles.historyText}>₹2,500 Paid</Text>
          <Text style={styles.historyDate}>10 Mar 2026</Text>
        </View>

        <View style={styles.historyItem}>
          <Text style={styles.historyText}>₹2,500 Paid</Text>
          <Text style={styles.historyDate}>10 Feb 2026</Text>
        </View>
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

    card: {
      backgroundColor: COLORS.card,
      padding: SPACING.cardPadding,
      borderRadius: SPACING.radiusLg,
      marginBottom: SPACING.lg,
      elevation: 5,
      shadowColor: COLORS.shadow,
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },

    subtitle: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: SPACING.lg,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: SPACING.md,
    },

    label: {
      fontSize: 14,
      color: COLORS.textSecondary,
    },

    value: {
      fontSize: 16,
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

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },

    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: SPACING.sm,
    },

    historyText: {
      fontSize: 14,
      color: COLORS.text,
    },

    historyDate: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
  });