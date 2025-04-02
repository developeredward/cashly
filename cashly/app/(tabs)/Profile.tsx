import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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

const Profile = () => {
  const [avatarModalRef, setAvatarModalRef] = useState(false);
  const [avatar, setAvatar] = useState("");
  const { colors } = useTheme();
  const router = useRouter();
  const { getProfile } = useAuth();

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
    console.log("FETch PROFILE");
    const fetchProfile = async () => {
      if (getProfile) {
        await getProfile();
      }
    };
    fetchProfile();
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 30,
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
    top: -100,
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
