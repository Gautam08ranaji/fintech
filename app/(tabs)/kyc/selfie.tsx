import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SelfieScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const [image, setImage] = useState<string | null>(null);

  // 👉 Dummy capture (replace with camera later)
  const handleCapture = () => {
    console.log("Capture selfie");
    setImage("https://via.placeholder.com/200"); // mock image
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Selfie Verification</Text>
        <Text style={styles.subtitle}>
          Capture your selfie to verify identity
        </Text>

        {/* 📸 PREVIEW */}
        <View style={styles.previewBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>No Image</Text>
          )}
        </View>

        {/* 📷 CAPTURE BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <Text style={styles.buttonText}>
            {image ? "Retake Selfie" : "Capture Selfie"}
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
      alignItems: "center",
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
      textAlign: "center",
    },

    previewBox: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: COLORS.border,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.lg,
      overflow: "hidden",
    },

    image: {
      width: "100%",
      height: "100%",
    },

    placeholder: {
      color: COLORS.textSecondary,
    },

    button: {
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.buttonPadding,
      paddingHorizontal: SPACING.xl,
      borderRadius: SPACING.radiusMd,
    },

    buttonText: {
      color: COLORS.textLight,
      fontSize: 16,
      fontWeight: "600",
    },
  });