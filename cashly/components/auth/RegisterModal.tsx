import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import React from "react";

interface RegisterProps {
  visible: boolean;
  close: () => void;
}

const Register: React.FC<RegisterProps> = ({ visible, close }) => {
  const { colors } = useTheme();
  return (
    <Modal
      transparent={true} // Makes the background of the modal transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {
        close();
      }}
    >
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.notification }]}
            onPress={() => close()}
          >
            <Text style={{ color: colors.text }}>X</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.text }}>Register</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.89)", // Adds a translucent background
    height: "1000%",
  },
  modalContent: {
    flexDirection: "row",
    width: "90%", // 80% of the screen width
    height: "60%", // 60% of the screen height
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  closeBtn: {
    width: 35,
    height: 35,
    position: "absolute",
    top: 10,
    right: 10,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 50,
    alignItems: "center",
  },
});

export default Register;
