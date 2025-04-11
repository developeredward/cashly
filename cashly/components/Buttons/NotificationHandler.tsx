import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const NotificationHandler = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => router.push("/Notifications")}
      style={styles.notificationContainer}
    >
      <Text style={[styles.notificationCounter]}>
        {notificationCount
          ? notificationCount > 9
            ? "9+"
            : notificationCount
          : 0}
      </Text>
      <Ionicons name="notifications-outline" size={32} color={colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationCounter: {
    position: "absolute",
    top: -5,
    right: -4,
    zIndex: 1,
    backgroundColor: "#FF0000",
    color: "#fff",
    borderRadius: 50,
    height: 20,
    width: 20,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});

export default NotificationHandler;
