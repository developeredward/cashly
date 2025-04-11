import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTheme } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ScanResultModal from "../../components/Scan/ScanResultModal";

export default function ReceiptScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const cameraRef = useRef<CameraView | null>(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const { colors, dark } = useTheme();
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: dark ? colors.text : colors.primary,
          }}
        >
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const startScanAnimation = () => {
    scanAnimation.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopScanAnimation = () => {
    scanAnimation.stopAnimation();
    scanAnimation.setValue(0);
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      setScanning(true);
      startScanAnimation();

      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      if (photo) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { base64: true }
        );

        setImageUri(manipulatedImage.base64 || null);
        await extractTextFromImage(manipulatedImage.uri);
      }

      stopScanAnimation();
      setScanning(false);
    }
  };

  const extractTextFromImage = async (uri) => {
    try {
      let formData = new FormData();
      formData.append("apikey", "K88706102088957"); // Free API Key
      formData.append("language", "eng");
      formData.append("image", {
        uri: uri,
        type: "image/jpeg",
        name: "receipt.jpg",
      });

      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const extractedText =
        data?.ParsedResults?.[0]?.ParsedText || "No text found";
      setExtractedText(extractedText);
    } catch (error) {
      console.error("OCR Extraction Error:", error);
      setExtractedText("Error extracting text.");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.banner, { backgroundColor: colors.primary, zIndex: 1 }]}
      ></View>
      <View style={[styles.headingContainer, { zIndex: 1 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background }]}
          onPress={() => router.canGoBack() && router.back()}
        >
          <Ionicons name="chevron-back-sharp" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text, fontSize: 20 }]}>
          Scan Reciept
        </Text>
        <View
          style={[styles.navBtn, { backgroundColor: "transparent" }]}
        ></View>
      </View>

      <ScrollView
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.text + "80",
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          Align the receipt within the frame and tap "Scan"
        </Text>
        <View style={[styles.cameraWrapper]}>
          <View style={styles.cameraBorder}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back">
              <View style={styles.overlay}>
                <Animated.View
                  style={[
                    styles.scanLine,
                    { backgroundColor: colors.primary },
                    {
                      transform: [
                        {
                          translateY: scanAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-125, 125],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
            </CameraView>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: dark ? "rgba(47, 47, 47, 0.8)" : colors.primary,
            },
          ]}
          onPress={handleCapture}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.text,
                  fontFamily: "Poppins-Bold",
                },
              ]}
            >
              SCAN
            </Text>
          )}
        </TouchableOpacity>

        {/* {imageUri && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageUri}` }}
            style={styles.preview}
          />
        )} */}

        {extractedText && (
          <ScanResultModal
            visible={!!extractedText}
            onClose={() => setExtractedText("")}
            scanResult={extractedText}
            onSave={(data) => {
              console.log("Data to save:", data);
              // Handle saving the data
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: {
    fontSize: 26,
    fontWeight: "bold",

    fontFamily: "Poppins-Bold",
  },
  cameraWrapper: {
    width: "80%",
    height: 300,
    borderRadius: 20,
  },
  cameraBorder: {
    flex: 1,
    borderRadius: 20,
  },
  camera: { flex: 1, width: "100%", borderRadius: 20 },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  scanLine: {
    width: "120%",
    height: 2,
    backgroundColor: "#00FF00",
    position: "absolute",
    top: "50%",
    left: "-10%",
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    // padding: 15,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  preview: { width: "100%", height: 200, marginTop: 10 },
  textContainer: { padding: 10, backgroundColor: "#fff", marginTop: 10 },
  headingContainer: {
    position: "absolute",
    top: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
  },
  banner: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },

  navBtn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
});
