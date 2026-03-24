// components/ui/Card.tsx
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { ReactNode } from "react";
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle;
  header?: ReactNode;
  headerStyle?: ViewStyle;
  headerTitle?: string;
  headerTitleStyle?: TextStyle;
  headerRight?: ReactNode;
  footer?: ReactNode;
  footerStyle?: ViewStyle;
  elevation?: "none" | "sm" | "md" | "lg";
  padding?: keyof typeof SPACING | "none";
  borderRadius?: keyof typeof SPACING;
  backgroundColor?: string;
  bordered?: boolean;
  borderColor?: string;
}

export default function Card({
  children,
  onPress,
  style,
  contentStyle,
  header,
  headerStyle,
  headerTitle,
  headerTitleStyle,
  headerRight,
  footer,
  footerStyle,
  elevation = "sm",
  padding = "md",
  borderRadius = "radiusLg",
  backgroundColor,
  bordered = false,
  borderColor,
}: CardProps) {
  const COLORS = useTheme();
  
  const getElevationStyle = (): ViewStyle => {
    switch (elevation) {
      case "none":
        return { elevation: 0, shadowOpacity: 0 };
      case "sm":
        return {
          elevation: 2,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        };
      case "md":
        return {
          elevation: 4,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        };
      case "lg":
        return {
          elevation: 8,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        };
      default:
        return {};
    }
  };

  const getPadding = () => {
    if (padding === "none") return 0;
    return SPACING[padding as keyof typeof SPACING] || SPACING.md;
  };

  const getBorderRadius = () => {
    return SPACING[borderRadius as keyof typeof SPACING] || SPACING.radiusLg;
  };

  const cardBaseStyle: ViewStyle = {
    backgroundColor: backgroundColor || COLORS.card,
    borderRadius: getBorderRadius(),
    padding: getPadding(),
    borderWidth: bordered ? 1 : 0,
    borderColor: borderColor || COLORS.border,
    ...getElevationStyle(),
  };

  // Merge styles - handle both single style and array of styles
  const mergedStyle = Array.isArray(style) 
    ? [cardBaseStyle, ...style] 
    : [cardBaseStyle, style].filter(Boolean);

  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Wrapper style={mergedStyle} {...wrapperProps}>
      {(header || headerTitle) && (
        <View style={[styles.header, headerStyle]}>
          {header ? (
            header
          ) : (
            <>
              <Text style={[styles.headerTitle, { color: COLORS.text }, headerTitleStyle]}>
                {headerTitle}
              </Text>
              {headerRight && <View>{headerRight}</View>}
            </>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
      {footer && <View style={[styles.footer, footerStyle]}>{footer}</View>}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {},
  footer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});