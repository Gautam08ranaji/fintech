import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const COLORS = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          elevation: 8,
        },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 🏠 HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🧾 KYC */}
      <Tabs.Screen
        name="kyc/index"
        options={{
          title: "KYC",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="kyc/aadhaar" options={{ href: null }} />
      <Tabs.Screen name="kyc/selfie" options={{ href: null }} />

      {/* 💰 LOAN */}
      <Tabs.Screen
        name="loan/index"
        options={{
          title: "Loan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="loan/details" options={{ href: null }} />
      <Tabs.Screen name="loan/apply" options={{ href: null }} />

      {/* 💳 PAYMENT */}
      <Tabs.Screen
        name="payment/index"
        options={{
          title: "Payment",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 👤 PROFILE */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="profile/settings" options={{ href: null }} />
    </Tabs>
  );
}