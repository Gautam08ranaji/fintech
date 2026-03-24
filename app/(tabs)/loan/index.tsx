// app/(tabs)/loan/index.tsx (LoanOffers)
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LoanOffer {
  id: string;
  amount: number;
  description: string;
  interestRate: string;
  tenure: string;
  processingFee: string;
  minCreditScore: number;
  featured?: boolean;
  icon: string;
  color: string;
}

interface ActiveLoan {
  id: string;
  amount: number;
  remainingAmount: number;
  dueDate: string;
  status: "active" | "completed" | "overdue" | "pending";
  interestRate: number;
  tenure: number;
  purpose: string;
}

export default function LoanOffers() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [selectedActiveLoan, setSelectedActiveLoan] = useState<ActiveLoan | null>(null);

  const loanOffers: LoanOffer[] = [
    {
      id: "1",
      amount: 50000,
      description: "Instant Personal Loan",
      interestRate: "10.5%",
      tenure: "12 Months",
      processingFee: "1.5%",
      minCreditScore: 650,
      featured: true,
      icon: "flash",
      color: "#3B82F6",
    },
    {
      id: "2",
      amount: 100000,
      description: "Premium Loan Offer",
      interestRate: "9.0%",
      tenure: "24 Months",
      processingFee: "1.0%",
      minCreditScore: 700,
      icon: "star",
      color: "#10B981",
    },
    {
      id: "3",
      amount: 250000,
      description: "Business Expansion",
      interestRate: "11.0%",
      tenure: "36 Months",
      processingFee: "2.0%",
      minCreditScore: 680,
      icon: "business",
      color: "#F59E0B",
    },
    {
      id: "4",
      amount: 15000,
      description: "Emergency Loan",
      interestRate: "12.0%",
      tenure: "6 Months",
      processingFee: "1.0%",
      minCreditScore: 600,
      icon: "warning",
      color: "#EF4444",
    },
  ];

  // Mock active loans data (same as in HomeScreen)
  const activeLoans: ActiveLoan[] = [
    { id: "1", amount: 5000, remainingAmount: 3250, dueDate: "2024-04-15", status: "active", interestRate: 8.5, tenure: 24, purpose: "Personal Loan" },
    { id: "2", amount: 10000, remainingAmount: 8750, dueDate: "2024-05-20", status: "active", interestRate: 7.2, tenure: 36, purpose: "Home Renovation" },
  ];

  // Handle incoming loan ID from navigation
  useEffect(() => {
    if (id) {
      const loan = activeLoans.find(loan => loan.id === id);
      if (loan) {
        setSelectedActiveLoan(loan);
        // Auto-expand the selected loan
        setSelectedLoan(id);
      }
    }
  }, [id]);

  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatUSD = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return COLORS.info;
      case "completed":
        return COLORS.success;
      case "overdue":
        return COLORS.error;
      case "pending":
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const handleApplyNow = (loan: LoanOffer) => {
    router.push({
      pathname: "/(tabs)/loan/details",
      params: {
        id: loan.id,
        amount: loan.amount.toString(),
        description: loan.description,
        interestRate: loan.interestRate,
        tenure: loan.tenure,
      },
    });
  };

  const renderActiveLoanDetails = () => {
    if (!selectedActiveLoan) return null;

    const progress = ((selectedActiveLoan.amount - selectedActiveLoan.remainingAmount) / selectedActiveLoan.amount) * 100;

    return (
      <View style={styles.activeLoanContainer}>
        <Text style={styles.sectionTitle}>Your Loan Details</Text>
        <Card elevation="md" padding="lg" style={styles.activeLoanCard}>
          <View style={styles.loanHeader}>
            <View>
              <Text style={styles.loanTitle}>{selectedActiveLoan.purpose}</Text>
              <Text style={styles.loanSubtitle}>Loan ID: #{selectedActiveLoan.id}</Text>
            </View>
            <View style={[styles.loanStatus, { backgroundColor: `${getStatusColor(selectedActiveLoan.status)}20` }]}>
              <Text style={[styles.loanStatusText, { color: getStatusColor(selectedActiveLoan.status) }]}>
                {selectedActiveLoan.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.loanDetails}>
            <View>
              <Text style={styles.loanLabel}>Loan Amount</Text>
              <Text style={styles.loanAmount}>{formatUSD(selectedActiveLoan.amount)}</Text>
            </View>
            <View>
              <Text style={styles.loanLabel}>Remaining</Text>
              <Text style={styles.loanRemaining}>{formatUSD(selectedActiveLoan.remainingAmount)}</Text>
            </View>
            <View>
              <Text style={styles.loanLabel}>Interest</Text>
              <Text style={styles.loanInterest}>{selectedActiveLoan.interestRate}%</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: COLORS.success }]} />
          </View>

          <View style={styles.loanFooter}>
            <Text style={styles.dueDate}>
              Next EMI: {new Date(selectedActiveLoan.dueDate).toLocaleDateString()}
            </Text>
            <TouchableOpacity style={[styles.payButton, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );
  };

  const renderLoanCard = (item: LoanOffer) => (
    <Card
      key={item.id}
      elevation="md"
      padding="lg"
      style={[styles.loanCard, item.featured && styles.featuredCard]}
      onPress={() => setSelectedLoan(selectedLoan === item.id ? null : item.id)}
    >
      {/* Featured Badge */}
      {item.featured && (
        <View style={[styles.featuredBadge, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.featuredText}>🔥 Featured</Text>
        </View>
      )}

      {/* Header with Icon and Amount */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon as any} size={32} color={item.color} />
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Loan Amount</Text>
          <Text style={styles.amount}>{formatAmount(item.amount)}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Loan Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="trending-up" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailLabel}>Interest Rate</Text>
          <Text style={styles.detailValue}>{item.interestRate}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailLabel}>Tenure</Text>
          <Text style={styles.detailValue}>{item.tenure}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="receipt" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailLabel}>Processing Fee</Text>
          <Text style={styles.detailValue}>{item.processingFee}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailLabel}>Min. Credit Score</Text>
          <Text style={styles.detailValue}>{item.minCreditScore}+</Text>
        </View>
      </View>

      {/* Expandable Section */}
      {selectedLoan === item.id && (
        <View style={styles.expandedSection}>
          <View style={styles.divider} />
          <Text style={styles.expandedTitle}>Key Benefits</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.benefitText}>Instant approval within 24 hours</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.benefitText}>No prepayment charges</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.benefitText}>Flexible EMI options</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.benefitText}>Minimal documentation</Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: COLORS.border }]}
          onPress={() => setSelectedLoan(selectedLoan === item.id ? null : item.id)}
        >
          <Text style={[styles.detailsButtonText, { color: COLORS.textSecondary }]}>
            {selectedLoan === item.id ? "Show Less" : "View Details"}
          </Text>
          <Ionicons
            name={selectedLoan === item.id ? "chevron-up" : "chevron-down"}
            size={18}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.applyButton, { backgroundColor: COLORS.primary }]}
          onPress={() => handleApplyNow(item)}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <BodyLayout type="dashboard">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Loan Offers</Text>
          <Text style={styles.headerSubtitle}>
            Choose from our curated loan offers tailored for you
          </Text>
        </View>

        {/* Active Loan Details - Shown when ID is passed */}
        {selectedActiveLoan && renderActiveLoanDetails()}

        {/* Eligibility Card - Only show if no active loan is selected */}
        {!selectedActiveLoan && (
          <Card elevation="sm" padding="md" style={styles.eligibilityCard}>
            <View style={styles.eligibilityContent}>
              <View style={[styles.eligibilityIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                <Ionicons name="checkmark-done-circle" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.eligibilityText}>
                <Text style={styles.eligibilityTitle}>Pre-qualified for loans up to ₹5,00,000</Text>
                <Text style={styles.eligibilityDesc}>Based on your credit score and history</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Loan Cards - Only show if no active loan is selected */}
        {!selectedActiveLoan && loanOffers.map(renderLoanCard)}
      </ScrollView>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    contentContainer: {
      // padding: SPACING.screenPadding,
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
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    activeLoanContainer: {
      marginBottom: SPACING.lg,
    },
    activeLoanCard: {
      marginBottom: SPACING.md,
    },
    eligibilityCard: {
      marginBottom: SPACING.lg,
    },
    eligibilityContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    eligibilityIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    eligibilityText: {
      flex: 1,
    },
    eligibilityTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 2,
    },
    eligibilityDesc: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    loanCard: {
      marginBottom: SPACING.md,
      position: "relative",
    },
    featuredCard: {
      borderWidth: 1,
      borderColor: COLORS.primary,
    },
    featuredBadge: {
      position: "absolute",
      top: -10,
      right: SPACING.md,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: SPACING.radiusSm,
      zIndex: 1,
    },
    featuredText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "600",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.md,
      gap: SPACING.md,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    amountContainer: {
      flex: 1,
    },
    amountLabel: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: 2,
    },
    amount: {
      fontSize: 28,
      fontWeight: "700",
      color: COLORS.text,
    },
    description: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    detailItem: {
      flex: 1,
      minWidth: "45%",
    },
    detailLabel: {
      fontSize: 11,
      color: COLORS.textSecondary,
      marginBottom: 2,
      marginTop: 4,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
    },
    expandedSection: {
      marginTop: SPACING.md,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginBottom: SPACING.md,
    },
    expandedTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    benefitsList: {
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    benefitText: {
      fontSize: 13,
      color: COLORS.text,
      flex: 1,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: SPACING.sm,
      marginTop: SPACING.md,
    },
    detailsButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.xs,
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.radiusMd,
      borderWidth: 1,
    },
    detailsButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    applyButton: {
      flex: 1.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.xs,
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.radiusMd,
    },
    applyButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    // Active loan styles
    loanHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SPACING.md,
    },
    loanTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: COLORS.text,
    },
    loanSubtitle: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    loanStatus: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: SPACING.radiusSm,
    },
    loanStatusText: {
      fontSize: 10,
      fontWeight: "600",
    },
    loanDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: SPACING.md,
    },
    loanLabel: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: 4,
    },
    loanAmount: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },
    loanRemaining: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.warning,
    },
    loanInterest: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.info,
    },
    progressContainer: {
      height: 6,
      backgroundColor: COLORS.border,
      borderRadius: 3,
      marginBottom: SPACING.md,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: 3,
    },
    loanFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dueDate: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    payButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: SPACING.radiusSm,
    },
    payButtonText: {
      fontSize: 12,
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });