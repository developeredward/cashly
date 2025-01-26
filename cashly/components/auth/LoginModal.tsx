import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";
import validateLogin from "../../validators/loginValidator";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import CloseBtn from "../Buttons/CloseBtn";

interface LoginProps {
  visible: boolean;
  close: () => void;
}

const Login: React.FC<LoginProps> = ({ visible, close }) => {
  const { colors } = useTheme();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  const handleLogin = () => {
    const { isValid, errors } = validateLogin(email, password);
    if (!isValid) {
      setErrors(errors);
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
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <CloseBtn onPress={close} />
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome back
          </Text>
          <View style={styles.form}>
            {errors.email ? (
              <Text style={{ color: colors.notification }}>{errors.email}</Text>
            ) : (
              <Text style={{ color: colors.text }}>Email</Text>
            )}

            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text.toLowerCase());
                setErrors({ ...errors, email: "" });
              }}
              style={[
                styles.input,
                { borderBottomColor: colors.primary, color: colors.text },
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
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
              }}
              style={[
                styles.input,
                { borderBottomColor: colors.primary, color: colors.text },
              ]}
            ></TextInput>
            <TouchableOpacity>
              <Text style={{ color: colors.primary }}>Forgot password?</Text>
            </TouchableOpacity>
            <PrimaryBtn
              onPress={handleLogin}
              extraStyles={{ marginTop: 40 }}
              title="Login"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.89)", // Adds a translucent background
    height: "1000%",
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
    marginTop: 50,
    fontSize: 25,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
  },
  form: {
    marginTop: 60,
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    // padding: 5,
    height: 50,
    marginBottom: 30,
  },
});

export default Login;
