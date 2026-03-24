// app/(tabs)/payment/index.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  loanId: string;
  loanName: string;
}

export default function PaymentScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");

  // Mock data - Active Loans for Payment
  const activeLoans = [
    {
      id: "1",
      loanName: "Personal Loan",
      amount: 5000,
      remainingAmount: 3250,
      emiAmount: 450,
      dueDate: "2024-04-15",
      interestRate: 8.5,
    },
    {
      id: "2",
      loanName: "Home Renovation",
      amount: 10000,
      remainingAmount: 8750,
      emiAmount: 725,
      dueDate: "2024-05-20",
      interestRate: 7.2,
    },
  ];

  // Mock payment history
  const paymentHistory: PaymentHistory[] = [
    {
      id: "1",
      amount: 450,
      date: "2024-03-15",
      status: "completed",
      loanId: "1",
      loanName: "Personal Loan",
    },
    {
      id: "2",
      amount: 725,
      date: "2024-02-15",
      status: "completed",
      loanId: "2",
      loanName: "Home Renovation",
    },
    {
      id: "3",
      amount: 450,
      date: "2024-01-15",
      status: "completed",
      loanId: "1",
      loanName: "Personal Loan",
    },
    {
      id: "4",
      amount: 2500,
      date: "2024-03-10",
      status: "pending",
      loanId: "2",
      loanName: "Home Renovation",
    },
  ];

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "pending":
        return COLORS.warning;
      case "failed":
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "failed":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const handleMakePayment = (loan: any) => {
    setSelectedLoan(loan);
    setPaymentAmount(loan.emiAmount.toString());
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid payment amount");
      return;
    }

    // Process payment logic here
    Alert.alert(
      "Payment Initiated",
      `Payment of ${formatAmount(parseFloat(paymentAmount))} for ${selectedLoan.loanName} has been initiated.`,
      [{ text: "OK", onPress: () => setShowPaymentModal(false) }]
    );
  };

  const renderLoanCard = (loan: any) => (
    <Card key={loan.id} elevation="md" padding="lg" style={styles.loanCard}>
      <View style={styles.loanHeader}>
        <View>
          <Text style={styles.loanName}>{loan.loanName}</Text>
          <Text style={styles.loanId}>Loan ID: #{loan.id}</Text>
        </View>
        <View style={[styles.loanStatus, { backgroundColor: `${COLORS.info}20` }]}>
          <Text style={[styles.loanStatusText, { color: COLORS.info }]}>ACTIVE</Text>
        </View>
      </View>

      <View style={styles.loanDetails}>
        <View>
          <Text style={styles.loanLabel}>Total Loan</Text>
          <Text style={styles.loanAmount}>{formatAmount(loan.amount)}</Text>
        </View>
        <View>
          <Text style={styles.loanLabel}>Remaining</Text>
          <Text style={styles.loanRemaining}>{formatAmount(loan.remainingAmount)}</Text>
        </View>
        <View>
          <Text style={styles.loanLabel}>EMI Amount</Text>
          <Text style={styles.loanEmi}>{formatAmount(loan.emiAmount)}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%`,
              backgroundColor: COLORS.success,
            },
          ]}
        />
      </View>

      <View style={styles.loanFooter}>
        <View>
          <Text style={styles.dueLabel}>Next EMI Due</Text>
          <Text style={styles.dueDate}>{new Date(loan.dueDate).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: COLORS.primary }]}
          onPress={() => handleMakePayment(loan)}
        >
          <Ionicons name="card-outline" size={18} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderPaymentHistory = (item: PaymentHistory) => (
    <Card key={item.id} elevation="sm" padding="md" style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.historyLeft}>
          <View
            style={[
              styles.historyIcon,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Ionicons
              name={getStatusIcon(item.status)}
              size={20}
              color={getStatusColor(item.status)}
            />
          </View>
          <View>
            <Text style={styles.historyLoanName}>{item.loanName}</Text>
            <Text style={styles.historyDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.historyRight}>
          <Text style={styles.historyAmount}>{formatAmount(item.amount)}</Text>
          <View
            style={[
              styles.historyStatusBadge,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Text
              style={[
                styles.historyStatusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
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
          <Text style={styles.headerTitle}>Payments</Text>
          <Text style={styles.headerSubtitle}>Manage your loan repayments</Text>
        </View>

        {/* Balance Summary */}
        <Card elevation="sm" padding="md" style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Due</Text>
              <Text style={styles.summaryValue}>
                {formatAmount(
                  activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
                )}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Upcoming EMI</Text>
              <Text style={styles.summaryValue}>
                {formatAmount(
                  activeLoans.reduce((sum, loan) => sum + loan.emiAmount, 0)
                )}
              </Text>
            </View>
          </View>
        </Card>

        {/* Active Loans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Loans</Text>
          {activeLoans.map(renderLoanCard)}
        </View>

        {/* Payment History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {paymentHistory.map(renderPaymentHistory)}
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent} padding="lg" elevation="lg">
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make Payment</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedLoan && (
                <>
                  <View style={styles.paymentLoanInfo}>
                    <Text style={styles.paymentLoanName}>{selectedLoan.loanName}</Text>
                    <Text style={styles.paymentLoanId}>Loan ID: #{selectedLoan.id}</Text>
                  </View>

                  {/* Payment Method Selection */}
                  <Text style={styles.inputLabel}>Payment Method</Text>
                  <View style={styles.paymentMethods}>
                    <TouchableOpacity
                      style={[
                        styles.paymentMethod,
                        paymentMethod === "card" && styles.paymentMethodSelected,
                      ]}
                      onPress={() => setPaymentMethod("card")}
                    >
                      <Ionicons
                        name="card-outline"
                        size={24}
                        color={paymentMethod === "card" ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text
                        style={[
                          styles.paymentMethodText,
                          { color: paymentMethod === "card" ? COLORS.primary : COLORS.textSecondary },
                        ]}
                      >
                        Card
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.paymentMethod,
                        paymentMethod === "upi" && styles.paymentMethodSelected,
                      ]}
                      onPress={() => setPaymentMethod("upi")}
                    >
                      <Ionicons
                        name="phone-portrait-outline"
                        size={24}
                        color={paymentMethod === "upi" ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text
                        style={[
                          styles.paymentMethodText,
                          { color: paymentMethod === "upi" ? COLORS.primary : COLORS.textSecondary },
                        ]}
                      >
                        UPI
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.paymentMethod,
                        paymentMethod === "netbanking" && styles.paymentMethodSelected,
                      ]}
                      onPress={() => setPaymentMethod("netbanking")}
                    >
                      <Ionicons
                        name="business-outline"
                        size={24}
                        color={paymentMethod === "netbanking" ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text
                        style={[
                          styles.paymentMethodText,
                          { color: paymentMethod === "netbanking" ? COLORS.primary : COLORS.textSecondary },
                        ]}
                      >
                        Net Banking
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Payment Amount */}
                  <Text style={styles.inputLabel}>Payment Amount</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: COLORS.background,
                        color: COLORS.text,
                        borderColor: COLORS.border,
                      },
                    ]}
                    placeholder="Enter amount"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                  />

                  {/* EMI Info */}
                  <Card backgroundColor={`${COLORS.primary}10`} padding="md" elevation="none" style={styles.emiInfo}>
                    <Text style={styles.emiInfoLabel}>EMI Amount</Text>
                    <Text style={styles.emiInfoValue}>{formatAmount(selectedLoan.emiAmount)}</Text>
                  </Card>

                  {/* Submit Button */}
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPayment}>
                    <Text style={styles.submitButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
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
    summaryCard: {
      marginBottom: SPACING.lg,
    },
    summaryContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    summaryLabel: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: SPACING.xs,
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.primary,
    },
    summaryDivider: {
      width: 1,
      height: 40,
      backgroundColor: COLORS.border,
    },
    section: {
      marginBottom: SPACING.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: COLORS.text,
    },
    seeAllText: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: "500",
    },
    loanCard: {
      marginBottom: SPACING.md,
    },
    loanHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SPACING.md,
    },
    loanName: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },
    loanId: {
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
    loanEmi: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.info,
    },
    progressContainer: {
      height: 4,
      backgroundColor: COLORS.border,
      borderRadius: 2,
      marginBottom: SPACING.md,
    },
    progressBar: {
      height: "100%",
      borderRadius: 2,
    },
    loanFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dueLabel: {
      fontSize: 11,
      color: COLORS.textSecondary,
    },
    dueDate: {
      fontSize: 12,
      fontWeight: "500",
      color: COLORS.text,
      marginTop: 2,
    },
    payButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xs,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.radiusMd,
    },
    payButtonText: {
      fontSize: 12,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    historyCard: {
      marginBottom: SPACING.sm,
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    historyLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    historyIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    historyLoanName: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
    },
    historyDate: {
      fontSize: 11,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    historyRight: {
      alignItems: "flex-end",
      gap: 4,
    },
    historyAmount: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
    },
    historyStatusBadge: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
      borderRadius: SPACING.radiusSm,
    },
    historyStatusText: {
      fontSize: 10,
      fontWeight: "500",
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: COLORS.overlay,
      justifyContent: "flex-end",
    },
    modalContent: {
      borderTopLeftRadius: SPACING.radiusLg,
      borderTopRightRadius: SPACING.radiusLg,
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.text,
    },
    paymentLoanInfo: {
      marginBottom: SPACING.lg,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    paymentLoanName: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },
    paymentLoanId: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
      marginBottom: SPACING.sm,
      marginTop: SPACING.md,
    },
    input: {
      borderWidth: 1,
      borderRadius: SPACING.radiusMd,
      padding: SPACING.md,
      fontSize: 16,
    },
    paymentMethods: {
      flexDirection: "row",
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    paymentMethod: {
      flex: 1,
      alignItems: "center",
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      borderWidth: 1,
      borderColor: COLORS.border,
      gap: SPACING.xs,
    },
    paymentMethodSelected: {
      borderColor: COLORS.primary,
      backgroundColor: `${COLORS.primary}10`,
    },
    paymentMethodText: {
      fontSize: 12,
      fontWeight: "500",
    },
    emiInfo: {
      marginTop: SPACING.md,
      alignItems: "center",
    },
    emiInfoLabel: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: SPACING.xs,
    },
    emiInfoValue: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.primary,
    },
    submitButton: {
      backgroundColor: COLORS.primary,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
      marginTop: SPACING.lg,
      marginBottom: SPACING.lg,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });