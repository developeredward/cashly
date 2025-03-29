import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../../context/AppContext";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import PrimaryBtn from "../../components/Buttons/PrimaryBtn";
import Loading from "../../components/Loading";
import NotificationHandler from "../../components/Buttons/NotificationHandler";
import Balance from "../../components/Balance/Balance";
import Cards from "../../components/Cards/Cards";
import MonetaryHandler from "../../components/Buttons/MonetaryHandler";
import TransactionsSheet from "../../components/Sheets/TransactionsSheet";
const Home = () => {
  const { logout } = useAuth();
  const { authState } = useAuth();
  const { colors } = useTheme();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (authState?.user) {
      setProfile(authState.user);
    }
  }, [authState?.authenticated]);

  // useEffect(() => {
  //   logout();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrappedContainer}>
        <View style={styles.headContainer}>
          <View>
            <Text style={[styles.heading, { color: colors.text }]}>
              Hi, {profile?.name.split(" ")[0]}
            </Text>
            <Text style={[styles.subHeading, { color: colors.text + "60" }]}>
              Welcome Back!
            </Text>
          </View>
          <NotificationHandler />
        </View>
        <View>
          <Balance color={colors.text} />
          <Cards color={colors.text} background={colors.primary} />
          <MonetaryHandler color={colors.text} background={colors.primary} />
        </View>
      </View>
      <View>
        <TransactionsSheet
          color={colors.text}
          primary={colors.primary}
          background={colors.background}
          title="Recent Transactions"
          type="recent"
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
  },
  subHeading: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  wrappedContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  headContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Home;
