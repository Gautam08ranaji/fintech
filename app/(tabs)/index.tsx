// app/(tabs)/index.tsx (HomeScreen)
import BodyLayout from "@/components/layout/BodyLayout";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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
  status: "active" | "completed" | "overdue";
  interestRate: number;
}

export default function HomeScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  // Mock Data
  const userData = {
    name: "Alex Johnson",
    welcomeBack: "Welcome back,",
    balance: 24580.75,
    currency: "USD",
    creditScore: 742,
    creditScoreChange: +12,
  };

  const quickActions = [
    { id: "kyc", title: "KYC", icon: "document-text-outline", route: "/(tabs)/kyc", color: "#3B82F6" },
    { id: "loan", title: "Loan", icon: "cash-outline", route: "/(tabs)/loan", color: "#10B981" },
    { id: "payment", title: "Payment", icon: "card-outline", route: "/(tabs)/payment", color: "#F59E0B" },
    { id: "profile", title: "Profile", icon: "person-outline", route: "/(tabs)/profile", color: "#8B5CF6" },
  ];

  const recentTransactions: Transaction[] = [
    { id: "1", type: "debit", amount: 450.0, description: "Loan Repayment - EMI", date: "2024-03-20", status: "completed" },
    { id: "2", type: "credit", amount: 2500.0, description: "Salary Deposit", date: "2024-03-19", status: "completed" },
    { id: "3", type: "debit", amount: 89.99, description: "Netflix Subscription", date: "2024-03-18", status: "completed" },
    { id: "4", type: "credit", amount: 120.0, description: "Referral Bonus", date: "2024-03-17", status: "pending" },
    { id: "5", type: "debit", amount: 320.0, description: "ATM Withdrawal", date: "2024-03-16", status: "completed" },
  ];

  const activeLoans: Loan[] = [
    { id: "1", amount: 5000, remainingAmount: 3250, dueDate: "2024-04-15", status: "active", interestRate: 8.5 },
    { id: "2", amount: 10000, remainingAmount: 8750, dueDate: "2024-05-20", status: "active", interestRate: 7.2 },
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
      default:
        return COLORS.textSecondary;
    }
  };

  const renderQuickAction = ({ item }: { item: typeof quickActions[0] }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.actionCard, { backgroundColor: `${item.color}15` }]}
      onPress={() => router.push(item.route as any)}
    >
      <View style={[styles.actionIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.actionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
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
  );

  const renderLoan = ({ item }: { item: Loan }) => {
    const progress = ((item.amount - item.remainingAmount) / item.amount) * 100;
    return (
      <View style={styles.loanCard}>
        <View style={styles.loanHeader}>
          <Text style={styles.loanTitle}>Loan #{item.id}</Text>
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
        <Text style={styles.dueDate}>
          Due Date: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </View>
    );
  };

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
          </View>
          <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push("/")}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: COLORS.primary }]}>
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
        </View>

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
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={width - SPACING.md * 2}
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
          </View>
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
            <TouchableOpacity onPress={() => router.push("/")}>
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
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      padding: SPACING.lg,
      borderRadius: SPACING.radiusLg,
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
      paddingVertical: SPACING.md,
      borderRadius: SPACING.radiusMd,
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
    chartContainer: {
      backgroundColor: COLORS.card,
      borderRadius: SPACING.radiusLg,
      padding: SPACING.md,
      ...(COLORS.shadow && { shadowColor: COLORS.shadow }),
      elevation: 2,
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
    loanCard: {
      backgroundColor: COLORS.card,
      padding: SPACING.md,
      borderRadius: SPACING.radiusLg,
      ...(COLORS.shadow && { shadowColor: COLORS.shadow }),
      elevation: 2,
    },
    loanHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    loanTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
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
    dueDate: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    transactionsContainer: {
      gap: SPACING.md,
    },
    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.card,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      ...(COLORS.shadow && { shadowColor: COLORS.shadow }),
      elevation: 1,
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
  });