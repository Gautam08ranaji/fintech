import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ApplyLoan() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");

  const handleApply = () => {
    if (!name || !amount || !tenure) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    console.log("Loan Applied:", { name, amount, tenure });

    Alert.alert("Success", "Loan application submitted!", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)/loan"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Apply for Loan</Text>
        <Text style={styles.subtitle}>
          Fill details to apply instantly
        </Text>

        {/* 👤 NAME */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor={COLORS.textSecondary}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* 💰 AMOUNT */}
        <Text style={styles.label}>Loan Amount (₹)</Text>
        <TextInput
          placeholder="Enter amount"
          placeholderTextColor={COLORS.textSecondary}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* ⏳ TENURE */}
        <Text style={styles.label}>Tenure (Months)</Text>
        <TextInput
          placeholder="Enter tenure"
          placeholderTextColor={COLORS.textSecondary}
          value={tenure}
          onChangeText={setTenure}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* 🚀 APPLY BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleApply}>
          <Text style={styles.buttonText}>Submit Application</Text>
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