import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";

interface PrimaryBtnProps {
  onPress: () => void;
  title: string;
  extraStyles?: any;
}

const PrimaryBtn = ({ onPress, title, extraStyles }: PrimaryBtnProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.primaryBtn,
        { backgroundColor: colors.primary },
        extraStyles,
      ]}
    >
      <Text style={{ color: colors.background }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    height: 50,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PrimaryBtn;
