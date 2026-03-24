// app/(tabs)/profile/index.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { removeToken } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  color: string;
}

export default function ProfileScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mock user data (in real app, get from Redux state)
  const userData = {
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Gautam Rana",
    email: user?.email || "gautam@example.com",
    phone: user?.phone || "+91 98765 43210",
    memberSince: "January 2024",
    kycStatus: "verified",
    loanLimit: "50,000",
  };

  const menuItems: MenuItem[] = [
    {
      id: "account",
      title: "Account Settings",
      icon: "person-outline",
      route: "/(tabs)/profile/settings",
      color: "#3B82F6",
    },
    {
      id: "kyc",
      title: "KYC Status",
      icon: "shield-checkmark-outline",
      route: "/(tabs)/kyc",
      color: "#10B981",
    },
    {
      id: "loans",
      title: "My Loans",
      icon: "cash-outline",
      route: "/(tabs)/loan",
      color: "#F59E0B",
    },
    {
      id: "transactions",
      title: "Transaction History",
      icon: "card-outline",
      route: "/(tabs)/transactions",
      color: "#8B5CF6",
    },
    {
      id: "security",
      title: "Security",
      icon: "lock-closed-outline",
      route: "/(tabs)/profile/security",
      color: "#EF4444",
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      route: "/(tabs)/profile/help",
      color: "#6B7280",
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await removeToken();
      dispatch(logout());
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.action) {
      item.action();
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon as any} size={22} color={item.color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <BodyLayout type="screen" title="Profile">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Header Card */}
        <Card elevation="md" padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.avatarText}>
                {userData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card elevation="sm" padding="md" style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${COLORS.success}15` }]}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
              <View>
                <Text style={styles.statLabel}>KYC Status</Text>
                <Text style={[styles.statValue, { color: COLORS.success }]}>
                  {userData.kycStatus === "verified" ? "Verified" : "Pending"}
                </Text>
              </View>
            </View>
          </Card>

          <Card elevation="sm" padding="md" style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                <Ionicons name="cash-outline" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.statLabel}>Loan Limit</Text>
                <Text style={styles.statValue}>₹{userData.loanLimit}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Personal Information Card */}
        <Card elevation="sm" padding="lg" style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="call-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.infoLabel}>Phone Number</Text>
            </View>
            <Text style={styles.infoValue}>{userData.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.infoLabel}>Member Since</Text>
            </View>
            <Text style={styles.infoValue}>{userData.memberSince}</Text>
          </View>
        </Card>

        {/* Menu Items */}
        <Card elevation="sm" padding="md" style={styles.menuCard}>
          <Text style={styles.sectionTitle}>Settings & Support</Text>
          <View style={styles.menuList}>
            {menuItems.map(renderMenuItem)}
          </View>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: `${COLORS.error}15` }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={[styles.logoutText, { color: COLORS.error }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent} padding="lg" elevation="lg">
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: `${COLORS.error}20` }]}>
                <Ionicons name="log-out-outline" size={32} color={COLORS.error} />
              </View>
            </View>
            
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to logout? You will need to login again to access your account.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton, { borderColor: COLORS.border }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton, { backgroundColor: COLORS.error }]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
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
    profileCard: {
      marginBottom: SPACING.md,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 28,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: COLORS.textSecondary,
    },
    editButton: {
      padding: SPACING.sm,
    },
    statsRow: {
      flexDirection: "row",
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    statCard: {
      flex: 1,
    },
    statContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    statIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    statLabel: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: 2,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },
    infoCard: {
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
      paddingBottom: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    infoLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    infoLabel: {
      fontSize: 14,
      color: COLORS.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "500",
      color: COLORS.text,
    },
    menuCard: {
      marginBottom: SPACING.md,
    },
    menuList: {
      marginTop: SPACING.sm,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.md,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: COLORS.text,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      marginTop: SPACING.sm,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: "600",
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
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    modalIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.text,
      textAlign: "center",
      marginBottom: SPACING.sm,
    },
    modalDescription: {
      fontSize: 14,
      color: COLORS.textSecondary,
      textAlign: "center",
      marginBottom: SPACING.lg,
      lineHeight: 20,
    },
    modalButtons: {
      flexDirection: "row",
      gap: SPACING.md,
    },
    modalButton: {
      flex: 1,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      alignItems: "center",
    },
    modalCancelButton: {
      borderWidth: 1,
    },
    modalConfirmButton: {
      backgroundColor: COLORS.error,
    },
    modalButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
  });