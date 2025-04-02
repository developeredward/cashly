import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AvatarImageMapping } from "../../constants/avatars";
import * as SecureStore from "expo-secure-store";
import { AvatarListModal } from "../../components/Avatar/AvatarListModal";
import { useAuth } from "../../context/AppContext";
import LoadingSpinner from "../../components/LoadingSpinner";
interface User {
  name: string;
  email: string;
  currency: string;
}
const Profile = () => {
  const [avatarModalRef, setAvatarModalRef] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    currency: "",
  });
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
    getAvatar();
  }, [avatar]);
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
        <Text style={[styles.heading, { color: colors.text }]}>Profile</Text>
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
      <View style={styles.content}>
        {loading ? (
          <View style={styles.detailsContainer}>
            <LoadingSpinner color={colors.primary} />
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Poppins-Regular",
                color: colors.text,
              }}
            >
              {user.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: colors.text + "80",
              }}
            >
              {user.email}
            </Text>
          </View>
        )}

        <View style={styles.navigators}>
          <TouchableOpacity
            onPress={() => router.push("/EditProfile")}
            style={[
              styles.navigator,
              { backgroundColor: dark ? "#1e1e1e" : colors.card },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={colors.text}
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: colors.text,
              }}
            >
              Account Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/FAQs")}
            style={[
              styles.navigator,
              { backgroundColor: dark ? "#1e1e1e" : colors.card },
            ]}
          >
            <SimpleLineIcons
              name="question"
              size={20}
              color={colors.text}
              style={{ marginRight: 10 }}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: colors.text,
              }}
            >
              FAQs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Logout", "Are you sure you want to logout?", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    if (logout) {
                      logout();
                    } else {
                      console.error("Logout function is undefined");
                    }
                    router.replace("/login");
                  },
                },
              ]);
            }}
            style={[
              styles.navigator,
              { backgroundColor: dark ? "#1e1e1e" : colors.card },
            ]}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={colors.notification}
              style={{}}
            />

            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: colors.text,
                marginLeft: 10,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{ marginTop: 40 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: colors.text + "80",
                textAlign: "center",
              }}
            >
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Poppins-Regular",
              color: colors.primary,
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Cashly v1.0.0
          </Text>
        </View>
      </View>
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
  navigators: {
    // flex: 1,
    marginTop: 20,
  },
  navigator: {
    height: 60,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
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

export default Profile;
