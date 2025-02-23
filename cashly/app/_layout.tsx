import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { Appearance } from "react-native";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@react-navigation/native";
import Welcome from "./Welcome";
import DarkTheme from "../theme/DarkTheme";
import LightTheme from "../theme/LightTheme";
import { AuthProvider, useAuth } from "../context/AppContext";

export default function RootLayoutNav() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    // Detect system theme
    const currentTheme = Appearance.getColorScheme() === "dark";
    setIsDarkTheme(currentTheme);
  }, []);

  return (
    // Wrap the entire app in the AuthProvider
    <AuthProvider>
      <AuthContent isDarkTheme={isDarkTheme} />
    </AuthProvider>
  );
}

const AuthContent = ({ isDarkTheme }: { isDarkTheme: boolean }) => {
  const { authState } = useAuth();

  return (
    // Wrap the entire app in the ThemeProvider
    <ThemeProvider value={isDarkTheme ? DarkTheme : LightTheme}>
      <StatusBar
        style={isDarkTheme ? "light" : "dark"}
        translucent={true}
        backgroundColor="transparent"
      />
      {authState?.authenticated === true ? (
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      ) : (
        <Welcome
          logo={isDarkTheme ? DarkTheme.logo.url : LightTheme.logo.url}
        />
      )}
    </ThemeProvider>
  );
};
