import { Text, Image, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 40, height: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingLeft: 20,
    height: 100,
  },
});

export default Welcome;
