import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useTheme } from "@react-navigation/native";

interface CustomHeaderProps {
  title: string;
}

const CustomHeader = ({ title }: CustomHeaderProps) => {
  const { colors } = useTheme();
  const navigation: any = useNavigation();
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: colors.primary + "20",
            borderRadius: 50,
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back-sharp" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, flex: 1 }]}>
          {title}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
});

export default CustomHeader;
