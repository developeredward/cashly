import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AvatarImageMapping } from "../../constants/avatars";
import * as SecureStore from "expo-secure-store";
import { AvatarListModal } from "../../components/Avatar/AvatarListModal";
import { useAuth } from "../../context/AppContext";
import { deleteProfile, updateProfile } from "../../services/profile/profile";
import LoadingSpinner from "../../components/LoadingSpinner";

interface User {
  name: string;
  email: string;
  currency: string;
}
const EditProfile = () => {
  const [avatarModalRef, setAvatarModalRef] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [edited, setEdited] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    currency: "",
  });
  const [initialUser, setinitialUser] = useState<User>({
    name: "",
    email: "",
    currency: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { colors, dark } = useTheme();
  const router = useRouter();
  const { getProfile, logout } = useAuth();

  async function getAvatar() {
    const storedAvatar = await SecureStore.getItemAsync("avatar");
    if (storedAvatar) {
      const avatarName = JSON.parse(storedAvatar)
        .name as keyof typeof AvatarImageMapping;
      const mappedAvatar = AvatarImageMapping[avatarName];
      setAvatar(mappedAvatar);
    }
  }

  const checkIfEdited = () => {
    const isEdited = (Object.keys(user) as (keyof User)[]).some(
      (key) => user[key] !== initialUser[key]
    );
    setEdited(isEdited);
  };

  function canProceed() {
    return edited;
  }
  useEffect(() => {
    if (getProfile) {
      getProfile()
        .then((res) => {
          setUser({
            name: res.name,
            email: res.email,
            currency: res.currency,
          });
          setLoading(false);
          setUser(res);
          setinitialUser(res);
          setUpdated(false);
          checkIfEdited();
        })
        .catch((err) => {
          console.log("Error fetching profile", err);
          setLoading(false);
        });
    } else {
      console.log("getProfile is undefined");
    }
  }, []);
  useEffect(() => {
    checkIfEdited();
  }, [user]);
  useEffect(() => {
    getAvatar();
  }, [avatar]);

  const handleSubmit = async () => {
    const proceed = canProceed();
    if (proceed) {
      let formatedData: { name?: string | null; currency?: string | null } = {};

      if (user.name !== initialUser.name && user.name) {
        let name = user.name;
        formatedData.name = name || null;
      } else if (user.name === "") {
        setError("Name cannot be empty");
        return;
      }

      if (user.currency !== initialUser.currency && user.currency.length <= 3) {
        formatedData.currency = user.currency || null;
      }

      if (Object.keys(formatedData).length > 0) {
        try {
          console.log("Updating profile with changed fields...", formatedData);

          const response = await updateProfile(formatedData);

          console.log("API Response:", response); // Debugging

          if (response?.status === 200 || response?.status === 201) {
            console.log("Profile updated successfully");
            setUpdated(true);
            setinitialUser({ ...user });
            setEdited(false);
          } else {
            setError("Failed to update profile. Please try again.");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          if (error instanceof Error) {
            setError(`An error occurred: ${error.message}`);
          } else {
            setError("An unknown error occurred.");
          }
        }
      } else {
        setError("No changes detected to update.");
        setEdited(false);
      }
    } else {
      setError("Please fill all fields");
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { backgroundColor: colors.primary }]}></View>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background }]}
          onPress={() => router.canGoBack() && router.back()}
        >
          <Ionicons name="chevron-back-sharp" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text }]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background }]}
          onPress={() => console.log("Options pressed")}
        >
          <SimpleLineIcons
            name="options-vertical"
            size={18}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <AvatarListModal
        visible={avatarModalRef}
        onClose={() => {
          setAvatarModalRef(false);
        }}
        setAvatar={(avatar) => setAvatar(avatar.name)}
      />
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() => {
            setAvatarModalRef(true);
          }}
          style={[
            {
              position: "absolute",
              top: 110,
              left: "58%",
              backgroundColor: colors.primary,
              borderRadius: 50,
              padding: 10,
              zIndex: 1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={15}
            color={"#fff"}
          />
        </TouchableOpacity>
        <Image
          source={avatar ? avatar : require("../../assets/avatars/a.png")}
          style={[
            styles.avatar,
            {
              borderColor: colors.card,
              backgroundColor: colors.background,
            },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        style={[styles.content, { flex: 1 }]}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.inputContainer}>
            <View style={styles.inputContent}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: colors.text,
                  paddingBottom: 10,
                  marginLeft: 20,
                }}
              >
                Name
              </Text>
              <TextInput
                placeholder={loading ? "---" : user.name}
                placeholderTextColor={colors.text + "80"}
                onChangeText={(text) => {
                  setUser({ ...user, name: text });
                }}
                style={[
                  styles.inputField,
                  {
                    backgroundColor: dark ? "#1e1e1e" : colors.card,
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.inputContent}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: colors.text,
                  paddingBottom: 10,
                  marginLeft: 20,
                }}
              >
                Email Address
              </Text>
              <View>
                <TextInput
                  placeholder={loading ? "---" : user.email}
                  placeholderTextColor={colors.text + "80"}
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: dark ? "#1e1e1e" : colors.card,
                      color: colors.text,
                    },
                  ]}
                  editable={false}
                  value={user.email}
                />
                <View
                  style={{
                    position: "absolute",
                    right: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {!loading && (
                    <MaterialIcons
                      name="verified"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </View>
              </View>
            </View>
            <View style={styles.inputContent}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: colors.text,
                  paddingBottom: 10,
                  marginLeft: 20,
                }}
              >
                Currency
              </Text>
              <TextInput
                placeholder={loading ? "---" : user.currency}
                placeholderTextColor={colors.text + "80"}
                onChangeText={(text) => {
                  setUser({ ...user, currency: text });
                }}
                style={[
                  styles.inputField,
                  {
                    backgroundColor: dark ? "#1e1e1e" : colors.card,
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <TouchableOpacity
              disabled={!edited}
              onPress={handleSubmit}
              style={[
                styles.inputField,
                {
                  backgroundColor: edited
                    ? colors.primary
                    : dark
                    ? "#1e1e1e"
                    : "#d3d3d3",
                  justifyContent: "center",
                  borderRadius: 40,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: colors.text,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
            {error && (
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
              </View>
            )}
            {updated && (
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: colors.primary,
                    textAlign: "center",
                  }}
                >
                  Profile updated successfully
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={{
                marginTop: 40,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onPress={() => {
                Alert.alert(
                  "Delete Account",
                  "Are you sure you want to delete your account? This action cannot be undone.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        await deleteProfile().then((res) => {
                          if (res?.status === 200) {
                            console.log("Account deleted successfully");
                            logout?.();
                          } else {
                            console.log("Failed to delete account");
                          }
                        });
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={22}
                color={colors.notification}
                style={{ alignSelf: "center" }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: colors.notification,
                  textAlign: "center",
                }}
              >
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // flex: 1,
    // marginTop: 10,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  inputContainer: {
    // flex: 1,
    marginTop: 20,
  },
  inputContent: {
    marginBottom: 20,
  },
  inputField: {
    height: 60,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,

    flexDirection: "row",
  },
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
  heading: {
    fontSize: 26,
    fontWeight: "bold",

    fontFamily: "Poppins-Bold",
  },
  navBtn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -100,
    position: "relative",
  },
  avatar: {
    objectFit: "contain",
    borderRadius: 100,
    borderWidth: 10,
    width: 150,
    height: 150,
  },
});

export default EditProfile;
