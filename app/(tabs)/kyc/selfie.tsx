// app/(tabs)/kyc/selfie.tsx
import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/layout/Card";
import { SPACING } from "@/config/spacing";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SelfieScreen() {
  const COLORS = useTheme();
  const styles = getStyles(COLORS);
  
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    setShowCamera(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        if (photo) {
          setImage(photo.uri);
          setShowCamera(false);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant gallery access to select a photo"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setShowCamera(true);
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("No Image", "Please capture or select a selfie");
      return;
    }

    setIsLoading(true);
    
    // Simulate API upload
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Selfie Submitted",
        "Your selfie has been submitted successfully. We will verify and update your status within 24 hours.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  if (!permission) {
    return (
      <BodyLayout type="screen" title="Selfie Verification">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </BodyLayout>
    );
  }

  if (!permission.granted) {
    return (
      <BodyLayout type="screen" title="Selfie Verification">
        <View style={styles.centerContainer}>
          <Ionicons name="camera-outline" size={64} color={COLORS.textSecondary} />
          <Text style={[styles.permissionText, { color: COLORS.textSecondary }]}>
            Camera permission is required to capture selfie
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: COLORS.primary }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </BodyLayout>
    );
  }

  return (
    <BodyLayout type="screen" title="Selfie Verification">
      <View style={styles.container}>
        {!showCamera ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.headerTitle}>Selfie Verification</Text>
              <Text style={styles.headerSubtitle}>
                Capture a clear selfie to verify your identity
              </Text>
            </View>

            {/* Tips Card */}
            <Card elevation="sm" padding="md" style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb-outline" size={24} color={COLORS.warning} />
                <Text style={[styles.tipsTitle, { color: COLORS.text }]}>Tips for best results</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  Good lighting (natural light works best)
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  Look directly at the camera
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  Ensure your face is clearly visible
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  Remove glasses if possible
                </Text>
              </View>
            </Card>

            {/* Preview Card */}
            <Card elevation="md" padding="lg" style={styles.previewCard}>
              <Text style={styles.previewTitle}>Selfie Preview</Text>
              
              <View
                style={[
                  styles.previewBox,
                  { borderColor: COLORS.border, backgroundColor: COLORS.background },
                ]}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="camera-outline" size={48} color={COLORS.textSecondary} />
                    <Text style={[styles.placeholderText, { color: COLORS.textSecondary }]}>
                      No selfie captured yet
                    </Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {!image ? (
                  <>
                    <TouchableOpacity
                      style={[styles.captureButton, { backgroundColor: COLORS.primary }]}
                      onPress={handleCapture}
                    >
                      <Ionicons name="camera" size={20} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Take Selfie</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.galleryButton, { borderColor: COLORS.border }]}
                      onPress={handlePickImage}
                    >
                      <Ionicons name="images-outline" size={20} color={COLORS.text} />
                      <Text style={[styles.galleryButtonText, { color: COLORS.text }]}>
                        Choose from Gallery
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.retakeButton, { borderColor: COLORS.border }]}
                      onPress={handleRetake}
                    >
                      <Ionicons name="refresh-outline" size={20} color={COLORS.text} />
                      <Text style={[styles.retakeButtonText, { color: COLORS.text }]}>
                        Retake
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.submitButton, { backgroundColor: COLORS.success }]}
                      onPress={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                          <Text style={styles.submitButtonText}>Submit</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Card>

            {/* Info Card */}
            <Card elevation="sm" padding="md" style={styles.infoCard}>
              <View style={styles.infoContent}>
                <Ionicons name="shield-checkmark" size={24} color={COLORS.info} />
                <View style={styles.infoText}>
                  <Text style={styles.infoTitle}>Secure & Encrypted</Text>
                  <Text style={styles.infoDescription}>
                    Your selfie is encrypted and used only for identity verification
                  </Text>
                </View>
              </View>
            </Card>
          </ScrollView>
        ) : (
          // Camera View
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
              mode="picture"
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.cameraHeader}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowCamera(false)}
                  >
                    <Ionicons name="close" size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.cameraTitle}>Take a Selfie</Text>
                  <View style={{ width: 40 }} />
                </View>

                <View style={styles.cameraFrame}>
                  <View style={styles.frameOutline} />
                </View>

                <View style={styles.cameraFooter}>
                  <TouchableOpacity
                    style={styles.captureButtonCamera}
                    onPress={handleTakePicture}
                  >
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          </View>
        )}
      </View>
    </BodyLayout>
  );
}

const getStyles = (COLORS: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: SPACING.screenPadding,
      paddingBottom: SPACING.xxl,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: SPACING.screenPadding,
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
    tipsCard: {
      marginBottom: SPACING.lg,
    },
    tipsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      marginBottom: SPACING.md,
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    tipItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      marginBottom: SPACING.sm,
    },
    tipText: {
      fontSize: 13,
      flex: 1,
    },
    previewCard: {
      marginBottom: SPACING.md,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    previewBox: {
      width: "100%",
      height: 280,
      borderRadius: SPACING.radiusLg,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      marginBottom: SPACING.lg,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    placeholderContainer: {
      alignItems: "center",
      gap: SPACING.sm,
    },
    placeholderText: {
      fontSize: 14,
    },
    actionButtons: {
      gap: SPACING.md,
    },
    captureButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
    },
    galleryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      borderWidth: 1,
    },
    galleryButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
    retakeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
      borderWidth: 1,
    },
    retakeButtonText: {
      fontSize: 16,
      fontWeight: "500",
    },
    submitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
      padding: SPACING.md,
      borderRadius: SPACING.radiusMd,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    infoCard: {
      marginBottom: SPACING.md,
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
    permissionText: {
      fontSize: 16,
      textAlign: "center",
      marginTop: SPACING.md,
      marginBottom: SPACING.lg,
    },
    permissionButton: {
      paddingHorizontal: SPACING.xl,
      paddingVertical: SPACING.md,
      borderRadius: SPACING.radiusMd,
    },
    permissionButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    // Camera Styles
    cameraContainer: {
      flex: 1,
      backgroundColor: "#000",
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      flex: 1,
      backgroundColor: "transparent",
    },
    cameraHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: SPACING.xl,
      paddingHorizontal: SPACING.lg,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    cameraTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    cameraFrame: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    frameOutline: {
      width: width - 80,
      height: width - 80,
      borderRadius: (width - 80) / 2,
      borderWidth: 2,
      borderColor: "#FFFFFF",
      borderStyle: "dashed",
    },
    cameraFooter: {
      paddingBottom: SPACING.xxl,
      alignItems: "center",
    },
    captureButtonCamera: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "rgba(255,255,255,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#FFFFFF",
    },
  });