import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoanDetails() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const [amount, setAmount] = useState("50000");
  const [interest, setInterest] = useState("10");
  const [tenure, setTenure] = useState("12");

  // 📊 EMI CALCULATION
  const calculateEMI = () => {
    const P = Number(amount);
    const r = Number(interest) / 12 / 100;
    const n = Number(tenure);

    if (!P || !r || !n) return 0;

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    return emi.toFixed(0);
  };

  const emi = calculateEMI();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Loan Details</Text>
        <Text style={styles.subtitle}>
          Calculate your EMI instantly
        </Text>

        {/* 💰 AMOUNT */}
        <Text style={styles.label}>Loan Amount (₹)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* 📈 INTEREST */}
        <Text style={styles.label}>Interest Rate (%)</Text>
        <TextInput
          value={interest}
          onChangeText={setInterest}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* ⏳ TENURE */}
        <Text style={styles.label}>Tenure (Months)</Text>
        <TextInput
          value={tenure}
          onChangeText={setTenure}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* 📊 EMI RESULT */}
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Monthly EMI</Text>
          <Text style={styles.resultValue}>₹ {emi}</Text>
        </View>

        {/* 🚀 APPLY BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/loan/apply")}
        >
          <Text style={styles.buttonText}>Apply Now</Text>
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
      justifyContent: "center",
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

    label: {
      fontSize: 13,
      color: COLORS.textSecondary,
      marginBottom: 4,
      marginTop: SPACING.sm,
    },

    input: {
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.inputPadding,
      borderRadius: SPACING.radiusMd,
      color: COLORS.text,
      marginBottom: SPACING.md,
    },

    resultBox: {
      backgroundColor: COLORS.primaryLight,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
      marginTop: SPACING.md,
    },

    resultLabel: {
      fontSize: 13,
      color: COLORS.textLight,
    },

    resultValue: {
      fontSize: 22,
      fontWeight: "700",
      color: COLORS.textLight,
      marginTop: 4,
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