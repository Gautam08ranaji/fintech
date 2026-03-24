// app/(tabs)/kyc/index.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface KYCDocument {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  status: "pending" | "completed" | "in-progress";
  color: string;
}

export default function KYCOptions() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);

  // Mock KYC Status (in real app, fetch from API)
  const [kycStatus, setKycStatus] = useState({
    aadhaar: "pending",
    selfie: "pending",
    panCard: "pending",
    bankDetails: "pending",
  });

  const kycDocuments: KYCDocument[] = [
    {
      id: "aadhaar",
      title: "Aadhaar KYC",
      description: "Verify using Aadhaar details",
      icon: "card-outline",
      route: "/(tabs)/kyc/aadhaar",
      status: kycStatus.aadhaar as "pending" | "completed" | "in-progress",
      color: "#3B82F6",
    },
    {
      id: "selfie",
      title: "Selfie Verification",
      description: "Capture selfie for identity check",
      icon: "camera-outline",
      route: "/(tabs)/kyc/selfie",
      status: kycStatus.selfie as "pending" | "completed" | "in-progress",
      color: "#10B981",
    },
    {
      id: "pan",
      title: "PAN Card",
      description: "Upload PAN card for verification",
      icon: "document-text-outline",
      route: "/(tabs)/kyc/aadhaar",
      status: kycStatus.panCard as "pending" | "completed" | "in-progress",
      color: "#F59E0B",
    },
    {
      id: "bank",
      title: "Bank Details",
      description: "Add bank account details",
      icon: "business-outline",
      route: "/(tabs)/kyc/bank",
      status: kycStatus.bankDetails as "pending" | "completed" | "in-progress",
      color: "#8B5CF6",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "in-progress":
        return "time";
      default:
        return "alert-circle";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "in-progress":
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Verified";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const calculateKYCProgress = () => {
    const completed = Object.values(kycStatus).filter(s => s === "completed").length;
    const total = Object.values(kycStatus).length;
    return (completed / total) * 100;
  };

  const handleDocumentPress = (document: KYCDocument) => {
    if (document.status === "completed") {
      setSelectedDocument(document);
      setShowInfoModal(true);
    } else {
      router.push(document.route as any);
    }
  };

  const getCardStyles = (item: KYCDocument): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.documentCard];
    
    if (item.status === "completed") {
      baseStyles.push(styles.completedCard as ViewStyle);
    }
    
    if (item.status === "in-progress") {
      baseStyles.push(styles.inProgressCard as ViewStyle);
    }
    
    return baseStyles;
  };

  const renderKYCDocument = (item: KYCDocument) => (
    <Card
      key={item.id}
      elevation="sm"
      padding="md"
      style={getCardStyles(item)}
      onPress={() => handleDocumentPress(item)}
    >
      <View style={styles.documentHeader}>
        <View style={[styles.documentIcon, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon as any} size={28} color={item.color} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>{item.title}</Text>
          <Text style={styles.documentDescription}>{item.description}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <BodyLayout type="screen" title="KYC Verification">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Identity Verification</Text>
          <Text style={styles.headerSubtitle}>
            Complete your KYC to unlock all features and get higher loan limits
          </Text>
        </View>

        {/* Progress Card */}
        <Card elevation="md" padding="lg" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>KYC Completion</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(calculateKYCProgress())}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${calculateKYCProgress()}%`, backgroundColor: COLORS.success },
              ]}
            />
          </View>
          <Text style={styles.progressHint}>
            Complete all steps to get verified
          </Text>
        </Card>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          {kycDocuments.map(renderKYCDocument)}
        </View>

        {/* Benefits Section */}
        <Card elevation="sm" padding="lg" style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Benefits of KYC</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Higher loan limits up to $50,000</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Lower interest rates</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Instant loan approvals</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Priority customer support</Text>
          </View>
        </Card>

        {/* Support Section */}
        <Card elevation="sm" padding="md" style={styles.supportCard}>
          <View style={styles.supportContent}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
            <View style={styles.supportText}>
              <Text style={styles.supportTitle}>Need help with KYC?</Text>
              <Text style={styles.supportDesc}>
                Contact our support team for assistance
              </Text>
            </View>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={[styles.supportButtonText, { color: COLORS.primary }]}>
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent} padding="lg" elevation="lg">
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: `${COLORS.success}20` }]}>
                <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
              </View>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalTitle}>Already Verified</Text>
            <Text style={styles.modalDescription}>
              {selectedDocument?.title} has already been verified. You don't need to submit again.
            </Text>
            
            <View style={styles.modalDivider} />
            
            <View style={styles.modalInfo}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.info} />
              <Text style={styles.modalInfoText}>
                If you need to update your information, please contact support.
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
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
    progressCard: {
      marginBottom: SPACING.lg,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    progressTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
    },
    progressPercentage: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.primary,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: COLORS.border,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: SPACING.sm,
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
    },
    progressHint: {
      fontSize: 11,
      color: COLORS.textSecondary,
    },
    section: {
      marginBottom: SPACING.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    documentCard: {
      marginBottom: SPACING.md,
    },
    completedCard: {
      opacity: 0.8,
    },
    inProgressCard: {
      borderWidth: 1,
      borderColor: COLORS.warning,
    },
    documentHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    documentIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    documentInfo: {
      flex: 1,
    },
    documentTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 2,
    },
    documentDescription: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: SPACING.radiusSm,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "500",
    },
    benefitsCard: {
      marginBottom: SPACING.md,
    },
    benefitsTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      marginBottom: SPACING.sm,
    },
    benefitText: {
      fontSize: 13,
      color: COLORS.text,
      flex: 1,
    },
    supportCard: {
      marginBottom: SPACING.md,
    },
    supportContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    supportText: {
      flex: 1,
    },
    supportTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
    },
    supportDesc: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    supportButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    supportButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "85%",
      maxWidth: 340,
      borderRadius: SPACING.radiusLg,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    modalIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: SPACING.sm,
      textAlign: "center",
    },
    modalDescription: {
      fontSize: 14,
      color: COLORS.textSecondary,
      textAlign: "center",
      marginBottom: SPACING.md,
      lineHeight: 20,
    },
    modalDivider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: SPACING.md,
    },
    modalInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor: `${COLORS.info}10`,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      marginBottom: SPACING.md,
    },
    modalInfoText: {
      flex: 1,
      fontSize: 12,
      color: COLORS.textSecondary,
      lineHeight: 18,
    },
    modalButton: {
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
    },
    modalButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });