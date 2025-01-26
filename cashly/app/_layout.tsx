// import FontAwesome from "@expo/vector-icons/FontAwesome";

import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { Appearance } from "react-native";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@react-navigation/native";
import Welcome from "./Welcome";
import DarkTheme from "../theme/DarkTheme"; // Your dark theme
import LightTheme from "../theme/LightTheme";
import { AuthProvider, useAuth } from "../context/AppContext";
import Home from "./Home";
import Loading from "../components/Loading";

// export default function RootLayoutNav() {
//   const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
//   const { authState } = useAuth();

//   useEffect(() => {
//     // Detect system theme
//     const currentTheme = Appearance.getColorScheme() === "dark";
//     setIsDarkTheme(currentTheme);
//     console.log(authState?.authenticated);
//   });

//   return (
//     <AuthProvider>
//       <ThemeProvider value={isDarkTheme ? DarkTheme : LightTheme}>
//         <StatusBar
//           style={isDarkTheme ? "light" : "dark"}
//           translucent={true} // Ensure the background color is applied correctly
//           backgroundColor="transparent" // Ensure the background color is applied correctly
//         />
//         {authState?.authenticated ? (
//           <Home />
//         ) : (
//           <Welcome
//             logo={isDarkTheme ? DarkTheme.logo.url : LightTheme.logo.url}
//           />
//         )}
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

export default function RootLayoutNav() {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    // Detect system theme
    const currentTheme = Appearance.getColorScheme() === "dark";
    setIsDarkTheme(currentTheme);
  }, []);

  return (
    <AuthProvider>
      <AuthContent isDarkTheme={isDarkTheme} />
    </AuthProvider>
  );
}

const AuthContent = ({ isDarkTheme }: { isDarkTheme: boolean }) => {
  const { authState } = useAuth();

  return (
    <ThemeProvider value={isDarkTheme ? DarkTheme : LightTheme}>
      <StatusBar
        style={isDarkTheme ? "light" : "dark"}
        translucent={true}
        backgroundColor="transparent"
      />
      {authState?.authenticated === true ? (
        <Home />
      ) : authState?.authenticated === false ? (
        <Welcome
          logo={isDarkTheme ? DarkTheme.logo.url : LightTheme.logo.url}
        />
      ) : (
        <Loading />
      )}
    </ThemeProvider>
  );
};
