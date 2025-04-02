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

export default function ReceiptScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const cameraRef = useRef<CameraView | null>(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const { colors, dark } = useTheme();

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
    <SafeAreaView style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Receipt Scanner
      </Text>
      <Text
        style={{
          color: colors.text + "80",
          fontSize: 12,
          marginBottom: 20,
        }}
      >
        Align the receipt within the frame and tap "Scan"
      </Text>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",

          width: "100%",
        }}
      >
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
          <ScrollView style={styles.textContainer}>
            <Text>{extractedText}</Text>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  heading: {
    fontSize: 26,

    marginBottom: 20,
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
});
