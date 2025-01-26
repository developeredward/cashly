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
import PrimaryBtn from "../Buttons/PrimaryBtn";
import CloseBtn from "../Buttons/CloseBtn";
import validateRegister from "../../validators/registerValidator";

interface RegisterProps {
  visible: boolean;
  close: () => void;
}

const Register: React.FC<RegisterProps> = ({ visible, close }) => {
  const { colors } = useTheme();
  const [fullName, setFullName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSignup = () => {
    const { isValid, errors } = validateRegister(
      fullName,
      email,
      password,
      password2
    );
    if (!isValid) {
      setErrors(errors);
    } else {
      console.log({ fullName, email, password });
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
            Create an Account
          </Text>
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
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setErrors({ ...errors, fullName: "" });
              }}
              style={[
                styles.input,
                { borderBottomColor: colors.primary, color: colors.text },
              ]}
            ></TextInput>
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
            {errors.password ? (
              <Text style={{ color: colors.notification }}>
                {errors.password}
              </Text>
            ) : (
              <Text style={{ color: colors.text }}>Confirm Password</Text>
            )}
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={true}
              value={password2}
              onChangeText={(text) => {
                setPassword2(text);
                setErrors({ ...errors, password: "" });
              }}
              style={[
                styles.input,
                { borderBottomColor: colors.primary, color: colors.text },
              ]}
            ></TextInput>

            <PrimaryBtn
              onPress={handleSignup}
              extraStyles={{ marginTop: 40 }}
              title="Register"
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

export default Register;
