import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "@react-navigation/native";
import React from "react";

const Card = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          padding: 20,
          borderRadius: 10,
          margin: 10,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Cards are not supported yet!
        </Text>
        <View
          style={{
            marginTop: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 5,
            backgroundColor: colors.background,
          }}
        >
          <Text style={{ color: colors.text, textAlign: "center" }}>
            Please check back later for updates.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Card;
