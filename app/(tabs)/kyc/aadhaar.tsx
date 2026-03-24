// app/(tabs)/kyc/aadhaar.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [isLoading, setIsLoading] = useState(false);
  const [aadhaarFocused, setAadhaarFocused] = useState(false);
  const [panFocused, setPanFocused] = useState(false);

  const formatAadhaar = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");
    // Format as XXXX XXXX XXXX
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
  };

  const formatPAN = (text: string) => {
    return text.toUpperCase().replace(/[^A-Z0-9]/g, "");
  };

  const handleAadhaarChange = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    if (cleaned.length <= 12) {
      setAadhaar(cleaned);
    }
  };

  const handlePanChange = (text: string) => {
    const formatted = formatPAN(text);
    if (formatted.length <= 10) {
      setPan(formatted);
    }
  };

  const validateAadhaar = (number: string) => {
    if (number.length !== 12) return false;
    // Check if all are digits
    if (!/^\d+$/.test(number)) return false;
    // Basic checksum validation (simplified)
    const firstDigit = parseInt(number[0]);
    if (firstDigit < 2 || firstDigit > 9) return false;
    return true;
  };

  const validatePAN = (number: string) => {
    if (number.length !== 10) return false;
    // PAN format: 5 letters + 4 digits + 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(number);
  };

  const handleSubmit = async () => {
    if (!validateAadhaar(aadhaar)) {
      Alert.alert(
        "Invalid Aadhaar",
        "Please enter a valid 12-digit Aadhaar number"
      );
      return;
    }

    if (!validatePAN(pan)) {
      Alert.alert(
        "Invalid PAN",
        "Please enter a valid PAN number (Format: ABCDE1234F)"
      );
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "KYC Submitted",
        "Your Aadhaar KYC has been submitted successfully. We will verify and update your status within 24 hours.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  return (
    <BodyLayout type="screen" title="Aadhaar KYC">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Aadhaar Verification</Text>
            <Text style={styles.headerSubtitle}>
              Verify your identity using Aadhaar and PAN card
            </Text>
          </View>

          {/* Info Card */}
          <Card elevation="sm" padding="md" style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.info} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Secure & Encrypted</Text>
                <Text style={styles.infoDescription}>
                  Your information is encrypted and securely stored
                </Text>
              </View>
            </View>
          </Card>

          {/* Main Form Card */}
          <Card elevation="md" padding="lg" style={styles.formCard}>
            {/* Aadhaar Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Aadhaar Number <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  aadhaarFocused && styles.inputFocused,
                  aadhaar.length === 12 && aadhaar !== "" && styles.inputValid,
                ]}
              >
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={
                    aadhaarFocused
                      ? COLORS.primary
                      : aadhaar.length === 12 && aadhaar !== ""
                      ? COLORS.success
                      : COLORS.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  value={formatAadhaar(aadhaar)}
                  onChangeText={handleAadhaarChange}
                  keyboardType="numeric"
                  maxLength={14} // 12 digits + 2 spaces
                  placeholder="XXXX XXXX XXXX"
                  placeholderTextColor={COLORS.textSecondary}
                  style={[styles.input, { color: COLORS.text }]}
                  onFocus={() => setAadhaarFocused(true)}
                  onBlur={() => setAadhaarFocused(false)}
                />
                {aadhaar.length === 12 && aadhaar !== "" && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                )}
              </View>
              <Text style={styles.hint}>Enter 12-digit Aadhaar number</Text>
            </View>

            {/* PAN Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                PAN Number <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  panFocused && styles.inputFocused,
                  pan.length === 10 && pan !== "" && styles.inputValid,
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={
                    panFocused
                      ? COLORS.primary
                      : pan.length === 10 && pan !== ""
                      ? COLORS.success
                      : COLORS.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  value={pan}
                  onChangeText={handlePanChange}
                  autoCapitalize="characters"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  placeholderTextColor={COLORS.textSecondary}
                  style={[styles.input, { color: COLORS.text }]}
                  onFocus={() => setPanFocused(true)}
                  onBlur={() => setPanFocused(false)}
                />
                {pan.length === 10 && pan !== "" && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                )}
              </View>
              <Text style={styles.hint}>Format: 5 letters + 4 digits + 1 letter</Text>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.disclaimerText}>
                Your Aadhaar and PAN details are used for identity verification only
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: COLORS.primary },
                (!aadhaar || !pan) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!aadhaar || !pan || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit KYC</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </Card>

          {/* Help Section */}
          <Card elevation="sm" padding="md" style={styles.helpCard}>
            <View style={styles.helpContent}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDescription}>
                  If you don't have Aadhaar or PAN, contact our support team
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.helpButton, { color: COLORS.primary }]}>
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    contentContainer: {
      padding: SPACING.screenPadding,
      paddingBottom: SPACING.xxl,
    },
    headerSection: {
      marginBottom: SPACING.lg,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },
    headerSubtitle: {
      fontSize: 14,
      color: COLORS.textSecondary,
      lineHeight: 20,
    },
    infoCard: {
      marginBottom: SPACING.lg,
    },
    infoContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    infoText: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 2,
    },
    infoDescription: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    formCard: {
      marginBottom: SPACING.md,
    },
    inputContainer: {
      marginBottom: SPACING.md,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    required: {
      color: COLORS.error,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.radiusMd,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.background,
    },
    inputFocused: {
      borderColor: COLORS.primary,
      borderWidth: 2,
    },
    inputValid: {
      borderColor: COLORS.success,
    },
    inputIcon: {
      marginRight: SPACING.sm,
    },
    input: {
      flex: 1,
      paddingVertical: SPACING.md,
      fontSize: 16,
    },
    hint: {
      fontSize: 11,
      color: COLORS.textSecondary,
      marginTop: 4,
      marginLeft: 4,
    },
    disclaimer: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor: `${COLORS.warning}10`,
      padding: SPACING.sm,
      borderRadius: SPACING.radiusSm,
      marginTop: SPACING.md,
    },
    disclaimerText: {
      flex: 1,
      fontSize: 11,
      color: COLORS.textSecondary,
      lineHeight: 16,
    },
    submitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      marginTop: SPACING.lg,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    helpCard: {
      marginBottom: SPACING.md,
    },
    helpContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    helpText: {
      flex: 1,
    },
    helpTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
    },
    helpDescription: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    helpButton: {
      fontSize: 14,
      fontWeight: "500",
    },
  });