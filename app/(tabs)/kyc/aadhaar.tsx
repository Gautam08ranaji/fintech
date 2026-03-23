import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AadhaarKYC() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");

  const handleSubmit = () => {
    if (aadhaar.length !== 12) {
      Alert.alert("Error", "Aadhaar must be 12 digits");
      return;
    }

    if (!pan) {
      Alert.alert("Error", "Enter PAN number");
      return;
    }

    console.log("KYC Submitted:", { aadhaar, pan });

    Alert.alert("Success", "KYC submitted successfully");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Aadhaar KYC</Text>
        <Text style={styles.subtitle}>
          Verify your identity securely
        </Text>

        {/* 🆔 Aadhaar */}
        <Text style={styles.label}>Aadhaar Number</Text>
        <TextInput
          value={aadhaar}
          onChangeText={setAadhaar}
          keyboardType="numeric"
          maxLength={12}
          placeholder="Enter 12-digit Aadhaar"
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
        />

        {/* 🧾 PAN */}
        <Text style={styles.label}>PAN Number</Text>
        <TextInput
          value={pan}
          onChangeText={setPan}
          autoCapitalize="characters"
          placeholder="Enter PAN"
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
        />

        {/* 🚀 SUBMIT */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit KYC</Text>
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