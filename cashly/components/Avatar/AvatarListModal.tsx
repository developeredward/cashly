import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Avatars } from "../../constants/avatars";
import * as SecureStore from "expo-secure-store";
import { Octicons } from "@expo/vector-icons";

import { useTheme } from "@react-navigation/native";

const AVATAR_SIZE = Dimensions.get("window").width / 4 - 16;

interface AvatarListModalProps {
  visible: boolean;
  onClose: () => void;
  setAvatar: (avatar: { id: number; name: string }) => void;
}

export const AvatarListModal: React.FC<AvatarListModalProps> = ({
  visible,
  onClose,
  setAvatar,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkMarkScale] = useState(new Animated.Value(0));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { colors } = useTheme();

  interface Avatar {
    id: number;
    name: string;
    image: any;
  }

  const handleSelect = (avatar: Avatar): void => {
    setSelectedAvatar(avatar);
  };

  const onSelect = async (avatar: Avatar) => {
    try {
      await SecureStore.setItemAsync(
        "avatar",
        JSON.stringify({ id: avatar.id, name: avatar.name })
      );
      setAvatar(avatar);
      console.log(
        "Avatar Saved:",
        JSON.stringify({ id: avatar.id, name: avatar.name })
      );
      setIsSuccess(true);
      setShowSuccessMessage(true);
      setIsTransitioning(true);
      animateCheckMark();
    } catch (error) {
      console.error(error);
    }
  };

  const animateCheckMark = () => {
    checkMarkScale.setValue(0);
    Animated.spring(checkMarkScale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
    }

    setTimeout(() => {
      setIsTransitioning(false);
      onClose();
      setTimeout(() => {
        setShowSuccessMessage(false);
        setIsSuccess(false);
      }, 200);
    }, 1500);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalContainer]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              {!showSuccessMessage && !isTransitioning && (
                <View style={styles.heading}>
                  <Text style={[styles.title, { color: colors.text }]}>
                    Select your avatar
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.cancelBtn,
                      { backgroundColor: colors.notification },
                    ]}
                    onPress={onClose}
                  >
                    <Octicons name="x" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {showSuccessMessage ? (
                <View
                  style={[
                    styles.successContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  {isSuccess && (
                    <Animated.View
                      style={[
                        styles.checkMarkContainer,
                        {
                          transform: [
                            {
                              scale: checkMarkScale,
                            },
                          ],
                        },
                      ]}
                    >
                      <Octicons name="check" size={30} color="green" />
                    </Animated.View>
                  )}
                  <Text style={[styles.successText]}>Updated Successfully</Text>
                </View>
              ) : (
                !isTransitioning && (
                  <>
                    <FlatList
                      data={Avatars}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.avatarContainer}
                          onPress={() => handleSelect(item)}
                        >
                          <Image
                            source={item.image}
                            style={styles.avatarImage}
                          />
                          {selectedAvatar?.id === item.id && (
                            <View style={styles.selectedOverlay} />
                          )}
                        </TouchableOpacity>
                      )}
                      numColumns={3}
                      contentContainerStyle={styles.avatarList}
                    />

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          { backgroundColor: colors.primary },
                        ]}
                        onPress={handleConfirm}
                        disabled={!selectedAvatar}
                      >
                        <Text style={styles.buttonText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9EDF8",
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Regular",
    flex: 1,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain",
  },
  selectedOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  avatarList: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  confirmButton: {
    padding: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#007BFF",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: "Baloo-2-400",
  },
  successContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkMarkContainer: {
    marginBottom: 10,
  },
  successText: {
    fontSize: 18,
    fontFamily: "Baloo-2-400",
    color: "green",
  },
});
