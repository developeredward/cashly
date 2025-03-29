import { useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AppContext";

import { ImageSourcePropType } from "react-native";
import Login from "../components/auth/LoginModal";
import Register from "../components/auth/RegisterModal";
import PrimaryBtn from "../components/Buttons/PrimaryBtn";
import Loading from "../components/LoadingSpinner";
import React from "react";

interface WelcomeProps {
  logo: ImageSourcePropType;
}

const Welcome = ({ logo }: WelcomeProps) => {
  const { colors } = useTheme();
  const { authState } = useAuth();
  const [modalVisible, setModalVisible] = useState<{
    login: boolean;
    register: boolean;
  }>({
    login: false,
    register: false,
  });

  const [shouldRender, setShouldRender] = useState<{
    login: boolean;
    register: boolean;
  }>({
    login: false,
    register: false,
  });

  const openLoginModal = () => {
    setShouldRender({ login: true, register: false });
    setTimeout(() => {
      setModalVisible({ login: true, register: false });
    }, 0); // Ensure it renders before animation starts
  };

  const openRegisterModal = () => {
    setShouldRender({ login: false, register: true });
    setTimeout(() => {
      setModalVisible({ login: false, register: true });
    }, 0); // Ensure it renders before animation starts
  };

  const closeLoginModal = () => {
    setModalVisible((prev) => ({ ...prev, login: false }));
    setTimeout(() => {
      setShouldRender((prev) => ({ ...prev, login: false }));
    }, 300); // Delay matches animation duration
  };

  const closeRegisterModal = () => {
    setModalVisible((prev) => ({ ...prev, register: false }));
    setTimeout(() => {
      setShouldRender((prev) => ({ ...prev, register: false }));
    }, 300); // Delay matches animation duration
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Image source={logo} style={{ width: 40, height: 40 }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Track Your Expenses Effortlessly with{" "}
          <Text style={{ color: colors.primary }}>Cashly</Text>
        </Text>
        <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
          Take control of your finances with our user-friendly platform. Set
          personalized financial goals and effortlessly monitor your progress
          along the way, all in one convenient place.{" "}
        </Text>

        {!authState?.loading ? (
          <>
            <PrimaryBtn
              onPress={openRegisterModal}
              extraStyles={{ marginTop: 90 }}
              title="Get Started"
            />
            <View style={styles.footer}>
              <Text
                style={[styles.label, { color: colors.text, opacity: 0.5 }]}
              >
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => openLoginModal()}>
                <Text
                  style={[
                    styles.loginText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {" "}
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={[styles.footer, { marginTop: 100 }]}>
            <Loading color={colors.primary} />
          </View>
        )}
        {shouldRender.login && (
          <Login visible={modalVisible.login} close={closeLoginModal} />
        )}
        {shouldRender.register && (
          <Register
            visible={modalVisible.register}
            close={closeRegisterModal}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure this takes full screen height
    paddingLeft: 30,
    paddingRight: 30,
    height: "100%", // Ensure the container stretches fully
  },
  content: {
    justifyContent: "flex-end",
    flex: 1,
  },
  title: {
    fontSize: 50,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 10,
    opacity: 0.5,
  },

  footer: {
    flexDirection: "row", // Ensure horizontal alignment
    justifyContent: "center", // Center content horizontally
    marginTop: 30,
    alignItems: "center", // Center items vertically
  },
  label: {
    fontSize: 16,
    textAlign: "center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Welcome;
