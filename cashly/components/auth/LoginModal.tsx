import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import React from "react";
import validateLogin from "../../validators/loginValidator";

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
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.notification }]}
            onPress={() => close()}
          >
            <Text style={{ color: colors.text, fontSize: 20 }}>X</Text>
          </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => {
                handleLogin();
              }}
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.primary, marginTop: 20 },
              ]}
            >
              <Text style={{ color: colors.background }}>Login</Text>
            </TouchableOpacity>
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
  closeBtn: {
    width: 35,
    height: 35,
    position: "absolute",
    top: 10,
    right: 10,
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 50,
    alignItems: "center",
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
  primaryBtn: {
    top: 20,
    height: 50,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Login;
