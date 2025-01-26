import { TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from "react-native";

interface CloseBtnProps {
  onPress: () => void;
  extraStyles?: any;
}

const CloseBtn = ({ onPress, extraStyles }: CloseBtnProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.closeBtn,
        { backgroundColor: colors.notification },
        extraStyles,
      ]}
    >
      <Text style={{ color: colors.text }}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default CloseBtn;
