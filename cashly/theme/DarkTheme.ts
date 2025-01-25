const DarkTheme = {
  dark: true,
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
    primary: "#81C784",
    secondary: "#FFC26F",
    background: "#121212",
    text: "#E0E0E0",
    accent: "#26C6DA",

    card: "#ffffff",

    border: "#e0e0e0",

    notification: "#ff80ab",
  },
};
export default DarkTheme;
