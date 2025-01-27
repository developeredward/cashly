import { View, Text, StyleSheet, Modal } from "react-native";
import { useTheme } from "@react-navigation/native";
import LoadingSpinner from "./LoadingSpinner";

const Loading = () => {
  const { colors } = useTheme();
  return (
    <Modal
      transparent={true} // Makes the background of the modal transparent
      animationType="fade"
      visible={true}
      onRequestClose={() => {
        close();
      }}
    >
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <LoadingSpinner color={colors.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.89)", // Adds a translucent background
    height: "100%",
  },
  modalContent: {
    width: 30,
    height: 30,
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Loading;
