import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "@react-navigation/native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { View } from "react-native";

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
          shadowOpacity: 0.1,
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
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={28}
            />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="Analytics"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "chart-box" : "chart-box-outline"}
              color={color}
              size={28}
            />
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
            <Ionicons
              name={focused ? "card" : "card-outline"}
              color={color}
              size={28}
            />
          ),
          title: "Cards",
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name={focused ? "user-circle" : "user-circle-o"}
              color={color}
              size={24}
            />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
