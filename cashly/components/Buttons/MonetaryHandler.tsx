import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  EvilIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

import { useNavigation } from "expo-router";

interface TransactionsHandlerProps {
  color: string;
  background: string;
}

const MonetaryHandler = ({ color, background }: TransactionsHandlerProps) => {
  const navigation: any = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("RecordTransaction")}
        style={[styles.btn, { backgroundColor: background + "90", flex: 2 }]}
      >
        <Feather name="plus" size={22} color={color} />
        <Text style={[styles.text, { color, textAlign: "center" }]}>
          Record
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: background + "50" }]}
      >
        <FontAwesome6 name="sack-dollar" size={22} color={color} />
        <Text style={[styles.text, { color: color }]}>Budgets</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: background + "30" }]}
      >
        <Feather name="target" size={22} color={color} />
        <Text style={[styles.text, { color: color }]}>Goals</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: background + "20" }]}
      >
        <Feather name="dollar-sign" size={22} color={color} />
        <Text style={[styles.text, { color: color }]}>Accounts</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    paddingTop: 2,
    textAlign: "center",
  },
  btn: {
    flex: 1.5,
    borderRadius: 50,
    marginBottom: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
  },
});
export default MonetaryHandler;
