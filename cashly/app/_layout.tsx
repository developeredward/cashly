import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { Appearance } from "react-native";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@react-navigation/native";
import * as Font from "expo-font";
import Welcome from "./Welcome";
import DarkTheme from "../theme/DarkTheme";
import LightTheme from "../theme/LightTheme";
import { AuthProvider, useAuth } from "../context/AppContext";
import CustomHeader from "../components/CustomHeader";

export default function RootLayoutNav() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const currentTheme = Appearance.getColorScheme() === "dark";
    setIsDarkTheme(currentTheme);
  }, []);
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
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
          <Stack.Screen
            name="RecordTransaction"
            options={{
              header: (props) => <CustomHeader title="Add transaction" />,
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
