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
    Animated.sequence([
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scanAnimation, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
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
      setScanning(false);
    }
  };

  interface ExtractTextRequest {
    requests: Array<{
      image: {
        content: string;
      };
      features: Array<{
        type: string;
      }>;
    }>;
  }

  interface ExtractTextResponse {
    responses: Array<{
      fullTextAnnotation?: {
        text: string;
      };
    }>;
  }

  const extractTextFromImage = async (uri: string): Promise<void> => {
    const apiKey = "AIzaSyAAJojVKyPd8IUsmlDKzbQd8OP6qKjN5CY";
    const imageUri = "data:image/jpeg;base64," + uri;

    // try {
    //   const requestBody: ExtractTextRequest = {
    //     requests: [
    //       {
    //         image: {
    //           content: imageUri.split(",")[1],
    //         },
    //         features: [
    //           {
    //             type: "DOCUMENT_TEXT_DETECTION",
    //           },
    //         ],
    //       },
    //     ],
    //   };

    //   const response = await axios.post<ExtractTextResponse>(
    //     `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    //     requestBody
    //   );

    //   const text = response.data.responses[0].fullTextAnnotation?.text || "";
    //   setExtractedText(text); // Update state with extracted text
    // } catch (error) {
    //   console.error("Error extracting text:", error);
    //   setExtractedText("Error extracting text.");
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Receipt Scanner
      </Text>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",

          width: "100%",
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          Align the receipt within the frame and tap "Scan Receipt"
        </Text>
        <View style={styles.cameraWrapper}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back">
            {/* Scanner Animation Overlay */}
            <View style={styles.overlay}>
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 250], // Moves between these values
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </CameraView>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCapture}
          disabled={scanning}
        >
          {scanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Scan Receipt</Text>
          )}
        </TouchableOpacity>

        {imageUri && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageUri}` }}
            style={styles.preview}
          />
        )}

        {/* Display extracted text */}
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
    width: "90%",
    height: 300,

    overflow: "hidden",
  },
  camera: { flex: 1, width: "100%", borderRadius: 20 },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Slight dark overlay
    borderColor: "#00FF00",
    borderWidth: 2,
  },
  scanLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#00FF00",
    position: "absolute",
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  preview: { width: "100%", height: 200, marginTop: 10 },
  textContainer: { padding: 10, backgroundColor: "#fff", marginTop: 10 },
});
