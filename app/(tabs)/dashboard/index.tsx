// app/(tabs)/index.tsx (HomeScreen with Card Component)
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";

import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

// Types
interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface Loan {
  id: string;
  amount: number;
  remainingAmount: number;
  dueDate: string;
  status: "active" | "completed" | "overdue" | "pending";
  interestRate: number;
  tenure: number;
  purpose: string;
}

interface LoanApplication {
  amount: string;
  tenure: string;
  purpose: string;
  employmentType: string;
  monthlyIncome: string;
}

export default function HomeScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState<string>("personal");
  const [loanApplication, setLoanApplication] = useState<LoanApplication>({
    amount: "",
    tenure: "",
    purpose: "",
    employmentType: "",
    monthlyIncome: "",
  });

  // Mock Data
  const userData = {
    name: "Alex Johnson",
    welcomeBack: "Welcome back,",
    balance: 24580.75,
    currency: "USD",
    creditScore: 742,
    creditScoreChange: +12,
    accountNumber: "****1234",
    memberSince: "2023",
  };

  const quickActions = [
    { id: "kyc", title: "KYC", icon: "document-text-outline", route: "/(tabs)/kyc", color: "#3B82F6" },
    { id: "loan", title: "Apply Loan", icon: "cash-outline", route: "", color: "#10B981", action: "apply" },
    { id: "payment", title: "Payment", icon: "card-outline", route: "/(tabs)/payment", color: "#F59E0B" },
    { id: "profile", title: "Profile", icon: "person-outline", route: "/(tabs)/profile", color: "#8B5CF6" },
  ];

  const loanProducts = [
    { id: "personal", name: "Personal Loan", minAmount: 1000, maxAmount: 50000, interestRate: "10.5%", tenure: "1-5 years", icon: "person", color: "#3B82F6" },
    { id: "home", name: "Home Loan", minAmount: 50000, maxAmount: 500000, interestRate: "7.2%", tenure: "5-30 years", icon: "home", color: "#10B981" },
    { id: "auto", name: "Auto Loan", minAmount: 5000, maxAmount: 80000, interestRate: "8.5%", tenure: "1-7 years", icon: "car", color: "#F59E0B" },
    { id: "education", name: "Education Loan", minAmount: 2000, maxAmount: 100000, interestRate: "9.0%", tenure: "1-10 years", icon: "school", color: "#8B5CF6" },
  ];

  const recentTransactions: Transaction[] = [
    { id: "1", type: "debit", amount: 450.0, description: "Loan Repayment - EMI", date: "2024-03-20", status: "completed" },
    { id: "2", type: "credit", amount: 2500.0, description: "Salary Deposit", date: "2024-03-19", status: "completed" },
    { id: "3", type: "debit", amount: 89.99, description: "Netflix Subscription", date: "2024-03-18", status: "completed" },
    { id: "4", type: "credit", amount: 120.0, description: "Referral Bonus", date: "2024-03-17", status: "pending" },
    { id: "5", type: "debit", amount: 320.0, description: "ATM Withdrawal", date: "2024-03-16", status: "completed" },
  ];

  const activeLoans: Loan[] = [
    { id: "1", amount: 5000, remainingAmount: 3250, dueDate: "2024-04-15", status: "active", interestRate: 8.5, tenure: 24, purpose: "Personal Loan" },
    { id: "2", amount: 10000, remainingAmount: 8750, dueDate: "2024-05-20", status: "active", interestRate: 7.2, tenure: 36, purpose: "Home Renovation" },
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [2000, 2500, 1800, 3200, 2800, 3800] }],
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTransactionIcon = (type: string) => {
    return type === "credit" ? "arrow-down-circle" : "arrow-up-circle";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "pending":
        return COLORS.warning;
      case "failed":
        return COLORS.error;
      case "active":
        return COLORS.info;
      case "overdue":
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const handleLoanApplication = () => {
    if (!loanApplication.amount || !loanApplication.tenure || !loanApplication.purpose) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Loan Application:", { ...loanApplication, type: selectedLoanType });
    setShowLoanModal(false);
    alert("Loan application submitted successfully! We'll review it within 24 hours.");
    
    setLoanApplication({
      amount: "",
      tenure: "",
      purpose: "",
      employmentType: "",
      monthlyIncome: "",
    });
  };

  const calculateEMI = () => {
    if (!loanApplication.amount || !loanApplication.tenure) return 0;
    const amount = parseFloat(loanApplication.amount);
    const months = parseInt(loanApplication.tenure);
    const selectedProduct = loanProducts.find(p => p.id === selectedLoanType);
    const rate = parseFloat(selectedProduct?.interestRate || "10") / 12 / 100;
    const emi = amount * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    return isNaN(emi) ? 0 : emi;
  };

  const renderQuickAction = ({ item }: { item: typeof quickActions[0] }) => (
    <Card
      style={[styles.actionCard, { backgroundColor: `${item.color}15` }]}
      padding="md"
      elevation="none"
      onPress={() => item.action === "apply" ? setShowLoanModal(true) : router.push(item.route as any)}
    >
      <View style={[styles.actionIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.actionTitle}>{item.title}</Text>
    </Card>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card padding="md" elevation="sm">
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Ionicons
            name={getTransactionIcon(item.type)}
            size={24}
            color={item.type === "credit" ? COLORS.success : COLORS.error}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text
            style={[
              styles.amountText,
              { color: item.type === "credit" ? COLORS.success : COLORS.text },
            ]}
          >
            {item.type === "credit" ? "+" : "-"}
            {formatAmount(item.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

 const renderLoan = ({ item }: { item: Loan }) => {
  const progress = ((item.amount - item.remainingAmount) / item.amount) * 100;
  return (
    <Card
      onPress={() => router.push({
        pathname: "/(tabs)/loan",
        params: { id: item.id }
      })}
      elevation="md"
      footer={
        <View style={styles.loanFooter}>
          <Text style={styles.dueDate}>
            Next EMI: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.loanHeader}>
        <View>
          <Text style={styles.loanTitle}>{item.purpose}</Text>
          <Text style={styles.loanSubtitle}>Loan ID: #{item.id}</Text>
        </View>
        <View style={[styles.loanStatus, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.loanStatusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.loanDetails}>
        <View>
          <Text style={styles.loanLabel}>Loan Amount</Text>
          <Text style={styles.loanAmount}>{formatAmount(item.amount)}</Text>
        </View>
        <View>
          <Text style={styles.loanLabel}>Remaining</Text>
          <Text style={styles.loanRemaining}>{formatAmount(item.remainingAmount)}</Text>
        </View>
        <View>
          <Text style={styles.loanLabel}>Interest</Text>
          <Text style={styles.loanInterest}>{item.interestRate}%</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </Card>
  );
};

  const renderLoanProduct = ({ item }: { item: typeof loanProducts[0] }) => (
    <TouchableOpacity
      style={[styles.loanProductCard, selectedLoanType === item.id && styles.selectedLoanProduct]}
      onPress={() => setSelectedLoanType(item.id)}
    >
      <View style={[styles.loanProductIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon as any} size={28} color={item.color} />
      </View>
      <Text style={styles.loanProductName}>{item.name}</Text>
      <Text style={styles.loanProductRate}>{item.interestRate} APR</Text>
      <Text style={styles.loanProductRange}>
        {formatAmount(item.minAmount)} - {formatAmount(item.maxAmount)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BodyLayout type="dashboard">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>{userData.welcomeBack}</Text>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.accountNumber}>Account: {userData.accountNumber}</Text>
          </View>
          {/* <TouchableOpacity style={styles.notificationIcon} 
          // onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity> */}
        </View>

        {/* Balance Card */}
        <Card backgroundColor={COLORS.primary} padding="lg" elevation="md" style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>
            {userData.currency} {userData.balance.toLocaleString()}
          </Text>
          <View style={styles.creditScore}>
            <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.creditScoreText}>
              Credit Score: {userData.creditScore}
              <Text style={styles.creditScoreChange}>
                {" "}
                {userData.creditScoreChange > 0 ? "↑" : "↓"} {Math.abs(userData.creditScoreChange)}
              </Text>
            </Text>
          </View>
        </Card>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsContainer}
          />
        </View>

        {/* Pre-approved Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pre-approved Offers</Text>
            <TouchableOpacity 
            // onPress={() => router.push("/loans")}
              >
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Card style={styles.offerCard} padding="md" elevation="sm">
              <Text style={styles.offerAmount}>$25,000</Text>
              <Text style={styles.offerTitle}>Personal Loan</Text>
              <Text style={styles.offerRate}>8.5% APR</Text>
              <TouchableOpacity style={styles.offerButton}>
                <Text style={styles.offerButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </Card>
            <Card style={styles.offerCard} padding="md" elevation="sm">
              <Text style={styles.offerAmount}>$150,000</Text>
              <Text style={styles.offerTitle}>Home Loan</Text>
              <Text style={styles.offerRate}>6.9% APR</Text>
              <TouchableOpacity style={styles.offerButton}>
                <Text style={styles.offerButtonText}>Apply Now</Text>
              </TouchableOpacity>
            </Card>
          </ScrollView>
        </View>

        {/* Spending Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <View style={styles.periodSelector}>
              {["week", "month", "year"].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && { backgroundColor: COLORS.primary },
                  ]}
                  onPress={() => setSelectedPeriod(period as any)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period && { color: "#FFFFFF" },
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Card padding="md" elevation="sm">
            <LineChart
              data={chartData}
              width={width - SPACING.md * 2 - SPACING.md * 2}
              height={220}
              chartConfig={{
                backgroundColor: COLORS.card,
                backgroundGradientFrom: COLORS.card,
                backgroundGradientTo: COLORS.card,
                decimalPlaces: 0,
                color: (opacity = 1) => COLORS.primary,
                labelColor: (opacity = 1) => COLORS.textSecondary,
                style: { borderRadius: SPACING.radiusMd },
                propsForDots: { r: "6", strokeWidth: "2", stroke: COLORS.primary },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        </View>

        {/* Active Loans */}
        {activeLoans.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Loans</Text>
            <FlatList
              data={activeLoans}
              renderItem={renderLoan}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.loansContainer}
            />
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity 
            // onPress={() => router.push("/transactions")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.transactionsContainer}
          />
        </View>
      </ScrollView>

      {/* Loan Application Modal */}
      <Modal
        visible={showLoanModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLoanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent} padding="lg" elevation="lg">
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Loan</Text>
              <TouchableOpacity onPress={() => setShowLoanModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Loan Type Selection */}
              <Text style={styles.inputLabel}>Select Loan Type</Text>
              <FlatList
                data={loanProducts}
                renderItem={renderLoanProduct}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.loanProductsContainer}
              />

              {/* Loan Amount */}
              <Text style={styles.inputLabel}>Loan Amount</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.border }]}
                placeholder="Enter amount"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={loanApplication.amount}
                onChangeText={(text) => setLoanApplication({ ...loanApplication, amount: text })}
              />

              {/* Tenure */}
              <Text style={styles.inputLabel}>Tenure (Months)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.border }]}
                placeholder="Enter tenure in months"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={loanApplication.tenure}
                onChangeText={(text) => setLoanApplication({ ...loanApplication, tenure: text })}
              />

              {/* Monthly Income */}
              <Text style={styles.inputLabel}>Monthly Income</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.border }]}
                placeholder="Enter monthly income"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                value={loanApplication.monthlyIncome}
                onChangeText={(text) => setLoanApplication({ ...loanApplication, monthlyIncome: text })}
              />

              {/* Employment Type */}
              <Text style={styles.inputLabel}>Employment Type</Text>
              <View style={styles.employmentContainer}>
                {["Salaried", "Self-Employed", "Business"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.employmentOption,
                      loanApplication.employmentType === type && { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() => setLoanApplication({ ...loanApplication, employmentType: type })}
                  >
                    <Text style={[styles.employmentText, loanApplication.employmentType === type && { color: "#FFFFFF" }]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Loan Purpose */}
              <Text style={styles.inputLabel}>Loan Purpose</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: COLORS.background, color: COLORS.text, borderColor: COLORS.border }]}
                placeholder="Describe the purpose of the loan"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
                value={loanApplication.purpose}
                onChangeText={(text) => setLoanApplication({ ...loanApplication, purpose: text })}
              />

              {/* EMI Calculation */}
              {loanApplication.amount && loanApplication.tenure && (
                <Card backgroundColor={`${COLORS.primary}10`} padding="md" elevation="none" style={styles.emiContainer}>
                  <Text style={styles.emiLabel}>Estimated EMI</Text>
                  <Text style={styles.emiAmount}>{formatAmount(calculateEMI())}/month</Text>
                </Card>
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleLoanApplication}>
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>
            </ScrollView>
          </Card>
        </View>
      </Modal>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SPACING.lg,
    },
    welcomeText: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: 4,
    },
    userName: {
      fontSize: 24,
      fontWeight: "700",
      color: COLORS.text,
    },
    accountNumber: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginTop: 4,
    },
    notificationIcon: {
      position: "relative",
      padding: SPACING.sm,
    },
    notificationBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.error,
    },
    balanceCard: {
      marginBottom: SPACING.lg,
    },
    balanceLabel: {
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      marginBottom: SPACING.sm,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: SPACING.md,
    },
    creditScore: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    creditScoreText: {
      fontSize: 14,
      color: "rgba(255,255,255,0.9)",
    },
    creditScoreChange: {
      fontSize: 12,
      color: "#10B981",
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
    actionsContainer: {
      gap: SPACING.md,
    },
    actionCard: {
      width: 80,
      alignItems: "center",
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    actionTitle: {
      fontSize: 12,
      fontWeight: "500",
      color: COLORS.text,
    },
    chart: {
      borderRadius: SPACING.radiusMd,
    },
    periodSelector: {
      flexDirection: "row",
      gap: SPACING.sm,
    },
    periodButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: SPACING.radiusSm,
      backgroundColor: COLORS.border,
    },
    periodText: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    loansContainer: {
      gap: SPACING.md,
    },
    loanHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SPACING.md,
    },
    loanTitle: {
      fontSize: 16,
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
      height: 4,
      backgroundColor: COLORS.border,
      borderRadius: 2,
      marginBottom: SPACING.sm,
    },
    progressBar: {
      height: "100%",
      backgroundColor: COLORS.success,
      borderRadius: 2,
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
      backgroundColor: COLORS.primary,
      borderRadius: SPACING.radiusSm,
    },
    payButtonText: {
      fontSize: 12,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    transactionsContainer: {
      gap: SPACING.md,
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.md,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
      marginBottom: 4,
    },
    transactionDate: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    transactionAmount: {
      alignItems: "flex-end",
    },
    amountText: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
    },
    statusBadge: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
      borderRadius: SPACING.radiusSm,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "500",
    },
    // Offer Cards
    offerCard: {
      marginRight: SPACING.md,
      width: 160,
    },
    offerAmount: {
      fontSize: 24,
      fontWeight: "700",
      color: COLORS.primary,
      marginBottom: SPACING.xs,
    },
    offerTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 2,
    },
    offerRate: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: SPACING.md,
    },
    offerButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.radiusSm,
      alignItems: "center",
    },
    offerButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "600",
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
    textArea: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    loanProductsContainer: {
      gap: SPACING.md,
    },
    loanProductCard: {
      width: 140,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    selectedLoanProduct: {
      borderColor: COLORS.primary,
    },
    loanProductIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    loanProductName: {
      fontSize: 14,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: 4,
    },
    loanProductRate: {
      fontSize: 12,
      color: COLORS.primary,
      fontWeight: "500",
      marginBottom: 2,
    },
    loanProductRange: {
      fontSize: 10,
      color: COLORS.textSecondary,
    },
    employmentContainer: {
      flexDirection: "row",
      gap: SPACING.sm,
    },
    employmentOption: {
      flex: 1,
      paddingVertical: SPACING.sm,
      borderRadius: SPACING.radiusMd,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
    },
    employmentText: {
      fontSize: 14,
      color: COLORS.text,
    },
    emiContainer: {
      alignItems: "center",
    },
    emiLabel: {
      fontSize: 14,
      color: COLORS.textSecondary,
      marginBottom: SPACING.sm,
    },
    emiAmount: {
      fontSize: 28,
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