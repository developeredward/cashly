import { SafeAreaView, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../context/AppContext";
import PrimaryBtn from "../components/Buttons/PrimaryBtn";

const Home = () => {
  const { logout } = useAuth();
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ color: colors.text }}>Home Page</Text>
      <PrimaryBtn title="Logout" onPress={logout} />
    </SafeAreaView>
  );
};

export default Home;
