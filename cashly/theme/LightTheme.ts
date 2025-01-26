const LightTheme = {
  dark: false,
  fonts: {
    regular: {
      fontFamily: "Roboto-Regular",
      fontWeight: "400" as "400", // Explicitly cast to match the expected type
    },
    bold: {
      fontFamily: "Roboto-Bold",
      fontWeight: "700" as "700",
    },
    medium: {
      fontFamily: "Roboto-Medium",
      fontWeight: "500" as "500",
    },
    light: {
      fontFamily: "Roboto-Light",
      fontWeight: "300" as "300",
    },
    heavy: {
      fontFamily: "Roboto-Heavy",
      fontWeight: "800" as "800",
    },
    thin: {
      fontFamily: "Roboto-Thin",
      fontWeight: "100" as "100",
    },
  },
  colors: {
    primary: "#4CAF50",
    secondary: "#FFC107",
    background: "#F8F9FA",
    text: "#333333",
    accent: "#009688", // Corrected hex code format
    card: "#ffffff",
    border: "#e0e0e0",
    notification: "#D32F2F",
    success: "#388E3C", // Dark green for success
    // danger: "#D32F2F", // Red for danger
  },
  logo: { url: require("../assets/logo.png") },
};
export default LightTheme;
