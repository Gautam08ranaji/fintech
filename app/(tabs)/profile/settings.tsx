import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { useAppDispatch } from "@/redux/hooks";
import { setTheme } from "@/redux/slices/themeSlice";
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);

  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Customize your app experience
        </Text>

        {/* 🌙 DARK MODE */}
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Dark Mode</Text>
            <Text style={styles.desc}>Enable dark theme</Text>
          </View>

          <Switch
            value={COLORS.background === "#0F172A"} // basic check
            onValueChange={(val) =>
              dispatch(setTheme(val ? "dark" : "light"))
            }
          />
        </View>

        {/* 🔔 NOTIFICATIONS */}
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Notifications</Text>
            <Text style={styles.desc}>
              Receive updates & alerts
            </Text>
          </View>

          <Switch value={true} />
        </View>

        {/* 🔐 PRIVACY */}
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Terms & Conditions</Text>
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
      padding: SPACING.screenPadding,
      justifyContent: "center",
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
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
    },
    desc: {
      fontSize: 12,
      color: COLORS.textSecondary,
    },
    option: {
      paddingVertical: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    optionText: {
      fontSize: 15,
      color: COLORS.text,
    },
  });