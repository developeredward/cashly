import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "@react-navigation/native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function TabLayout() {
  const { colors, dark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: "#747474",
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          shadowColor: dark ? "#000000" : "#cccccc",
          shadowOffset: {
            width: 0,
            height: -10,
          },
          shadowOpacity: dark ? 0.1 : 0.4,
          shadowRadius: 50,
          elevation: 10,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 100,
          paddingTop: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarContainer}>
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={28}
              />
              <View
                style={[
                  styles.tabBarDot,
                  { backgroundColor: focused ? colors.primary : "transparent" },
                ]}
              ></View>
            </View>
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="Analytics"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarContainer}>
              <MaterialCommunityIcons
                name={focused ? "chart-box" : "chart-box-outline"}
                color={color}
                size={28}
              />
              <View
                style={[
                  styles.tabBarDot,
                  { backgroundColor: focused ? colors.primary : "transparent" },
                ]}
              ></View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Scan"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: colors.primary + "20",
                padding: 5,
                borderRadius: 50,
                height: 50,
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={focused ? "scan-circle" : "scan"}
                color={color}
                size={28}
              />
            </View>
          ),
          title: "Scan",
        }}
      />
      <Tabs.Screen
        name="Card"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarContainer}>
              <Ionicons
                name={focused ? "card" : "card-outline"}
                color={color}
                size={28}
              />
              <View
                style={[
                  styles.tabBarDot,
                  { backgroundColor: focused ? colors.primary : "transparent" },
                ]}
              ></View>
            </View>
          ),
          title: "Cards",
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarContainer}>
              <FontAwesome
                name={focused ? "user-circle" : "user-circle-o"}
                color={color}
                size={24}
              />
              <View
                style={[
                  styles.tabBarDot,
                  { backgroundColor: focused ? colors.primary : "transparent" },
                ]}
              ></View>
            </View>
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  tabBarDot: {
    height: 5,
    width: 5,

    position: "absolute",
    borderRadius: 50,
    top: 35,
  },
});
