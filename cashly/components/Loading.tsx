import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

const Loading = () => {
  const { colors } = useTheme();
  return (
    <View>
      <Text
        style={{
          color: colors.text,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        Loading
      </Text>
    </View>
  );
};

export default Loading;
