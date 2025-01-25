// import FontAwesome from "@expo/vector-icons/FontAwesome";

import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { Appearance } from "react-native";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@react-navigation/native";
import Welcome from "./Welcome";
import DarkTheme from "../theme/DarkTheme"; // Your dark theme
import LightTheme from "../theme/LightTheme";

export default function RootLayoutNav() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    // Detect system theme
    const currentTheme = Appearance.getColorScheme() === "dark";
    setIsDarkTheme(currentTheme);
  });
  return (
    <ThemeProvider value={isDarkTheme ? DarkTheme : LightTheme}>
      <StatusBar
        style={isDarkTheme ? "light" : "dark"}
        translucent={true} // Ensure the background color is applied correctly
        backgroundColor="transparent" // Ensure the background color is applied correctly
      />
      <Welcome logo={isDarkTheme ? DarkTheme.logo.url : LightTheme.logo.url} />
      {/* <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" options={{ headerShown: false }} />
      </Stack> */}
    </ThemeProvider>
  );
}
