import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const [name, setName] = useState("Gautam Rana");
  const [email, setEmail] = useState("gautam@example.com");

  const handleSave = () => {
    console.log("Profile updated:", { name, email });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>
          Update your personal information
        </Text>

        {/* 👤 NAME */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* 📧 EMAIL */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* 💾 SAVE BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
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
      marginTop: SPACING.sm,
    },
    buttonText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
  });