import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import CloseBtn from "../Buttons/CloseBtn";
import validateRegister from "../../validators/registerValidator";
import { useAuth } from "../../context/AppContext";
import Loading from "../LoadingSpinner";

interface RegisterProps {
  visible: boolean;
  close: () => void;
}

const Register: React.FC<RegisterProps> = ({ visible, close }) => {
  const { colors } = useTheme();
  const { register, authState } = useAuth();
  const [fullName, setFullName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [signUpError, setSignUpError] = React.useState<string>("");
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignup = async () => {
    const { isValid, errors } = validateRegister(
      fullName,
      email,
      password,
      password2
    );
    if (!isValid) {
      setErrors(errors);
      setSignUpError("");
      return;
    }
    try {
      const data = await register!(fullName, email, password);
    } catch (error: any) {
      setSignUpError(error.message);
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
                { backgroundColor: colors.background },
              ]}
            >
              <CloseBtn onPress={close} />
              <View style={styles.before}></View>
              <Text style={[styles.title, { color: colors.text }]}>
                Create an Account
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
                    {errors.fullName ? (
                      <Text style={{ color: colors.notification }}>
                        {errors.fullName}
                      </Text>
                    ) : (
                      <Text style={{ color: colors.text }}>Full Name</Text>
                    )}
                    <TextInput
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.text + "50"}
                      value={fullName}
                      onChangeText={(text) => {
                        setFullName(text);
                        setErrors({ ...errors, fullName: "" });
                      }}
                      style={[
                        styles.input,
                        {
                          borderBottomColor: colors.primary,
                          color: colors.text,
                        },
                      ]}
                    ></TextInput>
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
                      keyboardType="email-address"
                      value={email}
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
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={colors.text + "50"}
                      secureTextEntry={true}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setErrors({ ...errors, password: "" });
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
                      <Text style={{ color: colors.text }}>
                        Confirm Password
                      </Text>
                    )}
                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor={colors.text + "50"}
                      secureTextEntry={true}
                      value={password2}
                      onChangeText={(text) => {
                        setPassword2(text);
                        setErrors({ ...errors, password: "" });
                      }}
                      style={[
                        styles.input,
                        {
                          borderBottomColor: colors.primary,
                          color: colors.text,
                        },
                      ]}
                    ></TextInput>
                    {signUpError && (
                      <Text
                        style={{
                          color: colors.notification,
                          textAlign: "center",
                          top: -10,
                        }}
                      >
                        {signUpError}
                      </Text>
                    )}

                    <PrimaryBtn
                      onPress={handleSignup}
                      extraStyles={{ marginTop: 10 }}
                      title="Register"
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
    height: "75%", // 60% of the screen height
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  title: {
    marginTop: 20,
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
    marginTop: 50,
    opacity: 0.2,
    width: "50%",
    alignSelf: "flex-start",
  },
  after: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 20,
    opacity: 0.2,
    width: "50%",
    alignSelf: "flex-end",
  },
  form: {
    marginTop: 20,
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    height: 50,
    marginBottom: 30,
  },
});

export default Register;
