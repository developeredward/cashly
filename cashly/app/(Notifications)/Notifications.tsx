import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Notifications = () => {
  const { colors, dark } = useTheme();
  const router = useRouter();
  return (
    <View>
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
          Notifications
        </Text>
        <View
          style={[styles.navBtn, { backgroundColor: "transparent" }]}
        ></View>
      </View>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: dark ? "#1c1c1c" : "rgb(255, 255, 255)" },
        ]}
        contentContainerStyle={{
          //   paddingTop: -100,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            paddingTop: 200,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Text style={{ color: colors.text + "50", fontSize: 16 }}>
            No new notifications
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
});

export default Notifications;
