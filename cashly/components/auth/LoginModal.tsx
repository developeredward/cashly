import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";
import validateLogin from "../../validators/loginValidator";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import CloseBtn from "../Buttons/CloseBtn";
import { useAuth } from "../../context/AppContext";
import Loading from "../LoadingSpinner";
interface LoginProps {
  visible: boolean;
  close: () => void;
}

const Login: React.FC<LoginProps> = ({ visible, close }) => {
  const { colors } = useTheme();
  const { login, authState } = useAuth();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [loginError, setLoginError] = React.useState<string>("");
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    const { isValid, errors } = validateLogin(email, password);
    if (!isValid) {
      setErrors(errors);
      setLoginError("");
      return;
    }
    try {
      const data = await login!(email, password);
      console.log(data);
      // Navigate to the dashboard or show a success message
    } catch (error: any) {
      // Display the error message to the user
      console.log("Error registering user:", error.message);
      setLoginError(error.message);
    }
  };

  return (
    <Modal
      transparent={true} // Makes the background of the modal transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {
        close();
      }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.modalContainer}>
          {authState?.loading ? (
            <Loading color={colors.primary} />
          ) : (
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              <CloseBtn onPress={close} />
              <View style={styles.before}></View>
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome back
              </Text>
              <View style={styles.after}></View>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : undefined}
                style={{ flex: 1, width: "100%" }}
              >
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.form}>
                    {errors.email ? (
                      <Text style={{ color: colors.notification }}>
                        {errors.email}
                      </Text>
                    ) : (
                      <Text style={{ color: colors.text }}>Email</Text>
                    )}

                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor={colors.text + "50"}
                      value={email}
                      keyboardType="email-address"
                      onChangeText={(text) => {
                        setEmail(text.toLowerCase());
                        setErrors({ ...errors, email: "" });
                      }}
                      style={[
                        styles.input,
                        {
                          borderBottomColor: colors.primary,
                          color: colors.text,
                        },
                      ]}
                    ></TextInput>
                    {errors.password ? (
                      <Text style={{ color: colors.notification }}>
                        {errors.password}
                      </Text>
                    ) : (
                      <Text style={{ color: colors.text }}>Password</Text>
                    )}
                    {/* <Text style={{ color: colors.text }}>Password</Text> */}
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={colors.text + "50"}
                      secureTextEntry={true}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setErrors({ ...errors, password: "" });
                      }}
                      importantForAutofill="no"
                      style={[
                        styles.input,
                        {
                          borderBottomColor: colors.primary,
                          color: colors.text,
                        },
                      ]}
                    ></TextInput>
                    <TouchableOpacity>
                      <Text
                        style={{ color: colors.primary, textAlign: "right" }}
                      >
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                    {loginError && (
                      <Text
                        style={{
                          color: colors.notification,
                          textAlign: "center",
                          top: 10,
                        }}
                      >
                        {loginError}
                      </Text>
                    )}
                    <PrimaryBtn
                      onPress={handleLogin}
                      extraStyles={{ marginTop: 40 }}
                      title="Login"
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.89)", // Adds a translucent background
  },
  modalContent: {
    width: "90%", // 80% of the screen width
    height: "60%", // 60% of the screen height
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  title: {
    paddingTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
  },
  before: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: 50,
    opacity: 0.3,
    width: "50%",
    alignSelf: "flex-start",
  },
  after: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingTop: 20,
    opacity: 0.3,
    width: "50%",
    alignSelf: "flex-end",
  },
  form: {
    marginTop: 20,
    width: "100%",
    height: "100%",
  },
  input: {
    borderBottomWidth: 1,
    height: 50,
    marginBottom: 30,
  },
});

export default Login;
